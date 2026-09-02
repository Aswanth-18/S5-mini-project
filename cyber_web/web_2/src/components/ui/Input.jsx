import { cn } from '@/lib/cn'

export function Input({ label, hint, error, id, className, disabled, ...props }) {
  const inputId = id ?? props.name
  return (
    <label className={cn('flex w-full flex-col gap-1.5', className)}>
      {label ? (
        <span className="type-small font-medium text-secondary">{label}</span>
      ) : null}
      <input
        id={inputId}
        disabled={disabled}
        className={cn(
          'h-10 rounded-md border bg-raised px-3 text-sm text-ink placeholder:text-muted',
          'transition-colors duration-150',
          error ? 'border-danger' : 'border-line hover:border-muted focus:border-accent',
          'disabled:cursor-not-allowed disabled:text-disabled',
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {hint || error ? (
        <span id={`${inputId}-hint`} className={cn('type-small', error ? 'text-danger' : 'text-muted')}>
          {error || hint}
        </span>
      ) : null}
    </label>
  )
}
