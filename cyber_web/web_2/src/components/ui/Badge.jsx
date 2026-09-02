import { cn } from '@/lib/cn'

const tones = {
  default: 'bg-raised text-secondary border-line',
  accent: 'bg-accent-soft text-accent border-transparent',
  success: 'bg-success-soft text-success border-transparent',
  warning: 'bg-warning-soft text-warning border-transparent',
  danger: 'bg-danger-soft text-danger border-transparent',
  muted: 'bg-hover text-muted border-line',
}

export function Badge({ children, tone = 'default', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 type-small font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
