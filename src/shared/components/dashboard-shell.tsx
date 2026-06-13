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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Перейти к содержимому
      </a>
      {session?.user && (
        <Navbar name={session.user.name} role={session.user.role} />
      )}
      <main
        id="main-content"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        {children}
      </main>
    </div>
  );
}
