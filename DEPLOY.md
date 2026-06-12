# Деплой Startup Hunt в интернет

## Репозиторий

https://github.com/MagneticDogSon/startup-hunt

## Вариант A — Render (рекомендуется для SQLite + загрузки файлов)

1. Откройте https://dashboard.render.com/select-repo?type=blueprint
2. Подключите GitHub и выберите `startup-hunt`
3. Render подхватит `render.yaml` автоматически
4. В панели сервиса задайте:
   - `AUTH_URL` — URL вида `https://startup-hunt-xxxx.onrender.com`
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — учётка администратора
5. После деплоя откройте URL из Render Dashboard

## Вариант B — Vercel

1. Импортируйте репозиторий на https://vercel.com/new
2. Добавьте переменные окружения из `.env.example`
3. Для CI добавьте secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

> SQLite на serverless-хостинге эфемерен — для продакшена лучше Render с диском (`render.yaml`).

## Локальный push

```powershell
cd production
git push -u origin main
```
