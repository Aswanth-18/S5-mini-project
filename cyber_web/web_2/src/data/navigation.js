export const ROLES = {
  student: {
    id: 'student',
    label: 'Student',
    home: '/student/dashboard',
    previewUser: {
      name: 'Amina Rao',
      initials: 'AR',
      title: 'Cybersecurity learner',
    },
  },
  faculty: {
    id: 'faculty',
    label: 'Faculty',
    home: '/faculty/dashboard',
    previewUser: {
      name: 'Daniel Cho',
      initials: 'DC',
      title: 'Programme instructor',
    },
  },
  admin: {
    id: 'admin',
    label: 'Admin',
    home: '/admin/dashboard',
    previewUser: {
      name: 'Priya Nair',
      initials: 'PN',
      title: 'Platform operator',
    },
  },
}

export const NAVIGATION = {
  student: [
    {
      id: 'core',
      label: 'Journey',
      items: [
        {
          to: '/student/dashboard',
          label: 'Dashboard',
          icon: 'layout-dashboard',
          purpose: 'See where you are in the CyberNex journey and what to do next.',
        },
        {
          to: '/student/learning',
          label: 'Learning',
          icon: 'map',
          purpose: 'Move through the 12-level Cyber Atlas curriculum.',
        },
        {
          to: '/student/practice',
          label: 'Practice Labs',
          icon: 'terminal',
          purpose: 'Run simulated labs to build applied skill without assessment pressure.',
        },
        {
          to: '/student/assessments',
          label: 'Assessments',
          icon: 'shield',
          purpose: 'Enter granted, timed evaluations in the Secure Assessment Room.',
        },
      ],
    },
    {
      id: 'growth',
      label: 'Growth',
      items: [
        {
          to: '/student/progress',
          label: 'Progress',
          icon: 'chart-no-axes-column',
          purpose: 'Review skill progression across learning, labs, and assessments.',
        },
        {
          to: '/student/results',
          label: 'Results',
          icon: 'file-bar-chart',
          purpose: 'Inspect published scores, outcomes, and assessment history.',
        },
        {
          to: '/student/certificates',
          label: 'Certificates',
          icon: 'award',
          purpose: 'View credentials issued for completed levels and programmes.',
        },
      ],
    },
    {
      id: 'campus',
      label: 'Campus',
      items: [
        {
          to: '/student/attendance',
          label: 'Attendance',
          icon: 'calendar-check',
          purpose: 'Check recorded attendance for scheduled sessions.',
        },
        {
          to: '/student/schedule',
          label: 'Schedule',
          icon: 'calendar-days',
          purpose: 'See upcoming labs, classes, and assessment windows.',
        },
      ],
    },
    {
      id: 'account',
      label: 'Account',
      items: [
        {
          to: '/student/notifications',
          label: 'Notifications',
          icon: 'bell',
          purpose: 'Read unlocks, schedule changes, and result publications.',
        },
        {
          to: '/student/profile',
          label: 'Profile',
          icon: 'user',
          purpose: 'Manage the public learner profile shown to faculty.',
        },
        {
          to: '/student/settings',
          label: 'Settings',
          icon: 'settings',
          purpose: 'Adjust preferences. Privileged security settings stay server-side later.',
        },
      ],
    },
  ],
  faculty: [
    {
      id: 'core',
      label: 'Teaching',
      items: [
        {
          to: '/faculty/dashboard',
          label: 'Dashboard',
          icon: 'layout-dashboard',
          purpose: 'Monitor assigned cohorts, labs, and assessment windows.',
        },
        {
          to: '/faculty/students',
          label: 'Students',
          icon: 'users',
          purpose: 'Review the learners assigned to your courses.',
        },
        {
          to: '/faculty/courses',
          label: 'Courses',
          icon: 'book-open',
          purpose: 'Manage course structure mapped to CyberNex levels.',
        },
        {
          to: '/faculty/practice',
          label: 'Practice',
          icon: 'terminal',
          purpose: 'Observe lab engagement without treating it as an exam.',
        },
        {
          to: '/faculty/assessments',
          label: 'Assessments',
          icon: 'shield',
          purpose: 'Configure and grant access to evaluations you own.',
        },
      ],
    },
    {
      id: 'ops',
      label: 'Operations',
      items: [
        {
          to: '/faculty/results',
          label: 'Results',
          icon: 'file-bar-chart',
          purpose: 'Review published and pending assessment outcomes.',
        },
        {
          to: '/faculty/attendance',
          label: 'Attendance',
          icon: 'calendar-check',
          purpose: 'Record and review session attendance.',
        },
        {
          to: '/faculty/schedule',
          label: 'Schedule',
          icon: 'calendar-days',
          purpose: 'Plan labs, lectures, and assessment windows.',
        },
        {
          to: '/faculty/violations',
          label: 'Violations',
          icon: 'triangle-alert',
          purpose: 'Review simulated integrity events for assessments you manage.',
        },
      ],
    },
    {
      id: 'account',
      label: 'Account',
      items: [
        {
          to: '/faculty/notifications',
          label: 'Notifications',
          icon: 'bell',
          purpose: 'Stay current on grants, submissions, and policy notices.',
        },
        {
          to: '/faculty/profile',
          label: 'Profile',
          icon: 'user',
          purpose: 'Manage instructor identity shown to students.',
        },
        {
          to: '/faculty/settings',
          label: 'Settings',
          icon: 'settings',
          purpose: 'Adjust teaching preferences. Authorization remains a backend concern.',
        },
      ],
    },
  ],
  admin: [
    {
      id: 'overview',
      label: 'Overview',
      items: [
        {
          to: '/admin/dashboard',
          label: 'Dashboard',
          icon: 'layout-dashboard',
          purpose: 'Operate the platform: health, grants, and outstanding controls.',
        },
      ],
    },
    {
      id: 'people',
      label: 'People',
      items: [
        {
          to: '/admin/users',
          label: 'Users',
          icon: 'users',
          purpose: 'Manage student, faculty, and operator accounts.',
        },
        {
          to: '/admin/faculty',
          label: 'Faculty',
          icon: 'graduation-cap',
          purpose: 'Assign instructors and course ownership.',
        },
      ],
    },
    {
      id: 'academic',
      label: 'Academic',
      items: [
        {
          to: '/admin/courses',
          label: 'Courses',
          icon: 'book-open',
          purpose: 'Administer programme and course catalogues.',
        },
        {
          to: '/admin/levels',
          label: 'Levels',
          icon: 'layers',
          purpose: 'Maintain the 12-level curriculum metadata.',
        },
        {
          to: '/admin/results',
          label: 'Results',
          icon: 'file-bar-chart',
          purpose: 'Oversee published outcomes. Changes must be auditable.',
        },
        {
          to: '/admin/attendance',
          label: 'Attendance',
          icon: 'calendar-check',
          purpose: 'Review attendance across cohorts.',
        },
        {
          to: '/admin/schedule',
          label: 'Schedule',
          icon: 'calendar-days',
          purpose: 'Coordinate institution-wide sessions and windows.',
        },
      ],
    },
    {
      id: 'control',
      label: 'Control',
      items: [
        {
          to: '/admin/restrictions',
          label: 'Restrictions',
          icon: 'ban',
          purpose: 'Apply or lift account and assessment restrictions.',
        },
        {
          to: '/admin/reset',
          label: 'Reset',
          icon: 'rotate-ccw',
          purpose: 'Reset learner progress with a recorded reason.',
        },
        {
          to: '/admin/assets',
          label: 'Assets',
          icon: 'package',
          purpose: 'Catalogue lab images, datasets, and learning assets.',
        },
        {
          to: '/admin/bulk-unlock',
          label: 'Bulk Unlock',
          icon: 'unlock',
          purpose: 'Grant assessment access to a cohort, not a global flag.',
        },
      ],
    },
    {
      id: 'security',
      label: 'Integrity',
      items: [
        {
          to: '/admin/violations',
          label: 'Violations',
          icon: 'triangle-alert',
          purpose: 'Triage simulated integrity events until backend enforcement exists.',
        },
        {
          to: '/admin/access-control',
          label: 'Access Control',
          icon: 'key-round',
          purpose: 'Define role policies. Frontend checks are preview-only.',
        },
        {
          to: '/admin/audit-logs',
          label: 'Audit Logs',
          icon: 'scroll-text',
          purpose: 'Inspect privileged actions such as unlocks and role changes.',
        },
      ],
    },
    {
      id: 'system',
      label: 'System',
      items: [
        {
          to: '/admin/backup',
          label: 'Backup',
          icon: 'database',
          purpose: 'Review backup status. Restoration is an operations concern.',
        },
        {
          to: '/admin/settings',
          label: 'Settings',
          icon: 'settings',
          purpose: 'Institution and platform configuration.',
        },
      ],
    },
  ],
}

export function flattenNav(roleId) {
  return (NAVIGATION[roleId] ?? []).flatMap((section) => section.items)
}

export function findNavItem(pathname) {
  for (const roleId of Object.keys(NAVIGATION)) {
    const item = flattenNav(roleId).find((entry) => entry.to === pathname)
    if (item) return { roleId, item }
  }
  return null
}

export function roleFromPath(pathname) {
  if (pathname.startsWith('/faculty')) return 'faculty'
  if (pathname.startsWith('/admin')) return 'admin'
  if (pathname.startsWith('/student')) return 'student'
  return null
}
