import { notFound, redirect } from 'next/navigation';
import { authWithFreshRole } from '@/modules/auth/lib/session';
import { prisma } from '@/shared/lib/prisma';
import { canEditStartup } from '@/shared/lib/permissions';
import { updateStartupAction } from '@/modules/startups/actions/startups';
import { DashboardShell } from '@/shared/components/dashboard-shell';
import { DeleteStartupButton } from '@/modules/startups/components/delete-startup-button';
import { StartupForm } from '@/modules/startups/components/startup-form';

export default async function EditStartupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await authWithFreshRole();
  if (!session?.user) redirect('/login');

  const { id } = await params;
  const startup = await prisma.startup.findUnique({
    where: { id },
    include: {
      files: { orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }] },
    },
  });
  if (!startup) notFound();

  if (!canEditStartup(session.user.role, session.user.id, startup.authorId)) {
    redirect(`/startups/${id}`);
  }

  const boundAction = updateStartupAction.bind(null, id);
  const existingFiles = startup.files.map((f) => ({
    id: f.id,
    originalName: f.originalName,
    mimeType: f.mimeType,
    size: f.size,
    isPrimary: f.isPrimary,
  }));

  return (
    <DashboardShell>
      <h1 className="mb-6 text-2xl font-semibold">Редактировать стартап</h1>
      <StartupForm
        action={boundAction}
        defaultValues={{
          title: startup.title,
          description: startup.description,
        }}
        existingFiles={existingFiles}
        submitLabel="Сохранить"
      />

      <section className="mt-12 max-w-2xl border-t border-border pt-8">
        <h2 className="mb-2 text-sm font-semibold text-error">Опасная зона</h2>
        <p className="mb-4 text-sm text-muted">
          Полное удаление карточки из каталога. Это действие нельзя отменить.
        </p>
        <DeleteStartupButton
          startupId={startup.id}
          startupTitle={startup.title}
        />
      </section>
    </DashboardShell>
  );
}
