import { DashboardShell } from '@/shared/components/dashboard-shell';
import { AdminNav } from '@/modules/admin/components/admin-nav';

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Кабинет администратора</h1>
        <p className="mt-1 text-sm text-muted">
          Управление пользователями и доступом к платформе
        </p>
      </div>

      <AdminNav />

      {children}
    </DashboardShell>
  );
}
