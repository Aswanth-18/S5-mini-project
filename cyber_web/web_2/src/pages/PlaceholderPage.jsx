import { Compass } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { Panel } from '@/components/ui/Panel'

export function PlaceholderPage({ title, purpose, next }) {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Coming in a later phase"
        title={title}
        description={purpose}
      />
      <Panel>
        <EmptyState
          icon={<Compass className="size-6" />}
          title="Interface reserved"
          description={
            next ??
            'This route is wired into the CyberNex shell so navigation, roles, and layout can be validated. Feature work is intentionally not implemented in Phase 1.'
          }
        />
      </Panel>
    </div>
  )
}
