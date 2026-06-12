/** Статичный mockup таблицы стартапов для hero-блока лендинга */
export function LandingMockup() {
  const rows = [
    { rank: 1, title: 'FlowMetrics', author: 'Анна К.', score: 12 },
    { rank: 2, title: 'DocuSign AI', author: 'Игорь М.', score: 8 },
    { rank: 3, title: 'GreenCart', author: 'Мария С.', score: 5 },
  ];

  return (
    <div
      className="w-full max-w-lg rounded-xl border border-border bg-surface p-4 shadow-[0_4px_6px_rgba(0,0,0,0.07)] md:p-5"
      aria-hidden
    >
      <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          Рейтинг стартапов
        </span>
        <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-success">
          live
        </span>
      </div>

      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.rank}
            className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5"
          >
            <span className="w-5 text-center text-sm font-semibold text-muted tabular-nums">
              {row.rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{row.title}</p>
              <p className="truncate text-xs text-muted">{row.author}</p>
            </div>
            <div className="flex shrink-0 flex-col items-center gap-0.5">
              <span className="flex h-6 w-6 items-center justify-center rounded border border-border text-xs text-primary">
                ▲
              </span>
              <span className="text-sm font-semibold tabular-nums text-primary">
                {row.score}
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded border border-border text-xs text-muted">
                ▼
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
