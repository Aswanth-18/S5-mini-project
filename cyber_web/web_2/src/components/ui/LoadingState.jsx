import { LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/cn'

export function LoadingState({ label = 'Loading', className }) {
  return (
    <div className={cn('flex items-center gap-3 py-8 text-secondary', className)} role="status">
      <LoaderCircle className="size-4 animate-spin text-accent" aria-hidden="true" />
      <span className="type-small">{label}</span>
    </div>
  )
}
