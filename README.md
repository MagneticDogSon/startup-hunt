# Startup Hunt

Минималистичная платформа в духе Product Hunt: основатели публикуют карточки стартапов, эксперты голосуют и оставляют обратную связь, рейтинг формируется открыто.

## Быстрый старт

```bash
# Установка зависимостей
npm install

# Настройка окружения (скопируйте и отредактируйте)
cp .env.example .env

# Миграции и демо-данные
npm run db:migrate
npm run db:seed

# Разработка
npm run dev
```

Приложение: [http://localhost:3000](http://localhost:3000)

## Структура проекта

```
startup-hunt/                 # корень репозитория
├── src/                      # весь исходный код приложения
│   ├── app/                  # маршруты Next.js (тонкий слой)
│   ├── modules/              # функциональные модули
│   │   ├── auth/             # вход, регистрация, сессии, роли
│   │   ├── startups/         # карточки, файлы, голосование
│   │   ├── admin/            # панель администратора
│   │   ├── landing/          # публичный лендинг
│   │   └── comments/         # комментарии и ответы
│   ├── shared/               # общие утилиты и UI
│   │   ├── lib/              # prisma, security, permissions…
│   │   └── components/ui/    # базовые компоненты (shadcn)
│   ├── types/                # расширения типов (NextAuth)
│   └── middleware.ts         # auth gate, HTTPS, rate limit
├── prisma/                   # схема БД и seed
├── tests/                    # unit-тесты (node:test)
├── deploy/                   # Caddy / nginx для продакшена
├── docs/                     # документация проекта
└── uploads/                  # загруженные файлы (gitignored)
```

Подробнее о модулях: [`src/modules/README.md`](src/modules/README.md).  
Архитектура и модель данных: [`docs/architecture.md`](docs/architecture.md).

## Модули

| Модуль | Назначение |
|--------|------------|
| **auth** | Auth.js, credentials, JWT-сессия, роли, формы входа/регистрации |
| **startups** | CRUD карточек, загрузка файлов, таблица, фильтры, голоса |
| **admin** | Назначение ролей, создание оценщиков |
| **landing** | Публичная лендинг-страница |
| **comments** | Комментарии оценщиков и ответы основателей |
| **shared** | Prisma, права доступа, rate limit, security, UI-kit |

API-маршруты остаются в `src/app/api/` — это требование Next.js App Router.

## Роли пользователей

| Роль | Возможности |
|------|-------------|
| `pending` | Ожидает назначения роли администратором |
| `founder` | Создаёт и редактирует свои карточки |
| `evaluator` | Голосует и комментирует |
| `admin` | Управляет ролями и всеми карточками |

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер (Turbopack) |
| `npm run build` | Production-сборка |
| `npm run start` | Запуск production |
| `npm run test` | Unit-тесты |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Prisma migrate dev |
| `npm run db:seed` | Заполнение демо-данными |
| `npm run db:studio` | Prisma Studio |

## Переменные окружения

См. `.env.example`. Минимум для локальной разработки:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="случайная-длинная-строка"
ADMIN_EMAIL="admin@local.dev"
ADMIN_PASSWORD="..."   # только для dev!
```

В продакшене задайте `AUTH_URL` (https) и `ENFORCE_HTTPS=true`. Подробности — в [`docs/architecture.md`](docs/architecture.md).

## Стек

- **Next.js 16** (App Router) + TypeScript  
- **Prisma 5** + SQLite (MVP)  
- **Auth.js** (NextAuth v5)  
- **Tailwind CSS 4** + shadcn/ui  
- **Zod** для валидации  

## Документация

| Файл | Содержание |
|------|------------|
| [`docs/project-overview.md`](docs/project-overview.md) | Цели MVP, scope |
| [`docs/architecture.md`](docs/architecture.md) | Архитектура, БД, API, безопасность |
| [`docs/landing-page-brief.md`](docs/landing-page-brief.md) | Бриф лендинга |
| [`docs/code-standards.md`](docs/code-standards.md) | Стандарты кода |

## Лицензия

Private — внутренний MVP.
