import { cn } from '@/lib/cn'

export function Stat({ label, value, hint, className }) {
  return (
    <div className={cn('min-w-0', className)}>
      <p className="type-caption text-muted">{label}</p>
      <p className="mt-2 font-display text-2xl tracking-tight text-ink">{value}</p>
      {hint ? <p className="mt-1 type-small text-secondary">{hint}</p> : null}
    </div>
  )
}
