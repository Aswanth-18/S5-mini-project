import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useUiStore } from '@/stores/uiStore'
import { IconButton } from '@/components/ui/IconButton'

const tones = {
  info: 'border-line',
  success: 'border-success/40',
  warning: 'border-warning/40',
  danger: 'border-danger/40',
}

export function ToastViewport() {
  const toasts = useUiStore((state) => state.toasts)
  const dismissToast = useUiStore((state) => state.dismissToast)

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-[min(100%-2rem,360px)] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto rounded-md border bg-surface px-4 py-3 shadow-[var(--shadow)]',
            tones[toast.tone] ?? tones.info,
          )}
          role="status"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              {toast.title ? <p className="type-h3">{toast.title}</p> : null}
              {toast.description ? (
                <p className="mt-1 type-small text-secondary">{toast.description}</p>
              ) : null}
            </div>
            <IconButton label="Dismiss notification" size="sm" onClick={() => dismissToast(toast.id)}>
              <X className="size-4" />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  )
}
