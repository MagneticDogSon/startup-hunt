import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/shared/lib/prisma';
import { canEditStartup } from '@/shared/lib/permissions';
import { rateLimit, rateLimitResponse } from '@/shared/lib/rate-limit';
import { saveStartupFiles } from '@/modules/startups/lib/startup-files';
import { authWithFreshRole } from '@/modules/auth/lib/session';

export async function POST(request: Request) {
  const session = await authWithFreshRole();
  if (!session?.user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const limited = rateLimit(`uploads:${session.user.id}`, 20, 60_000);
  if (!limited.ok) return rateLimitResponse(limited);

  const formData = await request.formData();
  const startupId = formData.get('startupId') as string;
  if (!startupId) {
    return NextResponse.json({ error: 'startupId обязателен' }, { status: 400 });
  }

  const startup = await prisma.startup.findUnique({
    where: { id: startupId },
    include: { files: true },
  });
  if (!startup) {
    return NextResponse.json({ error: 'Стартап не найден' }, { status: 404 });
  }

  if (!canEditStartup(session.user.role, session.user.id, startup.authorId)) {
    return NextResponse.json({ error: 'Нет прав' }, { status: 403 });
  }

  const files = formData
    .getAll('files')
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) {
    return NextResponse.json({ error: 'Выберите файлы' }, { status: 400 });
  }

  const primaryRaw = formData.get('primaryFileIndex');
  const primaryFileIndex =
    primaryRaw !== null && primaryRaw !== '' ? Number(primaryRaw) : -1;

  try {
    await saveStartupFiles(startupId, files, {
      primaryFileIndex: Number.isFinite(primaryFileIndex) ? primaryFileIndex : -1,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ошибка загрузки';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  revalidatePath(`/startups/${startupId}`);
  return NextResponse.json({ success: true });
}
