import { NavLink } from 'react-router-dom'
import { PanelLeft } from 'lucide-react'
import { NAVIGATION, ROLES } from '@/data/navigation'
import { cn } from '@/lib/cn'
import { NavIcon } from '@/lib/icons'
import { BrandMark } from '@/components/cyber/BrandMark'
import { IconButton } from '@/components/ui/IconButton'
import { useUiStore } from '@/stores/uiStore'

export function Sidebar({ roleId, collapsed, onNavigate }) {
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const role = ROLES[roleId]
  const sections = NAVIGATION[roleId] ?? []

  return (
    <div className="flex h-full flex-col">
      <div className={cn('flex h-16 items-center gap-3 px-4', collapsed && 'justify-center px-2')}>
        <BrandMark size={collapsed ? 26 : 28} />
        {!collapsed ? (
          <div className="min-w-0">
            <p className="font-display text-sm font-semibold tracking-[0.18em] text-ink">CYBERNEX</p>
            <p className="type-caption text-muted">{role.label}</p>
          </div>
        ) : (
          <span className="sr-only">CyberNex {role.label}</span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label={`${role.label} navigation`}>
        {sections.map((section) => (
          <div key={section.id} className="mb-4">
            {!collapsed ? (
              <p className="px-2 pb-2 type-caption text-muted">{section.label}</p>
            ) : (
              <div className="mx-auto mb-2 h-px w-6 bg-line" />
            )}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    title={item.label}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors duration-150',
                        collapsed && 'justify-center px-0',
                        isActive
                          ? 'bg-accent-soft text-ink'
                          : 'text-secondary hover:bg-hover hover:text-ink',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <NavIcon name={item.icon} className={cn('size-4 shrink-0', isActive ? 'text-accent' : 'text-muted')} />
                        {!collapsed ? <span className="truncate">{item.label}</span> : null}
                        {collapsed ? <span className="sr-only">{item.label}</span> : null}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className={cn('hidden border-t border-line p-3 lg:flex', collapsed && 'justify-center')}>
        <IconButton
          label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={toggleSidebar}
        >
          <PanelLeft className="size-4" />
        </IconButton>
      </div>
    </div>
  )
}
