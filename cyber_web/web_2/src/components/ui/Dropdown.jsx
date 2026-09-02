import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export function Dropdown({ label, items, onSelect, className }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const menuId = useId()

  useEffect(() => {
    function onDoc(event) {
      if (!ref.current?.contains(event.target)) setOpen(false)
    }
    function onKey(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-raised px-3 text-sm text-ink hover:bg-hover"
        onClick={() => setOpen((value) => !value)}
      >
        {label}
        <ChevronDown className="size-4 text-muted" aria-hidden="true" />
      </button>
      {open ? (
        <ul
          id={menuId}
          role="menu"
          className="absolute right-0 z-30 mt-2 min-w-44 overflow-hidden rounded-md border border-line bg-surface py-1 shadow-[var(--shadow)]"
        >
          {items.map((item) => (
            <li key={item.id} role="none">
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                className="flex w-full px-3 py-2 text-left text-sm text-secondary hover:bg-hover hover:text-ink disabled:text-disabled"
                onClick={() => {
                  onSelect?.(item)
                  setOpen(false)
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
