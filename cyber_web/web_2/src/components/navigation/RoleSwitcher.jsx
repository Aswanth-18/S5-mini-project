import { useNavigate } from 'react-router-dom'
import { ROLES } from '@/data/navigation'
import { cn } from '@/lib/cn'
import { usePreviewStore } from '@/stores/previewStore'

export function RoleSwitcher({ roleId, className }) {
  const setRole = usePreviewStore((state) => state.setRole)
  const navigate = useNavigate()

  return (
    <label className={cn('flex items-center gap-2', className)}>
      <span className="type-caption text-muted">Dev preview</span>
      <select
        aria-label="Preview application role"
        value={roleId}
        className="h-9 rounded-md border border-line bg-raised px-2 text-sm text-ink"
        onChange={(event) => {
          const next = event.target.value
          setRole(next)
          navigate(ROLES[next].home)
        }}
      >
        {Object.values(ROLES).map((entry) => (
          <option key={entry.id} value={entry.id}>
            {entry.label}
          </option>
        ))}
      </select>
    </label>
  )
}
