# Architecture — Startup Hunt

## Стек

| Слой | Технология |
|------|------------|
| Framework | Next.js 15+ (App Router) + TypeScript |
| DB | SQLite через Prisma 5 |
| Auth | Auth.js (NextAuth v5) — credentials provider |
| Uploads | Локальная папка `uploads/` (MVP) |
| UI | Tailwind CSS + shadcn/ui |
| Валидация | Zod |

## Структура проекта

```
src/
  app/                     — маршруты Next.js (тонкий слой)
    (auth)/login, register
    startups/              — таблица + деталь
    startups/new           — форма (founder)
    startups/[id]/edit     — редактирование (author, admin)
    admin/users            — назначение ролей (admin)
    api/
      auth/[...nextauth]
      votes/
      comments/, comments/replies/
      uploads/
  modules/
    auth/                  — auth.ts, session, roles, формы входа
    startups/              — CRUD, файлы, таблица, голоса
    admin/                 — панель администратора
    landing/               — публичный лендинг
    comments/              — UI комментариев
  shared/
    lib/                   — prisma, permissions, security, schemas…
    components/ui/         — shadcn
  middleware.ts            — edge-safe auth gate
prisma/
  schema.prisma
  seed.ts
tests/                     — unit-тесты (node:test)
docs/                      — документация (architecture, brief…)
uploads/                   — gitignored
```

См. также [`README.md`](../README.md) и [`src/modules/README.md`](../src/modules/README.md).

## Модель данных

```prisma
model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  name         String
  role         String    @default("PENDING")  // PENDING|FOUNDER|EVALUATOR|ADMIN
  createdAt    DateTime  @default(now())
  startups     Startup[]
  votes        Vote[]
  comments     Comment[]
  commentReplies CommentReply[]
}

model Startup {
  id          String        @id @default(cuid())
  title       String
  description String
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  authorId    String
  author      User          @relation(fields: [authorId], references: [id])
  files       StartupFile[]
  votes       Vote[]
  comments    Comment[]
}

model StartupFile {
  id           String   @id @default(cuid())
  startupId    String
  startup      Startup  @relation(fields: [startupId], references: [id], onDelete: Cascade)
  filename     String
  originalName String
  mimeType     String
  size         Int
  isPrimary    Boolean  @default(false)
  createdAt    DateTime @default(now())
}

model Vote {
  id        String  @id @default(cuid())
  userId    String
  startupId String
  value     Int     // -1 or 1
  user      User    @relation(fields: [userId], references: [id])
  startup   Startup @relation(fields: [startupId], references: [id], onDelete: Cascade)
  @@unique([userId, startupId])
}

model Comment {
  id        String   @id @default(cuid())
  userId    String
  startupId String
  body      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
  startup   Startup  @relation(fields: [startupId], references: [id], onDelete: Cascade)
  reply     CommentReply?
  @@unique([userId, startupId])  // один комментарий на стартап от оценщика
}

model CommentReply {
  id        String   @id @default(cuid())
  commentId String   @unique
  userId    String
  body      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  comment   Comment  @relation(fields: [commentId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id])
}
```

**Score:** `SUM(votes.value)` где `value ∈ {-1, 1}` — вычисляется при запросе списка.

## Права доступа (`lib/permissions.ts`)

| Действие | pending | founder | evaluator | admin |
|----------|---------|---------|-----------|-------|
| Видеть таблицу | нет | да | да | да |
| Создать карточку | нет | да | нет | нет |
| Редактировать карточку | нет | свои | нет | все |
| Голосовать | нет | нет | да | нет |
| Комментировать | нет | нет | да | нет |
| Отвечать на комментарии | нет | автор | нет | нет* |
| Назначать роли | нет | нет | нет | да |

\* Админ не отвечает на комментарии, если не является автором карточки.

Критичные API и `/admin` используют `authWithFreshRole()` — роль читается из БД, а не только из JWT.

## Потоки

### Голосование

`POST /api/votes` → upsert/delete Vote → `revalidatePath('/startups')` → score пересчитывается при следующем GET.

### Комментарии

`POST /api/comments` — upsert комментария оценщика.  
`POST /api/comments/replies` — ответ автора карточки.

### Загрузка файлов

`POST /api/uploads` → magic-byte проверка → сохранение в `uploads/{startupId}/` → запись StartupFile в БД.

Лимиты: 10 MB на файл, 20 файлов на стартап, 50 MB суммарно. При ошибке загрузки — откат частичных файлов; при создании стартапа — удаление пустой карточки.

### Auth

Credentials provider → bcrypt verify → session с `role` в JWT. Роль в JWT обновляется при каждом `auth()` из БД.

## Переменные окружения

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="..."
AUTH_URL="https://your-domain.example"   # продакшен: только https
ENFORCE_HTTPS="true"                     # продакшен: редирект http→https, HSTS, secure cookies
ADMIN_EMAIL="admin@local.dev"
ADMIN_PASSWORD="..."   # только для локальной разработки!
```

**Не используйте дефолтные пароли из seed в продакшене.**

Локально `ENFORCE_HTTPS` не задавайте — иначе HSTS и редирект сломают `http://localhost`.

## HTTPS и TLS 1.3

Next.js не терминирует TLS сам. В продакшене:

1. Reverse proxy с **TLS 1.3 only** — готовые конфиги в `deploy/Caddyfile` и `deploy/nginx.conf`.
2. Proxy передаёт `X-Forwarded-Proto: https` и `X-Forwarded-Host`.
3. В `.env` на сервере: `ENFORCE_HTTPS=true`, `AUTH_URL=https://…`.

При `ENFORCE_HTTPS=true` приложение:

- редиректит HTTP → HTTPS (308);
- отдаёт `Strict-Transport-Security` (HSTS, 2 года);
- ставит `Secure` на session cookies (Auth.js) и служебные cookies;
- добавляет `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`.

**Caddy (рекомендуется для MVP):**

```bash
# Отредактируйте домен в deploy/Caddyfile, затем:
caddy run --config deploy/Caddyfile
```

**nginx:** скопируйте `deploy/nginx.conf`, укажите сертификаты и `server_name`.

## Защита приложения

| Мера | Где |
|------|-----|
| Middleware auth gate | Неавторизованные → `/login`; API → 401 |
| Свежая роль из БД | `authWithFreshRole()` в API и server actions |
| Rate limit | Login (form + `authorize`), `/api/auth`, votes, comments, uploads, register, startups |
| CSP + security headers | `lib/security.ts`, middleware, `next.config.ts` |
| Magic-byte upload validation | `lib/file-sniff.ts` (ZIP отключён) |
| Path traversal guard | `lib/path-safe.ts` при чтении файлов |
| Secure cookies / HSTS | при `ENFORCE_HTTPS=true` |
| Пароль при регистрации | мин. 10 символов, буква + цифра; bcrypt cost 12 |

## Rate limiting (in-memory, MVP)

| Endpoint / action | Лимит |
|-------------------|-------|
| Login | 10 / мин на email+IP |
| Register | 5 / мин на IP |
| Votes | 60 / мин на пользователя |
| Comments / replies | 30 / мин |
| Uploads | 20 / мин |
| Auth API (`/api/auth`) | 30 / мин на IP |
| Создание стартапа | 10 / мин на пользователя |
| Обновление стартапа | 20 / мин на пользователя |

## Риски MVP

- SQLite — один файл, без отдельного сервера; для продакшена → Postgres
- Локальные файлы — не работают на serverless; для MVP на VPS/локально — ок
- In-memory rate limit — не работает при нескольких инстансах
- Нет email verification — admin вручную активирует роли
- `getStartupsList` загружает все стартапы в память — для продакшена нужна пагинация
