import { cn } from '@/lib/cn'

export function ProgressBar({ value = 0, label, className }) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className={cn('space-y-1.5', className)}>
      {label ? (
        <div className="flex items-center justify-between gap-3">
          <span className="type-small text-secondary">{label}</span>
          <span className="type-technical text-muted">{clamped}%</span>
        </div>
      ) : (
        <span className="sr-only">{clamped} percent</span>
      )}
      <div
        className="h-1.5 overflow-hidden rounded-full bg-raised"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
