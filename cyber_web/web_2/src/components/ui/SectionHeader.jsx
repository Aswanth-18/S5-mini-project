import { cn } from '@/lib/cn'

export function SectionHeader({ eyebrow, title, description, actions, className }) {
  return (
    <header className={cn('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div className="max-w-2xl space-y-2">
        {eyebrow ? <p className="type-caption text-muted">{eyebrow}</p> : null}
        <h1 className="type-h1">{title}</h1>
        {description ? <p className="type-body text-secondary">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  )
}
