# Code Standards — Startup Hunt

## TypeScript

- `strict: true` в tsconfig
- Без `any`; использовать `unknown` + type guards при необходимости
- Типы Prisma через `@prisma/client`

## Структура кода

- **Server Actions** — мутации форм (create/edit startup, register, change role)
- **Route Handlers** — uploads, votes, file download
- **Server Components** — страницы с данными, таблица
- **Client Components** — только интерактив (VoteButtons, FileUpload, формы с toast)

## Именование

| Сущность | Стиль | Пример |
|----------|-------|--------|
| Файлы | kebab-case | `startup-table.tsx` |
| Компоненты | PascalCase | `StartupTable` |
| Функции | camelCase | `getStartups` |
| Константы | UPPER_SNAKE | `MAX_FILE_SIZE` |
| Prisma models | PascalCase | `StartupFile` |

## API-ошибки

```ts
return NextResponse.json({ error: "Описание ошибки" }, { status: 400 });
```

UI показывает toast с текстом ошибки.

## Безопасность

- Пароли: bcrypt, минимум 8 символов
- Проверка роли на сервере (никогда только на клиенте)
- Upload: max 10 MB/файл, max 5 файлов на карточку
- MIME whitelist: `application/pdf`, `image/png`, `image/jpeg`, `application/zip`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

## Git

- Коммиты только по запросу пользователя
- `.env`, `uploads/`, `prisma/dev.db` в `.gitignore`

## Форматирование

- ESLint из create-next-app
- 2 пробела, одинарные кавычки в JS/TS (как в Next.js default)
