import { useId, useState } from 'react'
import { cn } from '@/lib/cn'

export function Tabs({ tabs, value, onChange, className }) {
  const [internal, setInternal] = useState(tabs[0]?.id)
  const selected = value ?? internal
  const baseId = useId()

  function select(id) {
    setInternal(id)
    onChange?.(id)
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div role="tablist" className="flex gap-1 border-b border-line">
        {tabs.map((tab) => {
          const active = tab.id === selected
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${baseId}-${tab.id}`}
              aria-selected={active}
              aria-controls={`${baseId}-panel-${tab.id}`}
              className={cn(
                '-mb-px rounded-t-md px-3 py-2 type-small font-medium transition-colors',
                active
                  ? 'border-b-2 border-accent text-ink'
                  : 'border-b-2 border-transparent text-muted hover:text-ink',
              )}
              onClick={() => select(tab.id)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      {tabs.map((tab) =>
        tab.id === selected ? (
          <div
            key={tab.id}
            role="tabpanel"
            id={`${baseId}-panel-${tab.id}`}
            aria-labelledby={`${baseId}-${tab.id}`}
          >
            {tab.content}
          </div>
        ) : null,
      )}
    </div>
  )
}
