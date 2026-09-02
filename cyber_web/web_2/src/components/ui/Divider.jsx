import { cn } from '@/lib/cn'

export function Divider({ className, label }) {
  if (!label) return <hr className={cn('border-0 border-t border-line', className)} />
  return (
    <div className={cn('flex items-center gap-3 text-muted', className)} role="separator">
      <span className="h-px flex-1 bg-line" />
      <span className="type-caption">{label}</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  )
}
