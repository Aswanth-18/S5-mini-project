import { cn } from '@/lib/cn'

export function Select({ label, hint, id, className, disabled, children, ...props }) {
  const selectId = id ?? props.name
  return (
    <label className={cn('flex w-full flex-col gap-1.5', className)}>
      {label ? (
        <span className="type-small font-medium text-secondary">{label}</span>
      ) : null}
      <select
        id={selectId}
        disabled={disabled}
        className={cn(
          'h-10 rounded-md border border-line bg-raised px-3 text-sm text-ink',
          'transition-colors duration-150 hover:border-muted focus:border-accent',
          'disabled:cursor-not-allowed disabled:text-disabled',
        )}
        {...props}
      >
        {children}
      </select>
      {hint ? <span className="type-small text-muted">{hint}</span> : null}
    </label>
  )
}
