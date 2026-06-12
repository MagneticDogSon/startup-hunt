import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/shared/lib/prisma';
import { canVote, canVoteOnStartup } from '@/shared/lib/permissions';
import { rateLimit, rateLimitResponse } from '@/shared/lib/rate-limit';
import { VoteSchema } from '@/shared/lib/schemas';
import { authWithFreshRole } from '@/modules/auth/lib/session';

export async function POST(request: Request) {
  const session = await authWithFreshRole();
  if (!session?.user || !canVote(session.user.role)) {
    return NextResponse.json({ error: 'Нет прав на голосование' }, { status: 403 });
  }

  const limited = rateLimit(`votes:${session.user.id}`, 60, 60_000);
  if (!limited.ok) return rateLimitResponse(limited);

  const body = await request.json();
  const parsed = VoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 });
  }

  const { startupId, value } = parsed.data;

  const startup = await prisma.startup.findUnique({ where: { id: startupId } });
  if (!startup) {
    return NextResponse.json({ error: 'Стартап не найден' }, { status: 404 });
  }

  if (!canVoteOnStartup(session.user.id, startup.authorId)) {
    return NextResponse.json(
      { error: 'Нельзя голосовать за свой стартап' },
      { status: 403 },
    );
  }

  const existing = await prisma.vote.findUnique({
    where: {
      userId_startupId: {
        userId: session.user.id,
        startupId,
      },
    },
  });

  if (existing && existing.value === value) {
    await prisma.vote.delete({
      where: { userId_startupId: { userId: session.user.id, startupId } },
    });
  } else {
    await prisma.vote.upsert({
      where: {
        userId_startupId: { userId: session.user.id, startupId },
      },
      update: { value },
      create: {
        userId: session.user.id,
        startupId,
        value,
      },
    });
  }

  revalidatePath('/startups');
  revalidatePath(`/startups/${startupId}`);

  return NextResponse.json({ success: true });
}
