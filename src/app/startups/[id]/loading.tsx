import { DashboardShell } from '@/shared/components/dashboard-shell';

function SkeletonLine({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-full bg-background-soft ${className}`}
    />
  );
}

export default function StartupDetailLoading() {
  return (
    <DashboardShell>
      <div className="space-y-6" aria-busy="true" aria-live="polite">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <SkeletonLine className="h-4 w-36" />
          <SkeletonLine className="mt-4 h-8 w-full max-w-xl" />
          <SkeletonLine className="mt-3 h-4 w-52" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <SkeletonLine className="h-5 w-32" />
              <SkeletonLine className="mt-5 h-4 w-full" />
              <SkeletonLine className="mt-3 h-4 w-11/12" />
              <SkeletonLine className="mt-3 h-4 w-2/3" />
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <SkeletonLine className="h-5 w-28" />
              <SkeletonLine className="mt-5 h-12 w-full" />
              <SkeletonLine className="mt-3 h-12 w-full" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <SkeletonLine className="h-20 w-20" />
            <SkeletonLine className="mt-5 h-10 w-full" />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
