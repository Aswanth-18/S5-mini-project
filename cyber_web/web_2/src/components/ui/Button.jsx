import { LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/cn'

const variants = {
  primary:
    'bg-accent text-ink hover:bg-accent-hover active:bg-accent-active disabled:bg-raised disabled:text-disabled',
  secondary:
    'bg-raised text-ink border border-line hover:bg-hover active:bg-hover disabled:text-disabled',
  ghost:
    'bg-transparent text-secondary hover:bg-hover hover:text-ink active:bg-hover disabled:text-disabled',
  danger:
    'bg-danger text-ink hover:brightness-110 active:brightness-95 disabled:bg-raised disabled:text-disabled',
  subtle:
    'bg-accent-soft text-accent hover:bg-hover active:bg-hover disabled:text-disabled',
}

const sizes = {
  sm: 'h-8 px-3 text-xs rounded-sm',
  md: 'h-10 px-4 text-sm rounded-md',
  lg: 'h-12 px-5 text-sm rounded-lg',
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150',
        'disabled:pointer-events-none disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  )
}
