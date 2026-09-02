import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Compass, Search } from 'lucide-react'
import { LEVELS, PREVIEW_LEVEL_STATES } from '@/data/curriculum'
import { STATUS_KEYS } from '@/data/statuses'
import { BrandMark } from '@/components/cyber/BrandMark'
import { CyberPulse } from '@/components/cyber/CyberPulse'
import { LevelNode } from '@/components/cyber/LevelNode'
import { LevelRail } from '@/components/cyber/LevelRail'
import { Sidebar } from '@/components/navigation/Sidebar'
import { Topbar } from '@/components/navigation/Topbar'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Divider } from '@/components/ui/Divider'
import { Dropdown } from '@/components/ui/Dropdown'
import { EmptyState } from '@/components/ui/EmptyState'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'
import { LoadingState } from '@/components/ui/LoadingState'
import { Modal } from '@/components/ui/Modal'
import { Panel } from '@/components/ui/Panel'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Select } from '@/components/ui/Select'
import { Skeleton } from '@/components/ui/Skeleton'
import { Stat } from '@/components/ui/Stat'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Tabs } from '@/components/ui/Tabs'
import { Tooltip } from '@/components/ui/Tooltip'
import { useUiStore } from '@/stores/uiStore'

const COLORS = [
  ['background', '--background'],
  ['surface', '--surface'],
  ['raised', '--surface-raised'],
  ['border', '--border'],
  ['text primary', '--text-primary'],
  ['text secondary', '--text-secondary'],
  ['muted', '--text-muted'],
  ['accent', '--accent'],
  ['success', '--success'],
  ['warning', '--warning'],
  ['danger', '--danger'],
]

function GuideSection({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-8 space-y-5">
      <h2 className="type-h2">{title}</h2>
      {children}
    </section>
  )
}

export function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState(3)
  const pushToast = useUiStore((state) => state.pushToast)

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-line px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div>
              <p className="font-display text-sm font-semibold tracking-[0.18em]">CYBERNEX</p>
              <p className="type-caption text-muted">Design system</p>
            </div>
          </div>
          <Link to="/student/dashboard" className="type-small text-accent hover:text-accent-hover">
            Back to app shell
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-10 md:px-8">
        <SectionHeader
          eyebrow="Visual QA"
          title="Phase 1 foundation"
          description="Typography, color, controls, status language, and the CyberNex signatures. This route is development-only."
        />

        <GuideSection id="type" title="Typography">
          <div className="space-y-4">
            <p className="type-display">Display / journey titles</p>
            <p className="type-h1">Heading one — Space Grotesk</p>
            <p className="type-h2">Heading two — product sections</p>
            <p className="type-h3">Heading three — compact titles</p>
            <p className="type-body text-secondary">
              Body copy uses IBM Plex Sans. It should read as a professional product, not a terminal.
            </p>
            <p className="type-small text-muted">Small supporting text for hints and metadata.</p>
            <p className="type-caption text-muted">Caption / section labels</p>
            <p className="type-technical text-secondary">LVL 03 · WEB · 00:14:22</p>
          </div>
        </GuideSection>

        <GuideSection id="color" title="Color tokens">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {COLORS.map(([name, token]) => (
              <div key={token} className="overflow-hidden rounded-md border border-line">
                <div className="h-16" style={{ background: `var(${token})` }} />
                <div className="px-3 py-2">
                  <p className="type-small text-ink">{name}</p>
                  <p className="type-technical text-muted">{token}</p>
                </div>
              </div>
            ))}
          </div>
        </GuideSection>

        <GuideSection id="buttons" title="Buttons">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="subtle">Subtle</Button>
            <Button variant="danger">Danger</Button>
            <Button loading>Saving</Button>
            <Button disabled>Disabled</Button>
            <IconButton label="Search">
              <Search className="size-4" />
            </IconButton>
          </div>
        </GuideSection>

        <GuideSection id="badges" title="Badges and statuses">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge tone="accent">Accent</Badge>
            <Badge tone="success">Success</Badge>
            <Badge tone="warning">Warning</Badge>
            <Badge tone="danger">Danger</Badge>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {STATUS_KEYS.map((key) => (
              <StatusBadge key={key} status={key} />
            ))}
          </div>
        </GuideSection>

        <GuideSection id="surfaces" title="Cards and panels">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <Card>
              <p className="type-caption text-muted">Card</p>
              <p className="mt-2 text-secondary">Use cards sparingly, only when grouping is meaningful.</p>
            </Card>
            <Panel>
              <p className="type-caption text-muted">Panel</p>
              <p className="mt-2 text-secondary">
                Panels are for larger regions of work, not for tiling every metric.
              </p>
            </Panel>
          </div>
        </GuideSection>

        <GuideSection id="inputs" title="Inputs">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Search labs" placeholder="SQL injection, SIEM, Kerberos" hint="Preview control" />
            <Select label="Difficulty">
              <option>Introductory</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </Select>
            <Input label="Flag" placeholder="CYN{…}" error="Not accepted in this preview." />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Dropdown
              label="Actions"
              items={[
                { id: 'grant', label: 'Grant access' },
                { id: 'lock', label: 'Lock assessment' },
                { id: 'disabled', label: 'Unavailable', disabled: true },
              ]}
            />
            <Tooltip content="Visible on hover and keyboard focus">
              <Button variant="secondary">Tooltip target</Button>
            </Tooltip>
            <Button variant="secondary" onClick={() => setModalOpen(true)}>
              Open modal
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                pushToast({
                  title: 'Preview toast',
                  description: 'Toasts are local UI feedback, not security events.',
                })
              }
            >
              Show toast
            </Button>
          </div>
          <Tabs
            className="mt-6"
            tabs={[
              { id: 'learn', label: 'Learn', content: <p className="text-secondary">Concept-first path.</p> },
              { id: 'practice', label: 'Practice', content: <p className="text-secondary">Repeatable labs.</p> },
              { id: 'assess', label: 'Assess', content: <p className="text-secondary">Granted, timed evaluation.</p> },
            ]}
          />
        </GuideSection>

        <GuideSection id="progress" title="Progress">
          <div className="flex flex-wrap items-center gap-8">
            <ProgressBar className="w-64" label="Level 03" value={42} />
            <ProgressRing value={42} />
            <CyberPulse progress={42} />
          </div>
        </GuideSection>

        <GuideSection id="levels" title="Level nodes and rail">
          <LevelRail
            states={{ ...PREVIEW_LEVEL_STATES, 3: 'IN_PROGRESS' }}
            currentId={selectedLevel}
            onSelect={(level) => setSelectedLevel(level.id)}
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LEVELS.slice(0, 5).map((level) => (
              <LevelNode
                key={level.id}
                number={level.id}
                title={level.title}
                state={level.id === selectedLevel ? 'CURRENT' : PREVIEW_LEVEL_STATES[level.id]}
                progress={level.id <= 3 ? (level.id === 3 ? 42 : 100) : 0}
                selected={level.id === selectedLevel}
                onSelect={() => setSelectedLevel(level.id)}
              />
            ))}
          </div>
        </GuideSection>

        <GuideSection id="shell" title="Sidebar and topbar">
          <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
            <div className="h-[420px] overflow-hidden rounded-xl border border-line bg-surface">
              <Sidebar roleId="student" collapsed={false} />
            </div>
            <div className="overflow-hidden rounded-xl border border-line">
              <Topbar roleId="student" title="Dashboard" />
              <div className="p-6">
                <p className="text-secondary">
                  Live shell chrome, isolated here for visual QA. Collapse behavior is on the app routes.
                </p>
              </div>
            </div>
          </div>
        </GuideSection>

        <GuideSection id="states" title="Empty, loading, skeleton">
          <div className="grid gap-6 md:grid-cols-3">
            <EmptyState
              icon={<Compass className="size-5" />}
              title="Nothing scheduled"
              description="Empty states should say what is missing and what happens next."
            />
            <LoadingState label="Fetching preview data" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </GuideSection>

        <GuideSection id="misc" title="Avatar, breadcrumb, stats, divider">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar initials="AR" name="Amina Rao" />
            <Breadcrumb items={[{ label: 'Student', to: '/student/dashboard' }, { label: 'Learning' }]} />
          </div>
          <Divider className="my-6" label="Signals" />
          <div className="grid gap-6 sm:grid-cols-3">
            <Stat label="Pulse" value="42%" hint="Preview only" />
            <Stat label="Levels" value="12" hint="Metadata ready" />
            <Stat label="Roles" value="3" hint="Shell preview" />
          </div>
        </GuideSection>
      </div>

      <Modal open={modalOpen} title="Secure note" onClose={() => setModalOpen(false)}>
        <p>
          Frontend controls are not assessment integrity. This dialog is for interaction quality only.
        </p>
      </Modal>
    </div>
  )
}
