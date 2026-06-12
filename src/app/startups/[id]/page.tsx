import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { authWithFreshRole } from '@/modules/auth/lib/session';
import { prisma } from '@/shared/lib/prisma';
import {
  canComment,
  canEditStartup,
  canReplyToComments,
  canViewStartups,
  canVote,
  canVoteOnStartup,
} from '@/shared/lib/permissions';
import { calcScore } from '@/modules/startups/lib/startups';
import { DashboardShell } from '@/shared/components/dashboard-shell';
import { DeleteStartupButton } from '@/modules/startups/components/delete-startup-button';
import { VotePanel } from '@/modules/startups/components/vote-panel';
import { StartupFilesDisplay } from '@/modules/startups/components/startup-files-display';
import { StartupComments } from '@/modules/comments/components/startup-comments';
import { Button } from '@/shared/components/ui/button';

export default async function StartupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await authWithFreshRole();
  if (!session?.user) redirect('/login');
  if (!canViewStartups(session.user.role)) redirect('/pending');

  const { id } = await params;
  const startup = await prisma.startup.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true } },
      files: { orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }] },
      votes: { select: { value: true, userId: true } },
      comments: {
        orderBy: { updatedAt: 'desc' },
        include: {
          user: { select: { id: true, name: true } },
          reply: {
            include: { user: { select: { id: true, name: true } } },
          },
        },
      },
    },
  });

  if (!startup) notFound();

  const score = calcScore(startup.votes);
  const userVote =
    startup.votes.find((v: { userId: string; value: number }) => v.userId === session.user.id)?.value ?? null;
  const editable = canEditStartup(
    session.user.role,
    session.user.id,
    startup.authorId,
  );

  const fileRecords = startup.files.map((f) => ({
    id: f.id,
    originalName: f.originalName,
    mimeType: f.mimeType,
    size: f.size,
    isPrimary: f.isPrimary,
  }));

  const commentRecords = startup.comments.map((c) => ({
    id: c.id,
    body: c.body,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    user: c.user,
    reply: c.reply
      ? {
          id: c.reply.id,
          body: c.reply.body,
          createdAt: c.reply.createdAt.toISOString(),
          updatedAt: c.reply.updatedAt.toISOString(),
          user: c.reply.user,
        }
      : null,
  }));

  const canReply = canReplyToComments(session.user.id, startup.authorId);

  return (
    <DashboardShell>
      <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-border bg-surface p-6">
        <div>
          <span className="rounded bg-primary/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
            Карточка проекта
          </span>
          <h1 className="mt-2 text-2xl font-bold text-foreground">{startup.title}</h1>
          <p className="mt-1 text-xs text-muted">
            {startup.author.name} ·{' '}
            {new Intl.DateTimeFormat('ru-RU').format(startup.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <VotePanel
            key={startup.id}
            startupId={startup.id}
            score={score}
            userVote={userVote}
            canVote={
              canVote(session.user.role) &&
              canVoteOnStartup(session.user.id, startup.authorId)
            }
            layout="inline"
          />
          {editable && (
            <>
              <Link href={`/startups/${startup.id}/edit`}>
                <Button variant="outline" size="sm">
                  Редактировать
                </Button>
              </Link>
              <DeleteStartupButton
                startupId={startup.id}
                startupTitle={startup.title}
                compact
              />
            </>
          )}
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-muted">
          Описание стартапа
        </h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
          {startup.description}
        </p>
      </div>

      <section className="mb-8 rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-wider text-muted">
          Прикрепленные материалы
        </h2>
        <StartupFilesDisplay files={fileRecords} />
      </section>

      <StartupComments
        key={startup.id}
        startupId={startup.id}
        comments={commentRecords}
        canComment={canComment(session.user.role)}
        canReply={canReply}
        currentUserId={session.user.id}
      />

      <div className="mt-8">
        <Link href="/startups" className="text-sm text-muted hover:text-primary">
          ← Назад к списку
        </Link>
      </div>
    </DashboardShell>
  );
}
