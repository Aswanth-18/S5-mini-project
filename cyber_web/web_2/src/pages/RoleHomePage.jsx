import { useNavigate } from 'react-router-dom'
import { CyberPulse } from '@/components/cyber/CyberPulse'
import { LevelRail } from '@/components/cyber/LevelRail'
import { Button } from '@/components/ui/Button'
import { Panel } from '@/components/ui/Panel'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Stat } from '@/components/ui/Stat'

const copy = {
  student: {
    eyebrow: 'Learner workspace',
    title: 'Your cybersecurity journey',
    description:
      'The student shell is ready. Learning, labs, and assessments will land in later phases. The map spine and pulse are here so the product already has a point of view.',
    next: '/student/learning',
    nextLabel: 'Open Learning',
    stats: [
      { label: 'Current level', value: '03', hint: 'Web Security' },
      { label: 'Completed', value: '02', hint: 'Foundation through fundamentals' },
      { label: 'Next gate', value: 'Atlas', hint: 'Arrives in Phase 4' },
    ],
  },
  faculty: {
    eyebrow: 'Faculty workspace',
    title: 'Cohort operations',
    description:
      'This shell is for teaching and review. Student lists, grants, and results remain placeholders until later phases.',
    next: '/faculty/students',
    nextLabel: 'View students',
    stats: [
      { label: 'Assigned', value: '—', hint: 'Not connected yet' },
      { label: 'Windows', value: '—', hint: 'Assessments arrive in Phase 6' },
      { label: 'Review', value: '—', hint: 'Integrity events stay simulated' },
    ],
  },
  admin: {
    eyebrow: 'Control center',
    title: 'Platform operations',
    description:
      'Admin navigation is complete. User, grant, and audit tools are routed but not implemented in Phase 1.',
    next: '/admin/users',
    nextLabel: 'Open users',
    stats: [
      { label: 'Roles', value: '3', hint: 'Student, faculty, admin preview' },
      { label: 'Levels', value: '12', hint: 'Curriculum metadata ready' },
      { label: 'Enforcement', value: 'UI', hint: 'Backend remains the source of truth' },
    ],
  },
}

export function RoleHomePage({ roleId }) {
  const page = copy[roleId]
  const navigate = useNavigate()

  return (
    <div className="space-y-10">
      <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <SectionHeader eyebrow={page.eyebrow} title={page.title} description={page.description} />
        <CyberPulse progress={roleId === 'student' ? 28 : 54} />
      </div>

      <div className="grid gap-8 border-y border-line py-8 sm:grid-cols-3">
        {page.stats.map((stat) => (
          <Stat key={stat.label} {...stat} />
        ))}
      </div>

      {roleId === 'student' ? (
        <div className="space-y-4">
          <p className="type-caption text-muted">Curriculum spine</p>
          <LevelRail />
          <Button onClick={() => navigate(page.next)}>{page.nextLabel}</Button>
        </div>
      ) : (
        <Panel className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-secondary">
            Use the sidebar to inspect every {roleId} destination. Each page explains its purpose without fake feature chrome.
          </p>
          <Button onClick={() => navigate(page.next)}>{page.nextLabel}</Button>
        </Panel>
      )}
    </div>
  )
}
