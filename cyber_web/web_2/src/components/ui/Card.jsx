import { cn } from '@/lib/cn'

export function Card({ children, className, as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={cn(
        'rounded-lg border border-line bg-surface p-5 shadow-[var(--shadow-sm)]',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
