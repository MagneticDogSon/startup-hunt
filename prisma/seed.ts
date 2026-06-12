import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { Role } from '@/modules/auth/lib/roles';

const prisma = new PrismaClient();

const WEAK_DEFAULTS = new Set([
  'admin12345',
  'founder12345',
  'evaluator12345',
]);

function assertSafeSeedPassword(password: string, label: string) {
  if (process.env.NODE_ENV === 'production' && WEAK_DEFAULTS.has(password)) {
    throw new Error(
      `Refusing to seed ${label} with a default password in production. Set env vars.`,
    );
  }
}

async function upsertUser(
  email: string,
  password: string,
  name: string,
  role: (typeof Role)[keyof typeof Role],
) {
  assertSafeSeedPassword(password, email);
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { role, passwordHash, name },
    create: { email, passwordHash, name, role },
  });
  console.log(`Seeded ${role.toLowerCase()}: ${email}`);
}

async function main() {
  await upsertUser(
    process.env.ADMIN_EMAIL ?? 'admin@local.dev',
    process.env.ADMIN_PASSWORD ?? 'admin12345',
    'Admin',
    Role.ADMIN,
  );

  await upsertUser(
    process.env.FOUNDER_EMAIL ?? 'founder@local.dev',
    process.env.FOUNDER_PASSWORD ?? 'founder12345',
    'Founder',
    Role.FOUNDER,
  );

  await upsertUser(
    process.env.EVALUATOR_EMAIL ?? 'evaluator@local.dev',
    process.env.EVALUATOR_PASSWORD ?? 'evaluator12345',
    'Анна К.',
    Role.EVALUATOR,
  );

  await upsertUser(
    'reviewer2@local.dev',
    process.env.EVALUATOR_PASSWORD ?? 'evaluator12345',
    'Игорь М.',
    Role.EVALUATOR,
  );

  const startup = await prisma.startup.findFirst({
    orderBy: { createdAt: 'asc' },
  });

  if (startup) {
    const demoComments = [
      {
        email: process.env.EVALUATOR_EMAIL ?? 'evaluator@local.dev',
        body:
          'Идея понятна, но пока не ясно, чем вы отличаетесь от существующих решений. Добавьте в описание конкретный use case и метрики, которые планируете улучшать.',
      },
      {
        email: 'reviewer2@local.dev',
        body:
          'Презентация цепляет, но не хватает блока про монетизацию. Интересно было бы увидеть план выхода на первых 10 платящих клиентов.',
      },
    ] as const;

    for (const { email, body } of demoComments) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) continue;

      await prisma.comment.upsert({
        where: {
          userId_startupId: { userId: user.id, startupId: startup.id },
        },
        update: { body },
        create: {
          userId: user.id,
          startupId: startup.id,
          body,
        },
      });
    }

    console.log(`Seeded reviewer comments on startup: ${startup.title}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
