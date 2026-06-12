# Library Docs — Startup Hunt

Краткие шпаргалки по ключевым библиотекам проекта.

## Prisma

```bash
npx prisma migrate dev --name init   # создать миграцию
npx prisma db seed                   # seed admin
npx prisma studio                    # GUI для БД
```

**Score агрегация:**

```ts
const startups = await prisma.startup.findMany({
  include: {
    author: { select: { name: true } },
    votes: { select: { value: true } },
    _count: { select: { votes: true } },
  },
});
// score = startup.votes.reduce((s, v) => s + v.value, 0)
```

**Upsert голоса:**

```ts
await prisma.vote.upsert({
  where: { userId_startupId: { userId, startupId } },
  update: { value },
  create: { userId, startupId, value },
});
```

## Auth.js v5 (NextAuth)

```ts
// lib/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Credentials({ ... })],
  callbacks: {
    jwt({ token, user }) { if (user) token.role = user.role; return token; },
    session({ session, token }) { session.user.role = token.role; return session; },
  },
});
```

**В Server Component:**

```ts
const session = await auth();
if (!session) redirect('/login');
```

**Middleware:** matcher на `/startups`, `/admin/*`.

## shadcn/ui

```bash
npx shadcn@latest add button input table select label textarea toast badge
```

Используем `variant="default"` для primary (оранжевый через CSS vars).

## Zod

```ts
// lib/schemas.ts
export const CreateStartupSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(5000),
});

export const VoteSchema = z.object({
  startupId: z.string(),
  value: z.union([z.literal(1), z.literal(-1)]),
});
```

## Next.js App Router

**Фильтры через searchParams:**

```ts
export default async function StartupsPage({
  searchParams,
}: { searchParams: Promise<{ q?: string; sort?: string; order?: string }> }) {
  const params = await searchParams;
  // ...
}
```

**Revalidation после мутации:**

```ts
import { revalidatePath } from 'next/cache';
revalidatePath('/startups');
```

## bcryptjs

```ts
import bcrypt from 'bcryptjs';
const hash = await bcrypt.hash(password, 10);
const ok = await bcrypt.compare(password, hash);
```
