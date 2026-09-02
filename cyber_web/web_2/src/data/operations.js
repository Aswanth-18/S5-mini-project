export const RESTRICTIONS = [
  {
    id: 'rst-1',
    userId: 'u-sofia',
    type: 'assessment restricted',
    reason: 'Integrity event TAB_SWITCH during a closed window. Pending faculty note.',
    createdBy: 'u-priya',
    createdAt: '2026-08-29T11:05:00+05:30',
    expiresAt: '2026-09-15T18:00:00+05:30',
    status: 'ACTIVE',
  },
]

export const AUDIT_LOGS = [
  {
    id: 'aud-1',
    actorId: 'u-daniel',
    action: 'Assessment unlocked',
    target: 'Amina Rao / Web security core evaluation',
    timestamp: '2026-08-28T09:00:00+05:30',
    metadata: { accessId: 'acc-3', attemptsAllowed: 2 },
    status: 'RECORDED',
  },
  {
    id: 'aud-2',
    actorId: 'u-daniel',
    action: 'Bulk unlock',
    target: 'SEC-2026-A / Web security core evaluation',
    timestamp: '2026-09-01T12:00:00+05:30',
    metadata: { students: ['u-maya'], preview: true },
    status: 'RECORDED',
  },
  {
    id: 'aud-3',
    actorId: 'u-priya',
    action: 'Restriction applied',
    target: 'Sofia Petrov',
    timestamp: '2026-08-29T11:05:00+05:30',
    metadata: { type: 'assessment restricted' },
    status: 'RECORDED',
  },
  {
    id: 'aud-4',
    actorId: 'u-priya',
    action: 'Role changed',
    target: 'Leila Fernandez → FACULTY',
    timestamp: '2026-01-14T09:10:00+05:30',
    metadata: {},
    status: 'RECORDED',
  },
  {
    id: 'aud-5',
    actorId: 'u-leila',
    action: 'Faculty assignment changed',
    target: 'Detection Operations / Omar Haddad',
    timestamp: '2026-07-02T10:00:00+05:30',
    metadata: {},
    status: 'RECORDED',
  },
]

export const BACKUPS = [
  {
    id: 'bk-1',
    createdAt: '2026-09-02T02:00:00+05:30',
    status: 'SUCCESS',
    size: '1.2 GB (mock)',
    note: 'UI status only. No database snapshot was taken.',
  },
  {
    id: 'bk-2',
    createdAt: '2026-09-01T02:00:00+05:30',
    status: 'SUCCESS',
    size: '1.2 GB (mock)',
    note: 'UI status only.',
  },
  {
    id: 'bk-3',
    createdAt: '2026-08-31T02:00:00+05:30',
    status: 'WARNING',
    size: '0.9 GB (mock)',
    note: 'Simulated checksum delay. Not a real restore point.',
  },
]

export const ASSETS = [
  { id: 'as-1', name: 'HTTP capture (request inspector)', type: 'lab resource', updatedAt: '2026-08-12', status: 'ACTIVE' },
  { id: 'as-2', name: 'Web Security lesson diagrams', type: 'learning resource', updatedAt: '2026-08-20', status: 'ACTIVE' },
  { id: 'as-3', name: 'SOC alert JSON pack', type: 'lab resource', updatedAt: '2026-07-30', status: 'ACTIVE' },
  { id: 'as-4', name: 'Programme handbook (draft)', type: 'document', updatedAt: '2026-08-05', status: 'DRAFT' },
]

export const PERMISSIONS = [
  'View courses',
  'Manage courses',
  'View students',
  'Manage students',
  'View assessments',
  'Unlock assessments',
  'View results',
  'Manage results',
  'View violations',
  'Manage users',
  'Manage settings',
]

export const ROLE_MATRIX = {
  STUDENT: {
    'View courses': true,
    'Manage courses': false,
    'View students': false,
    'Manage students': false,
    'View assessments': true,
    'Unlock assessments': false,
    'View results': true,
    'Manage results': false,
    'View violations': false,
    'Manage users': false,
    'Manage settings': false,
  },
  FACULTY: {
    'View courses': true,
    'Manage courses': true,
    'View students': true,
    'Manage students': false,
    'View assessments': true,
    'Unlock assessments': true,
    'View results': true,
    'Manage results': true,
    'View violations': true,
    'Manage users': false,
    'Manage settings': false,
  },
  ADMIN: {
    'View courses': true,
    'Manage courses': true,
    'View students': true,
    'Manage students': true,
    'View assessments': true,
    'Unlock assessments': true,
    'View results': true,
    'Manage results': true,
    'View violations': true,
    'Manage users': true,
    'Manage settings': true,
  },
}

export const SECURITY_LIMITATIONS = [
  'Authentication is a mock session in localStorage. It is not identity.',
  'Role checks in the router are UI convenience. They can be bypassed in the browser.',
  'Assessment timers, auto-submit, and violation listeners run in the client.',
  'Scores, flags, and completion state are not trustworthy until a backend grades them.',
  'AssessmentAccess is modeled correctly in data, but still stored on the client.',
  'Simulated terminals never execute host commands; they also cannot prove a student ran anything.',
  'Certificates are institutional mock artefacts and are not externally verified.',
  'Backup screens do not copy data.',
  'Permission matrix is documentation, not enforcement.',
]
