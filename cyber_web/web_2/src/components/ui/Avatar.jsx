import { cn } from '@/lib/cn'

export function Avatar({ initials, name, size = 'md', className }) {
  const sizes = {
    sm: 'size-8 text-[11px]',
    md: 'size-9 text-xs',
    lg: 'size-11 text-sm',
  }

  return (
    <span
      title={name}
      className={cn(
        'inline-flex items-center justify-center rounded-full border border-line bg-raised font-display font-medium text-ink',
        sizes[size],
        className,
      )}
      aria-hidden={!name}
      aria-label={name}
    >
      {initials}
    </span>
  )
}
