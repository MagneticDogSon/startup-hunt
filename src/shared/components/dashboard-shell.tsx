import { Navbar } from '@/modules/auth/components/navbar';
import { authWithFreshRole } from '@/modules/auth/lib/session';

export async function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await authWithFreshRole();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {session?.user && (
        <Navbar name={session.user.name} role={session.user.role} />
      )}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
