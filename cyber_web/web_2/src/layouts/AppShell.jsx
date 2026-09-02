import { Outlet, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { findNavItem, roleFromPath } from '@/data/navigation'
import { cn } from '@/lib/cn'
import { Sidebar } from '@/components/navigation/Sidebar'
import { Topbar } from '@/components/navigation/Topbar'
import { RoleSwitcher } from '@/components/navigation/RoleSwitcher'
import { IconButton } from '@/components/ui/IconButton'
import { usePreviewStore } from '@/stores/previewStore'
import { useUiStore } from '@/stores/uiStore'
import { useEffect } from 'react'

export function AppShell() {
  const location = useLocation()
  const roleId = roleFromPath(location.pathname) ?? 'student'
  const match = findNavItem(location.pathname)
  const title = match?.item.label ?? 'CyberNex'
  const collapsed = useUiStore((state) => state.sidebarCollapsed)
  const mobileNavOpen = useUiStore((state) => state.mobileNavOpen)
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen)
  const setRole = usePreviewStore((state) => state.setRole)

  useEffect(() => {
    setRole(roleId)
    setMobileNavOpen(false)
  }, [roleId, location.pathname, setRole, setMobileNavOpen])

  return (
    <div className="min-h-svh lg:flex">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden border-r border-line bg-surface/90 lg:block',
          'transition-[width] duration-200 ease-out',
          collapsed ? 'w-[var(--sidebar-collapsed)]' : 'w-[var(--sidebar-width)]',
        )}
      >
        <Sidebar roleId={roleId} collapsed={collapsed} />
      </aside>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-overlay"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative h-full w-[min(100%,var(--sidebar-width))] border-r border-line bg-surface">
            <div className="absolute top-3 right-3">
              <IconButton label="Close navigation" onClick={() => setMobileNavOpen(false)}>
                <X className="size-4" />
              </IconButton>
            </div>
            <Sidebar roleId={roleId} collapsed={false} onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          'flex min-h-svh min-w-0 flex-1 flex-col transition-[margin] duration-200 ease-out',
          collapsed ? 'lg:ml-[var(--sidebar-collapsed)]' : 'lg:ml-[var(--sidebar-width)]',
        )}
      >
        <Topbar roleId={roleId} title={title} />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-6xl animate-[fadein_280ms_ease-out]">
            <Outlet />
          </div>
        </main>
        <div className="border-t border-line px-4 py-3 md:hidden">
          <RoleSwitcher roleId={roleId} />
        </div>
      </div>
      <style>{`@keyframes fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  )
}
