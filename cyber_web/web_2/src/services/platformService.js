import { COURSES } from '@/data/curriculum'
import { USERS } from '@/data/users'
import { ASSETS, BACKUPS, PERMISSIONS, ROLE_MATRIX, SECURITY_LIMITATIONS } from '@/data/operations'
import { wait } from '@/services/localState'
import { mockDb } from '@/services/mockDb'
import { id } from '@/lib/clone'

export const userService = {
  async list({ query = '', role = 'all', status = 'all' } = {}) {
    await wait(140)
    return mockDb
      .get()
      .users.map(strip)
      .filter((user) => {
        if (query && !`${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase())) return false
        if (role !== 'all' && user.role !== role) return false
        if (status !== 'all' && user.status !== status) return false
        return true
      })
  },
  async get(userId) {
    await wait(80)
    const user = mockDb.get().users.find((item) => item.id === userId)
    return user ? strip(user) : null
  },
  async update(userId, patch) {
    await wait(160)
    mockDb.mutate((db) => {
      const user = db.users.find((item) => item.id === userId)
      if (!user) return
      const previousRole = user.role
      Object.assign(user, patch)
      db.audit.unshift({
        id: id('aud'),
        actorId: patch.actorId ?? 'u-priya',
        action: patch.role && patch.role !== previousRole ? 'Role changed' : 'User updated',
        target: user.name,
        timestamp: new Date().toISOString(),
        metadata: { role: patch.role, status: patch.status },
        status: 'RECORDED',
      })
    })
    return this.get(userId)
  },
}

export const attendanceService = {
  async forStudent(studentId) {
    await wait(120)
    const rows = mockDb.get().attendance.filter((item) => item.studentId === studentId)
    const presentish = rows.filter((item) => item.status === 'PRESENT' || item.status === 'LATE').length
    return {
      rows,
      percent: rows.length ? Math.round((presentish / rows.length) * 100) : 0,
    }
  },
  async list() {
    await wait(120)
    return mockDb.get().attendance.map((row) => ({
      ...row,
      student: USERS.find((user) => user.id === row.studentId),
      course: COURSES.find((course) => course.id === row.courseId),
    }))
  },
  async setStatus(id, status, actorId) {
    await wait(140)
    mockDb.mutate((db) => {
      const row = db.attendance.find((item) => item.id === id)
      if (row) row.status = status
    })
    return this.list()
  },
}

export const scheduleService = {
  async forUser(userId, role) {
    await wait(120)
    return mockDb
      .get()
      .schedule.filter((item) => {
        if (role === 'ADMIN') return true
        if (role === 'FACULTY') return item.instructorId === userId || item.audience.includes(userId)
        return item.audience.includes(userId)
      })
      .sort((a, b) => new Date(a.start) - new Date(b.start))
  },
}

export const certificateService = {
  async forStudent(studentId) {
    await wait(120)
    return mockDb.get().certificates.filter((item) => item.studentId === studentId)
  },
}

export const notificationService = {
  async list(userId) {
    await wait(100)
    return mockDb
      .get()
      .notifications.filter((item) => item.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },
  async markRead(id) {
    mockDb.mutate((db) => {
      const row = db.notifications.find((item) => item.id === id)
      if (row) row.read = true
    })
    return true
  },
  async markAll(userId) {
    mockDb.mutate((db) => {
      db.notifications.forEach((item) => {
        if (item.userId === userId) item.read = true
      })
    })
    return true
  },
}

export const violationService = {
  async list() {
    await wait(120)
    return mockDb.get().violations.map((item) => ({
      ...item,
      student: USERS.find((user) => user.id === item.studentId),
    }))
  },
  async decide(id, status, note, actorId) {
    await wait(140)
    mockDb.mutate((db) => {
      const row = db.violations.find((item) => item.id === id)
      if (!row) return
      row.status = status
      row.note = note
      db.audit.unshift({
        id: `aud-${Date.now()}`,
        actorId,
        action: 'Violation reviewed',
        target: row.studentId,
        timestamp: new Date().toISOString(),
        metadata: { status },
        status: 'RECORDED',
      })
    })
    return this.list()
  },
}

export const auditService = {
  async list() {
    await wait(100)
    return mockDb.get().audit.map((item) => ({
      ...item,
      actor: USERS.find((user) => user.id === item.actorId),
    }))
  },
}

export const backupService = {
  async list() {
    await wait(100)
    return BACKUPS
  },
}

export const accessControlService = {
  async matrix() {
    await wait(80)
    return { permissions: PERMISSIONS, roles: ROLE_MATRIX, note: 'UI documentation. Backend must enforce.' }
  },
}

export const restrictionService = {
  async list() {
    await wait(100)
    return mockDb.get().restrictions.map((item) => ({
      ...item,
      user: USERS.find((user) => user.id === item.userId),
    }))
  },
  async apply(payload) {
    await wait(180)
    const record = {
      id: id('rst'),
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      ...payload,
    }
    mockDb.mutate((db) => {
      db.restrictions.unshift(record)
      const user = db.users.find((item) => item.id === payload.userId)
      if (user) user.status = 'RESTRICTED'
      db.audit.unshift({
        id: id('aud'),
        actorId: payload.createdBy,
        action: 'Restriction applied',
        target: payload.userId,
        timestamp: record.createdAt,
        metadata: { type: payload.type },
        status: 'RECORDED',
      })
    })
    return record
  },
  async lift(restrictionId, actorId) {
    await wait(160)
    mockDb.mutate((db) => {
      const row = db.restrictions.find((item) => item.id === restrictionId)
      if (!row) return
      row.status = 'EXPIRED'
      const user = db.users.find((item) => item.id === row.userId)
      if (user) user.status = 'ACTIVE'
      db.audit.unshift({
        id: id('aud'),
        actorId,
        action: 'Restriction removed',
        target: row.userId,
        timestamp: new Date().toISOString(),
        metadata: {},
        status: 'RECORDED',
      })
    })
    return this.list()
  },
}

export const resetService = {
  async preview(studentId, targets) {
    await wait(80)
    const user = mockDb.get().users.find((item) => item.id === studentId)
    return { student: user ? strip(user) : null, targets, warning: 'Mock reset only. Requires explicit confirm.' }
  },
  async execute(studentId, targets, actorId, reason) {
    await wait(240)
    mockDb.mutate((db) => {
      if (targets.includes('progress')) db.levelProgress[studentId] = {}
      if (targets.includes('practice')) db.labProgress[studentId] = {}
      if (targets.includes('attempts')) {
        db.attempts = db.attempts.filter((item) => item.studentId !== studentId)
        db.access = db.access.filter((item) => item.studentId !== studentId)
      }
      if (targets.includes('account')) {
        const user = db.users.find((item) => item.id === studentId)
        if (user) user.status = 'ACTIVE'
      }
      db.audit.unshift({
        id: id('aud'),
        actorId,
        action: 'Student reset',
        target: studentId,
        timestamp: new Date().toISOString(),
        metadata: { targets, reason },
        status: 'RECORDED',
      })
    })
    return true
  },
}

export const operationsNotes = {
  limitations: SECURITY_LIMITATIONS,
  assets: ASSETS,
}

function strip(user) {
  const { password, ...rest } = user
  return rest
}
