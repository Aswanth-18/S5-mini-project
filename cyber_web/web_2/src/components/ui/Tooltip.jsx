import { cn } from '@/lib/cn'

export function Tooltip({ content, children, className }) {
  return (
    <span className={cn('relative inline-flex', className)}>
      <span className="peer">{children}</span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-40 hidden w-max max-w-56 -translate-x-1/2 rounded-md border border-line bg-raised px-2.5 py-1.5 type-small text-secondary shadow-[var(--shadow-sm)] peer-hover:block peer-focus-visible:block"
      >
        {content}
      </span>
    </span>
  )
}
