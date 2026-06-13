import { DashboardShell } from '@/shared/components/dashboard-shell';

function SkeletonLine({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-full bg-background-soft ${className}`}
    />
  );
}

export default function StartupsLoading() {
  return (
    <DashboardShell>
      <div className="space-y-6" aria-busy="true" aria-live="polite">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <SkeletonLine className="h-8 w-72" />
          <SkeletonLine className="mt-3 h-4 w-full max-w-lg" />
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <SkeletonLine className="h-10 w-full md:w-80" />
            <SkeletonLine className="h-10 w-full md:w-96" />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="grid grid-cols-[48px_1fr_160px_100px_100px_128px] items-center gap-4 border-b border-border px-6 py-4 last:border-b-0"
            >
              <SkeletonLine className="h-4 w-5" />
              <div>
                <SkeletonLine className="h-4 w-48" />
                <SkeletonLine className="mt-2 h-3 w-72" />
              </div>
              <SkeletonLine className="h-6 w-28" />
              <SkeletonLine className="h-7 w-16" />
              <SkeletonLine className="h-7 w-16" />
              <SkeletonLine className="h-8 w-24" />
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
