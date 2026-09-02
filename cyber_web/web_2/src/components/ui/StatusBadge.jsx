import { STATUSES } from '@/data/statuses'
import { cn } from '@/lib/cn'
import { StatusIcon } from '@/lib/icons'
import { Badge } from '@/components/ui/Badge'

const toneByStatus = {
  muted: 'muted',
  info: 'accent',
  accent: 'accent',
  warning: 'warning',
  success: 'success',
  danger: 'danger',
}

export function StatusBadge({ status, className }) {
  const meta = STATUSES[status] ?? STATUSES.PENDING
  return (
    <Badge tone={toneByStatus[meta.tone]} className={cn('pr-2.5', className)}>
      <StatusIcon name={meta.icon} className="size-3.5" />
      <span>{meta.label}</span>
    </Badge>
  )
}
