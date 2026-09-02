import { cn } from '@/lib/cn'

export function BrandMark({ className, size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      <path
        d="M16 4.5 27 10.6v10.8L16 27.5 5 21.4V10.6L16 4.5Z"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <path
        d="M16 11 21.4 14v4.6L16 21.6 10.6 18.6V14L16 11Z"
        fill="var(--surface-raised)"
        stroke="var(--text-muted)"
        strokeWidth="1.1"
      />
      <circle cx="16" cy="16" r="1.8" fill="var(--accent)" />
    </svg>
  )
}
