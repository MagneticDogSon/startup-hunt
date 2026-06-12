# UI Registry — Startup Hunt

Реестр компонентов. Обновлено: 2026-06-12

## Компоненты

| Компонент | Путь | Назначение | Статус |
|-----------|------|------------|--------|
| `StartupTable` | `components/startup-table.tsx` | Таблица + mobile stack + VoteButtons | done |
| `VoteButtons` | `components/vote-buttons.tsx` | ▲▼ + счётчик, optimistic update | done |
| `StartupForm` | `components/startup-form.tsx` | Форма create/edit карточки | done |
| `FileUpload` | `components/file-upload.tsx` | Multipart upload zone | done |
| `RoleBadge` | `components/role-badge.tsx` | Бейдж роли пользователя | done |
| `AdminUserTable` | `components/admin-user-table.tsx` | Таблица пользователей + смена роли | done |
| `Navbar` | `components/navbar.tsx` | Навигация по ролям | done |
| `StartupFilters` | `components/startup-filters.tsx` | Поиск и сортировка (GET form) | done |
| `DashboardShell` | `components/dashboard-shell.tsx` | Layout с Navbar | done |
| `LandingPage` | `components/landing-page.tsx` | Публичный лендинг `/` | done |
| `LandingMockup` | `components/landing-mockup.tsx` | Hero mockup таблицы рейтингов | done |

## UI primitives (`components/ui/`)

| Компонент | Путь | Варианты |
|-----------|------|----------|
| Button | `components/ui/button.tsx` | default, outline, ghost, destructive |
| Input | `components/ui/input.tsx` | — |
| Label | `components/ui/label.tsx` | — |
| Textarea | `components/ui/textarea.tsx` | — |
| Select | `components/ui/select.tsx` | native select |
| Badge | `components/ui/badge.tsx` | default, muted, role variants |

## Паттерны

- Primary color: `#FF6154` via CSS vars in `app/globals.css`
- Typography: **Source Sans 3** (body, `font-sans`) + **Lora** (headings, `.font-display`, кириллица)
- Auth pages: `AuthPageShell` — gradient bg + logo link to `/`
- Лендинг: hero gradient `from-primary/[0.09]`, bento features, vertical timeline (no icon-in-circle grids)
- Лендинг: sticky navbar + backdrop-blur, focus ring `ring-primary ring-offset-2`
- Иконки: Lucide, 20px в feature-карточках
- CTA-ссылки: `transition-colors duration-200`, min touch 44px на lg-кнопках
- Формы: Server Actions + redirect on error
- Таблица: desktop `<table>`, mobile stack cards
- Фильтры: GET form → `searchParams` on `/startups`
