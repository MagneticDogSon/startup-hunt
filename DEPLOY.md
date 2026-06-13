# Деплой: GitHub + Supabase + Vercel

Бесплатный стек для полной платформы Startup Hunt.

| Сервис | Роль |
|--------|------|
| [GitHub](https://github.com/MagneticDogSon/startup-hunt) | Код, CI |
| [Supabase](https://supabase.com) | Postgres + файлы |
| [Vercel](https://vercel.com) | Next.js хостинг |

Лендинг (статика): [startup-hunt-landing](https://magneticdogson.github.io/startup-hunt-landing/) на GitHub Pages.

---

## 1. Supabase

1. Создайте проект на https://supabase.com/dashboard  
2. **Database** → Connection string:
   - **Transaction pooler** (port `6543`) → `DATABASE_URL`
   - **Direct** (port `5432`) → `DIRECT_URL`
3. **Storage** → New bucket:
   - Name: `startup-files`
   - **Private** bucket (доступ только через service role на сервере)
4. **Project Settings → API**:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (только на сервере, не в клиенте)

### Миграции БД (один раз)

```bash
cp .env.example .env
# заполните DATABASE_URL и DIRECT_URL

npm install
npx prisma migrate deploy
npm run db:seed
```

---

## 2. Vercel

1. https://vercel.com/new → Import `MagneticDogSon/startup-hunt`
2. **Environment Variables** (Production):

| Variable | Значение |
|----------|----------|
| `DATABASE_URL` | Pooler URL (6543, `?pgbouncer=true`) |
| `DIRECT_URL` | Direct URL (5432) |
| `SUPABASE_URL` | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_URL` | `https://your-app.vercel.app` |
| `ENFORCE_HTTPS` | `true` |
| `ADMIN_EMAIL` | email админа |
| `ADMIN_PASSWORD` | надёжный пароль |

3. Deploy — `vercel.json` выполнит `prisma migrate deploy` при сборке.

После первого деплоя (опционально):

```bash
npm run db:seed
```

локально с production `DATABASE_URL`, или создайте админа через регистрацию + SQL.

---

## 3. GitHub Actions (опционально)

Файл `.github/workflows/deploy-vercel.yml` — автодеплой при push в `main`.

Secrets в репозитории:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

---

## Локальная разработка

```bash
npm install
cp .env.example .env
# Postgres: Supabase connection strings
# Storage: можно не задавать SUPABASE_* — файлы пойдут в ./uploads/

npx prisma migrate deploy
npm run db:seed
npm run dev
```

---

## Лимиты Free tier

- **Supabase**: 500 MB БД, 1 GB Storage, пауза после 1 недели без активности
- **Vercel Hobby**: личные проекты, ~1M function invocations/мес
