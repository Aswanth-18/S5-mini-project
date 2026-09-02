import {
  Activity,
  Award,
  Ban,
  Bell,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  ChartNoAxesColumn,
  Check,
  Circle,
  Clock,
  Database,
  FileBarChart,
  GraduationCap,
  KeyRound,
  Layers,
  LayoutDashboard,
  Lock,
  Map,
  Package,
  RotateCcw,
  ScrollText,
  Settings,
  Shield,
  Target,
  Terminal,
  TriangleAlert,
  Unlock,
  User,
  Users,
  BadgeCheck,
  LoaderCircle,
  X,
} from 'lucide-react'

export const NAV_ICONS = {
  'layout-dashboard': LayoutDashboard,
  map: Map,
  terminal: Terminal,
  shield: Shield,
  'chart-no-axes-column': ChartNoAxesColumn,
  'file-bar-chart': FileBarChart,
  award: Award,
  'calendar-check': CalendarCheck,
  'calendar-days': CalendarDays,
  bell: Bell,
  user: User,
  settings: Settings,
  users: Users,
  'book-open': BookOpen,
  'triangle-alert': TriangleAlert,
  'graduation-cap': GraduationCap,
  layers: Layers,
  ban: Ban,
  'rotate-ccw': RotateCcw,
  package: Package,
  unlock: Unlock,
  'key-round': KeyRound,
  'scroll-text': ScrollText,
  database: Database,
}

export const STATUS_ICONS = {
  lock: Lock,
  circle: Circle,
  target: Target,
  progress: LoaderCircle,
  check: Check,
  'badge-check': BadgeCheck,
  x: X,
  clock: Clock,
  activity: Activity,
  ban: Ban,
  unlock: Unlock,
  'triangle-alert': TriangleAlert,
}

export function NavIcon({ name, className }) {
  const Icon = NAV_ICONS[name] ?? Circle
  return <Icon className={className} aria-hidden="true" />
}

export function StatusIcon({ name, className }) {
  const Icon = STATUS_ICONS[name] ?? Circle
  return <Icon className={className} aria-hidden="true" />
}
