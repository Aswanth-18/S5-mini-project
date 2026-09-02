import { Bell, Menu } from 'lucide-react'
import { ROLES } from '@/data/navigation'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { IconButton } from '@/components/ui/IconButton'
import { RoleSwitcher } from '@/components/navigation/RoleSwitcher'
import { useUiStore } from '@/stores/uiStore'

export function Topbar({ roleId, title, crumbs }) {
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen)
  const role = ROLES[roleId]

  return (
    <header className="flex h-[var(--topbar-height)] items-center gap-3 border-b border-line bg-background/80 px-4 backdrop-blur-sm md:px-8">
      <IconButton
        className="lg:hidden"
        label="Open navigation"
        onClick={() => setMobileNavOpen(true)}
      >
        <Menu className="size-5" />
      </IconButton>

      <div className="min-w-0 flex-1">
        <Breadcrumb
          items={
            crumbs ?? [
              { label: role.label, to: role.home },
              { label: title },
            ]
          }
        />
        <h1 className="truncate font-display text-lg tracking-tight md:text-xl">{title}</h1>
      </div>

      <RoleSwitcher roleId={roleId} className="hidden md:flex" />

      <IconButton label="Notifications">
        <Bell className="size-4" />
      </IconButton>

      <div className="flex items-center gap-2">
        <Avatar initials={role.previewUser.initials} name={role.previewUser.name} />
        <div className="hidden min-w-0 sm:block">
          <p className="type-small text-ink">{role.previewUser.name}</p>
          <Badge tone="accent">{role.label}</Badge>
        </div>
      </div>
    </header>
  )
}
