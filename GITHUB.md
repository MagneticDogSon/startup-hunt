# Публикация на GitHub

Эта папка — готовая к заливке версия проекта **без** dev-артефактов.

## Что включено

- `src/` — исходный код
- `prisma/` — схема и миграции (без локальной БД)
- `tests/`, `deploy/`, `docs/`, `demo-screenshots/`
- конфиги: `package.json`, `tsconfig.json`, `.env.example`, `.gitignore`

## Что не включено (создаётся локально)

- `node_modules/` → `npm install`
- `.next/` → `npm run build`
- `.env` — скопируйте из `.env.example`
- `uploads/`, `*.db` — runtime-данные

## Как залить на GitHub

```bash
cd production
git init
git add .
git commit -m "Initial commit: Startup Hunt MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USER/startup-hunt.git
git push -u origin main
```

## Сборка и запуск

```bash
cp .env.example .env   # отредактируйте AUTH_SECRET и пароли
npm install
npm run db:migrate
npm run db:seed
npm run build
npm start
```

> **Важно:** для `npm run build` используйте путь `production/` (латиница).  
> Папка `продакшн` — это ярлык на `production`; Next.js/Turbopack не собирает проект из пути с кириллицей.
