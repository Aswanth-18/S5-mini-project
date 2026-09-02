import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

export function Breadcrumb({ items, className }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex flex-wrap items-center gap-1', className)}>
      {items.map((item, index) => {
        const last = index === items.length - 1
        return (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 ? <ChevronRight className="size-3.5 text-muted" aria-hidden="true" /> : null}
            {last || !item.to ? (
              <span className="type-small text-ink" aria-current={last ? 'page' : undefined}>
                {item.label}
              </span>
            ) : (
              <Link to={item.to} className="type-small text-muted hover:text-ink">
                {item.label}
              </Link>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
