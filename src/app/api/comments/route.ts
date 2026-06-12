import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/shared/lib/prisma';
import { canComment } from '@/shared/lib/permissions';
import { rateLimit, rateLimitResponse } from '@/shared/lib/rate-limit';
import { CommentSchema, DeleteCommentSchema } from '@/shared/lib/schemas';
import { authWithFreshRole } from '@/modules/auth/lib/session';

export async function POST(request: Request) {
  const session = await authWithFreshRole();
  if (!session?.user || !canComment(session.user.role)) {
    return NextResponse.json({ error: 'Нет прав на комментирование' }, { status: 403 });
  }

  const limited = rateLimit(`comments:${session.user.id}`, 30, 60_000);
  if (!limited.ok) return rateLimitResponse(limited);

  const body = await request.json();
  const parsed = CommentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 });
  }

  const { startupId, body: commentBody } = parsed.data;

  const startup = await prisma.startup.findUnique({ where: { id: startupId } });
  if (!startup) {
    return NextResponse.json({ error: 'Стартап не найден' }, { status: 404 });
  }

  const comment = await prisma.comment.upsert({
    where: {
      userId_startupId: {
        userId: session.user.id,
        startupId,
      },
    },
    update: { body: commentBody },
    create: {
      userId: session.user.id,
      startupId,
      body: commentBody,
    },
    include: {
      user: { select: { id: true, name: true } },
    },
  });

  revalidatePath('/startups');
  revalidatePath(`/startups/${startupId}`);

  return NextResponse.json({ comment });
}

export async function DELETE(request: Request) {
  const session = await authWithFreshRole();
  if (!session?.user || !canComment(session.user.role)) {
    return NextResponse.json({ error: 'Нет прав на комментирование' }, { status: 403 });
  }

  const limited = rateLimit(`comments-del:${session.user.id}`, 30, 60_000);
  if (!limited.ok) return rateLimitResponse(limited);

  const body = await request.json();
  const parsed = DeleteCommentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 });
  }

  const { startupId } = parsed.data;

  const existing = await prisma.comment.findUnique({
    where: {
      userId_startupId: {
        userId: session.user.id,
        startupId,
      },
    },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Комментарий не найден' }, { status: 404 });
  }

  await prisma.comment.delete({
    where: { id: existing.id },
  });

  revalidatePath('/startups');
  revalidatePath(`/startups/${startupId}`);

  return NextResponse.json({ success: true });
}
