# Build Plan — Startup Hunt MVP

## Этап 1: Scaffold — DONE

- [x] Next.js scaffold (manual — folder name "top 5" blocks create-next-app)
- [x] Prisma + SQLite schema + migrate
- [x] Auth.js (NextAuth v5) credentials provider
- [x] UI components (Tailwind + custom primitives)
- [x] Seed первого admin
- [x] `.env` + `.gitignore` для uploads и dev.db

## Этап 2: Auth + роли — DONE

- [x] Страницы `/login`, `/register`
- [x] Server Action регистрации (role = PENDING)
- [x] Middleware: редирект неавторизованных на `/login`
- [x] Middleware: PENDING → страница ожидания
- [x] Страница `/admin/users` — таблица пользователей + select роли
- [x] Server Action смены роли (только admin)

## Этап 3: Карточки стартапа — DONE

- [x] `StartupForm` — title, description
- [x] `/startups/new` — создание (founder, admin)
- [x] `/startups/[id]` — детальная страница
- [x] `/startups/[id]/edit` — редактирование (author, admin)
- [x] Server Actions CRUD с Zod-валидацией
- [x] `lib/permissions.ts` — проверки на каждом действии

## Этап 4: Файлы — DONE

- [x] `FileUpload` компонент
- [x] `POST /api/uploads` — multipart, лимиты (10 MB, 5 файлов)
- [x] Whitelist MIME: pdf, png, jpg, jpeg, zip, docx
- [x] Список файлов на детальной странице
- [x] `GET /api/uploads/[id]` — скачивание

## Этап 5: Голосование — DONE

- [x] `VoteButtons` — ▲/▼ + счётчик
- [x] `POST /api/votes` — upsert, value ∈ {-1, 1}
- [x] Только evaluator может голосовать
- [x] Подсветка активного голоса
- [x] Кнопки на таблице и детальной странице

## Этап 6: Таблица + фильтры — DONE

- [x] `/startups` — главный экран (таблица)
- [x] `searchParams`: `q` (поиск), `sort` (score|date), `order` (asc|desc)
- [x] Поиск по title OR description (case-insensitive)
- [x] Сортировка по score (default desc) или createdAt
- [x] Empty state, mobile stack layout
- [x] `npm run build` passes
