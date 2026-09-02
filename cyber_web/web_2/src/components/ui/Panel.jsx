import { cn } from '@/lib/cn'

export function Panel({ children, className, padded = true, as: Tag = 'section', ...props }) {
  return (
    <Tag
      className={cn(
        'rounded-xl border border-line bg-surface/80',
        padded && 'p-6 md:p-8',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
