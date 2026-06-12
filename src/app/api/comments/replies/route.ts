import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/shared/lib/prisma';
import { canReplyToComments } from '@/shared/lib/permissions';
import { rateLimit, rateLimitResponse } from '@/shared/lib/rate-limit';
import { CommentReplySchema, DeleteCommentReplySchema } from '@/shared/lib/schemas';
import { authWithFreshRole } from '@/modules/auth/lib/session';

export async function POST(request: Request) {
  const session = await authWithFreshRole();
  if (!session?.user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const limited = rateLimit(`replies:${session.user.id}`, 30, 60_000);
  if (!limited.ok) return rateLimitResponse(limited);

  const body = await request.json();
  const parsed = CommentReplySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 });
  }

  const { commentId, body: replyBody } = parsed.data;

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { startup: { select: { id: true, authorId: true } } },
  });

  if (!comment) {
    return NextResponse.json({ error: 'Комментарий не найден' }, { status: 404 });
  }

  if (
    !canReplyToComments(session.user.id, comment.startup.authorId)
  ) {
    return NextResponse.json(
      { error: 'Ответить может только автор карточки' },
      { status: 403 },
    );
  }

  const reply = await prisma.commentReply.upsert({
    where: { commentId },
    update: { body: replyBody },
    create: {
      commentId,
      userId: session.user.id,
      body: replyBody,
    },
    include: {
      user: { select: { id: true, name: true } },
    },
  });

  revalidatePath('/startups');
  revalidatePath(`/startups/${comment.startup.id}`);

  return NextResponse.json({ reply });
}

export async function DELETE(request: Request) {
  const session = await authWithFreshRole();
  if (!session?.user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const limited = rateLimit(`replies-del:${session.user.id}`, 30, 60_000);
  if (!limited.ok) return rateLimitResponse(limited);

  const body = await request.json();
  const parsed = DeleteCommentReplySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 });
  }

  const { commentId } = parsed.data;

  const existing = await prisma.commentReply.findUnique({
    where: { commentId },
    include: {
      comment: {
        include: { startup: { select: { id: true, authorId: true } } },
      },
    },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Ответ не найден' }, { status: 404 });
  }

  if (
    !canReplyToComments(
      session.user.id,
      existing.comment.startup.authorId,
    )
  ) {
    return NextResponse.json(
      { error: 'Удалить ответ может только автор карточки' },
      { status: 403 },
    );
  }

  await prisma.commentReply.delete({ where: { id: existing.id } });

  revalidatePath('/startups');
  revalidatePath(`/startups/${existing.comment.startup.id}`);

  return NextResponse.json({ success: true });
}
