import { auth } from '@/modules/auth/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import type { Role } from '@/modules/auth/lib/roles';

/** Session with role re-read from DB (defense against stale JWT). */
export async function authWithFreshRole() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (!dbUser) return null;

  return {
    ...session,
    user: {
      ...session.user,
      role: dbUser.role as Role,
    },
  };
}
