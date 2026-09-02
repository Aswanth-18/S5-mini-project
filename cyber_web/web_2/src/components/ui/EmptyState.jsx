import { cn } from '@/lib/cn'

export function EmptyState({ icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-start gap-3 py-6', className)}>
      {icon ? <div className="text-muted">{icon}</div> : null}
      <h2 className="type-h3">{title}</h2>
      {description ? <p className="max-w-xl type-body text-secondary">{description}</p> : null}
      {action}
    </div>
  )
}
