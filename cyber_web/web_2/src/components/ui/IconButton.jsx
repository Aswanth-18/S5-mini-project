import { LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/cn'

const sizes = {
  sm: 'size-8 rounded-sm',
  md: 'size-10 rounded-md',
  lg: 'size-12 rounded-lg',
}

export function IconButton({
  children,
  className,
  label,
  size = 'md',
  disabled,
  loading,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center text-secondary transition-colors duration-150',
        'hover:bg-hover hover:text-ink active:bg-hover',
        'disabled:pointer-events-none disabled:text-disabled',
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : children}
    </button>
  )
}
