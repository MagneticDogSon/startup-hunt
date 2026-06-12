# Модули Startup Hunt

Код разделён по **доменным модулям**. Каждый модуль содержит свою логику, компоненты и server actions. Общий код — в `src/shared/`.

## Принципы

1. **`src/app/`** — только маршруты: страницы импортируют из модулей, API вызывает shared/lib и модули.
2. **Модуль не импортирует из другого модуля напрямую**, кроме `auth` (роли/сессия) — через `@/modules/auth/...`.
3. **Cross-cutting concerns** (Prisma, security, permissions) — в `src/shared/lib/`.

## auth

```
auth/
├── lib/          auth.ts, auth.config.ts, session.ts, roles.ts
├── actions/      login, register, signOut
└── components/   register-form, navbar
```

Отвечает за аутентификацию, JWT-сессию и константы ролей.

## startups

```
startups/
├── lib/          startups.ts (списки, score), startup-files.ts (upload)
├── actions/      create, update, delete
└── components/   таблица, форма, файлы, превью, vote-panel
```

Ядро продукта: карточки, рейтинг, вложения.

## admin

```
admin/
├── actions/      changeRole, createEvaluator
└── components/   shell, nav, user-table, create-evaluator-form
```

Панель администратора (`/admin`).

## landing

```
landing/
└── components/   landing-page, landing-mockup
```

Публичная главная страница для неавторизованных.

## comments

```
comments/
└── components/   startup-comments
```

UI комментариев; API — `src/app/api/comments/`.

## shared

```
shared/
├── lib/          prisma, permissions, schemas, security, rate-limit, upload…
└── components/   dashboard-shell, role-badge, ui/*
```

Инфраструктура, используемая всеми модулями.

## Импорты

Алиас `@/*` указывает на `src/*`:

```ts
import { auth } from '@/modules/auth/lib/auth';
import { canVote } from '@/shared/lib/permissions';
import { Button } from '@/shared/components/ui/button';
```
