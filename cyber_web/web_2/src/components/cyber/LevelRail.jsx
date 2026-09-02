import { LEVELS, PREVIEW_LEVEL_STATES } from '@/data/curriculum'
import { cn } from '@/lib/cn'
import { formatLevelId } from '@/lib/format'

const stateClass = {
  COMPLETED: 'bg-success text-background',
  CURRENT: 'bg-accent text-ink ring-2 ring-accent/40',
  IN_PROGRESS: 'bg-warning text-background',
  AVAILABLE: 'bg-raised text-ink border border-line',
  LOCKED: 'bg-raised text-muted border border-line',
}

export function LevelRail({
  states = PREVIEW_LEVEL_STATES,
  currentId = 3,
  onSelect,
  className,
}) {
  return (
    <ol
      className={cn(
        'flex min-w-max items-center gap-0 overflow-x-auto pb-2',
        className,
      )}
      aria-label="Twelve-level progression"
    >
      {LEVELS.map((level, index) => {
        const state = states[level.id] ?? 'LOCKED'
        const current = level.id === currentId
        return (
          <li key={level.id} className="flex items-center">
            {index > 0 ? (
              <span
                className={cn(
                  'mx-1 h-px w-4 sm:w-6',
                  ['COMPLETED', 'CURRENT', 'IN_PROGRESS'].includes(state)
                    ? 'bg-accent/70'
                    : 'bg-line',
                )}
                aria-hidden="true"
              />
            ) : null}
            <button
              type="button"
              disabled={!onSelect}
              onClick={() => onSelect?.(level)}
              className="group flex flex-col items-center gap-2 disabled:cursor-default"
              aria-current={current ? 'step' : undefined}
              aria-label={`Level ${formatLevelId(level.id)} ${level.title}, ${state.replaceAll('_', ' ').toLowerCase()}`}
            >
              <span
                className={cn(
                  'flex size-9 items-center justify-center rounded-full type-technical transition-transform duration-150 group-hover:scale-105',
                  stateClass[state],
                )}
              >
                {formatLevelId(level.id)}
              </span>
              <span className="hidden w-16 text-center type-caption text-muted sm:block">
                {level.shortTitle}
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
