import { STATUSES } from '@/data/statuses'
import { cn } from '@/lib/cn'
import { formatLevelId } from '@/lib/format'
import { StatusBadge } from '@/components/ui/StatusBadge'

const stateStyles = {
  LOCKED: 'opacity-70',
  AVAILABLE: 'hover:border-accent/50',
  CURRENT: 'border-accent/70 bg-accent-soft',
  IN_PROGRESS: 'border-warning/40',
  COMPLETED: 'border-success/30',
}

export function LevelNode({
  number,
  title,
  state = 'LOCKED',
  progress,
  selected,
  onSelect,
  compact = false,
  className,
}) {
  const meta = STATUSES[state] ?? STATUSES.LOCKED
  const Tag = onSelect ? 'button' : 'div'

  return (
    <Tag
      type={onSelect ? 'button' : undefined}
      onClick={onSelect}
      aria-pressed={onSelect ? Boolean(selected) : undefined}
      className={cn(
        'group w-full rounded-lg border border-line bg-surface text-left transition-colors duration-150',
        compact ? 'px-3 py-3' : 'px-4 py-4',
        onSelect && 'hover:bg-hover focus-visible:bg-hover',
        selected && 'ring-1 ring-accent',
        stateStyles[state],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="type-technical text-muted">{formatLevelId(number)}</span>
        <StatusBadge status={state} />
      </div>
      <p className={cn('mt-3 font-display tracking-tight text-ink', compact ? 'text-sm' : 'text-base')}>
        {title}
      </p>
      {typeof progress === 'number' && state !== 'LOCKED' ? (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-raised">
          <div
            className="h-full bg-accent"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      ) : null}
      <span className="sr-only">{meta.description}</span>
    </Tag>
  )
}
