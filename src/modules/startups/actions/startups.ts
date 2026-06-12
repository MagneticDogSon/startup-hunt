'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/shared/lib/prisma';
import {
  canCreateStartup,
  canDeleteStartup,
  canEditStartup,
} from '@/shared/lib/permissions';
import { rateLimit } from '@/shared/lib/rate-limit';
import { shouldEnforceHttps } from '@/shared/lib/security';
import { authWithFreshRole } from '@/modules/auth/lib/session';
import { CreateStartupSchema } from '@/shared/lib/schemas';
import {
  saveStartupFiles,
  deleteStartupFiles,
  deleteStartupUploadDir,
  setStartupPrimaryFile,
} from '@/modules/startups/lib/startup-files';

export async function createStartupAction(formData: FormData) {
  const session = await authWithFreshRole();
  if (!session?.user || !canCreateStartup(session.user.role)) {
    redirect('/startups');
  }

  const limited = rateLimit(`startup-create:${session.user.id}`, 10, 60_000);
  if (!limited.ok) {
    redirect('/startups/new?error=rate');
  }

  const parsed = CreateStartupSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
  });
  if (!parsed.success) {
    redirect('/startups/new?error=validation');
  }

  const submissionId = formData.get('submissionId');
  if (typeof submissionId === 'string' && submissionId.length > 0) {
    const cookieStore = await cookies();
    const cookieName = `startup-submit-${submissionId}`;
    const existingStartupId = cookieStore.get(cookieName)?.value;
    if (existingStartupId) {
      redirect('/startups');
    }
  }

  const recentDuplicate = await prisma.startup.findFirst({
    where: {
      authorId: session.user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      createdAt: { gte: new Date(Date.now() - 30_000) },
    },
    orderBy: { createdAt: 'asc' },
  });
  if (recentDuplicate) {
    revalidatePath('/startups');
    redirect('/startups');
  }

  const startup = await prisma.startup.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      authorId: session.user.id,
    },
  });

  const files = formData
    .getAll('files')
    .filter((f): f is File => f instanceof File && f.size > 0);
  const primaryRaw = formData.get('primaryFileIndex');
  const primaryFileIndex =
    primaryRaw !== null && primaryRaw !== '' ? Number(primaryRaw) : -1;

  if (files.length > 0) {
    try {
      await saveStartupFiles(startup.id, files, {
        primaryFileIndex: Number.isFinite(primaryFileIndex)
          ? primaryFileIndex
          : -1,
      });
    } catch {
      await prisma.startup.delete({ where: { id: startup.id } });
      await deleteStartupUploadDir(startup.id);
      redirect('/startups/new?error=files');
    }
  }

  if (typeof submissionId === 'string' && submissionId.length > 0) {
    const cookieStore = await cookies();
    cookieStore.set(`startup-submit-${submissionId}`, startup.id, {
      httpOnly: true,
      sameSite: 'lax',
      secure: shouldEnforceHttps(),
      maxAge: 600,
      path: '/',
    });
  }

  revalidatePath('/startups');
  redirect('/startups');
}

export async function updateStartupAction(startupId: string, formData: FormData) {
  const session = await authWithFreshRole();
  if (!session?.user) redirect('/login');

  const limited = rateLimit(`startup-update:${session.user.id}`, 20, 60_000);
  if (!limited.ok) {
    redirect(`/startups/${startupId}/edit?error=rate`);
  }

  const startup = await prisma.startup.findUnique({
    where: { id: startupId },
    include: { files: true },
  });
  if (!startup) redirect('/startups');

  if (!canEditStartup(session.user.role, session.user.id, startup.authorId)) {
    redirect(`/startups/${startupId}`);
  }

  const parsed = CreateStartupSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
  });
  if (!parsed.success) {
    redirect(`/startups/${startupId}/edit?error=validation`);
  }

  await prisma.startup.update({
    where: { id: startupId },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
    },
  });

  const removedRaw = formData.get('removedFileIds');
  let removedFileIds: string[] = [];
  if (typeof removedRaw === 'string' && removedRaw.length > 0) {
    try {
      const parsedIds = JSON.parse(removedRaw);
      if (Array.isArray(parsedIds)) {
        removedFileIds = parsedIds.filter((id): id is string => typeof id === 'string');
      }
    } catch {
      redirect(`/startups/${startupId}/edit?error=files`);
    }
  }

  const ownedIds = new Set(startup.files.map((f) => f.id));
  const validRemoved = removedFileIds.filter((id) => ownedIds.has(id));

  try {
    if (validRemoved.length > 0) {
      await deleteStartupFiles(startupId, validRemoved);
    }

    const files = formData
      .getAll('files')
      .filter((f): f is File => f instanceof File && f.size > 0);

    const primaryNewRaw = formData.get('primaryNewFileIndex');
    const primaryNewFileIndex =
      primaryNewRaw !== null && primaryNewRaw !== '' ? Number(primaryNewRaw) : -1;
    const primaryFileId = formData.get('primaryFileId');
    const wantsNewPrimary =
      Number.isFinite(primaryNewFileIndex) && primaryNewFileIndex >= 0;

    if (files.length > 0) {
      await saveStartupFiles(startupId, files, {
        primaryFileIndex: wantsNewPrimary ? primaryNewFileIndex : -1,
        replacePrimary: wantsNewPrimary,
      });
    }

    if (
      typeof primaryFileId === 'string' &&
      primaryFileId.length > 0 &&
      !validRemoved.includes(primaryFileId)
    ) {
      await setStartupPrimaryFile(startupId, primaryFileId);
    }
  } catch {
    redirect(`/startups/${startupId}/edit?error=files`);
  }

  revalidatePath('/startups');
  revalidatePath(`/startups/${startupId}`);
  redirect(`/startups/${startupId}`);
}

export async function deleteStartupAction(startupId: string) {
  const session = await authWithFreshRole();
  if (!session?.user) redirect('/login');

  const limited = rateLimit(`startup-delete:${session.user.id}`, 10, 60_000);
  if (!limited.ok) {
    redirect(`/startups/${startupId}/edit?error=rate`);
  }

  const startup = await prisma.startup.findUnique({
    where: { id: startupId },
  });
  if (!startup) redirect('/startups');

  if (!canDeleteStartup(session.user.role, session.user.id, startup.authorId)) {
    redirect(`/startups/${startupId}`);
  }

  await prisma.startup.delete({ where: { id: startupId } });
  await deleteStartupUploadDir(startupId);

  revalidatePath('/startups');
  redirect('/startups');
}
