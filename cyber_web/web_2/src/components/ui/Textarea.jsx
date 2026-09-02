import { cn } from '@/lib/cn'

export function Textarea({ label, hint, error, id, className, ...props }) {
  const inputId = id ?? props.name
  return (
    <label className={cn('flex w-full flex-col gap-1.5', className)}>
      {label ? <span className="type-small font-medium text-secondary">{label}</span> : null}
      <textarea
        id={inputId}
        className={cn(
          'min-h-28 rounded-md border bg-raised px-3 py-2 text-sm text-ink placeholder:text-muted',
          error ? 'border-danger' : 'border-line hover:border-muted focus:border-accent',
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {hint || error ? (
        <span className={cn('type-small', error ? 'text-danger' : 'text-muted')}>{error || hint}</span>
      ) : null}
    </label>
  )
}
