export interface ProgressProps {
  percent: number;
  color?: string;
  showInfo?: boolean;
  className?: string;
}

export function Progress({ percent, color, showInfo = true, className }: Readonly<ProgressProps>) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className={className}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${String(clamped)}%`, backgroundColor: color ?? 'var(--color-primary)' }}
        />
      </div>
      {showInfo && <span className="text-xs text-muted-foreground">{`${String(clamped)}%`}</span>}
    </div>
  );
}
