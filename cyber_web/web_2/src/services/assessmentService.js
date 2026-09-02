import { ASSESSMENTS, QUESTIONS } from '@/data/assessments'
import { LEVELS } from '@/data/curriculum'
import { USERS } from '@/data/users'
import { id } from '@/lib/clone'
import { wait } from '@/services/localState'
import { mockDb } from '@/services/mockDb'

function accessFor(studentId, assessmentId) {
  return mockDb
    .get()
    .access.filter((item) => item.studentId === studentId && item.assessmentId === assessmentId)
    .sort((a, b) => new Date(b.grantedAt) - new Date(a.grantedAt))[0]
}

function catalogStatus(assessment, grant) {
  if (!grant) return assessment.levelId > 3 ? 'LOCKED' : 'ELIGIBLE'
  return grant.status
}

export const assessmentAccessService = {
  listForStudent(studentId) {
    return mockDb.get().access.filter((item) => item.studentId === studentId)
  },

  async grant({ studentIds, assessmentId, grantedBy, expiresAt, attemptsAllowed }) {
    await wait(220)
    const created = []
    mockDb.mutate((db) => {
      studentIds.forEach((studentId) => {
        const record = {
          id: id('acc'),
          studentId,
          assessmentId,
          grantedBy,
          grantedAt: new Date().toISOString(),
          status: 'OPEN',
          expiresAt,
          attemptsAllowed: Number(attemptsAllowed) || 1,
          attemptsUsed: 0,
        }
        db.access.push(record)
        created.push(record)
        db.audit.unshift({
          id: id('aud'),
          actorId: grantedBy,
          action: studentIds.length > 1 ? 'Bulk unlock' : 'Assessment unlocked',
          target: `${studentId} / ${assessmentId}`,
          timestamp: record.grantedAt,
          metadata: { accessId: record.id, attemptsAllowed: record.attemptsAllowed },
          status: 'RECORDED',
        })
      })
    })
    return created
  },
}

export const assessmentService = {
  async listForStudent(studentId) {
    await wait(180)
    return ASSESSMENTS.map((assessment) => {
      const grant = accessFor(studentId, assessment.id)
      const attempts = mockDb.get().attempts.filter((item) => item.studentId === studentId && item.assessmentId === assessment.id)
      const latest = attempts[attempts.length - 1]
      return {
        ...assessment,
        levelTitle: LEVELS.find((level) => level.id === assessment.levelId)?.title,
        access: grant ?? null,
        status: latest?.status === 'PUBLISHED' ? (latest.passed ? 'PASSED' : 'FAILED') : catalogStatus(assessment, grant),
        attemptsUsed: grant?.attemptsUsed ?? attempts.length,
        attemptsAllowed: grant?.attemptsAllowed ?? 0,
        score: latest?.percent,
      }
    })
  },

  async getForStudent(studentId, assessmentId) {
    const list = await this.listForStudent(studentId)
    const assessment = list.find((item) => item.id === assessmentId)
    if (!assessment) return null
    return {
      ...assessment,
      questions: QUESTIONS.filter((item) => item.assessmentId === assessmentId).map(publicQuestion),
    }
  },

  async startAttempt(studentId, assessmentId) {
    await wait(200)
    const assessment = await this.getForStudent(studentId, assessmentId)
    if (!assessment?.access || !['OPEN', 'IN_PROGRESS'].includes(assessment.access.status)) {
      throw new Error('No live AssessmentAccess grant. UI unlock is not sufficient.')
    }
    if (assessment.access.attemptsUsed >= assessment.access.attemptsAllowed) {
      throw new Error('Attempt budget exhausted for this grant.')
    }
    const attempt = {
      id: id('att'),
      studentId,
      assessmentId,
      accessId: assessment.access.id,
      startedAt: new Date().toISOString(),
      submittedAt: null,
      status: 'IN_PROGRESS',
      answers: {},
      flagged: [],
      violations: [],
      remainingMs: assessment.durationMinutes * 60 * 1000,
      attemptNumber: assessment.access.attemptsUsed + 1,
    }
    mockDb.mutate((db) => {
      db.attemptDrafts[attempt.id] = attempt
      const grant = db.access.find((item) => item.id === assessment.access.id)
      if (grant) grant.status = 'IN_PROGRESS'
    })
    return attempt
  },

  getDraft(attemptId) {
    return mockDb.get().attemptDrafts[attemptId] ?? null
  },

  saveDraft(attemptId, patch) {
    mockDb.mutate((db) => {
      if (!db.attemptDrafts[attemptId]) return
      db.attemptDrafts[attemptId] = { ...db.attemptDrafts[attemptId], ...patch }
    })
    return mockDb.get().attemptDrafts[attemptId]
  },

  recordViolation(attemptId, event) {
    const record = {
      id: id('vio'),
      event,
      timestamp: new Date().toISOString(),
      severity: event === 'PASTE_ATTEMPT' || event === 'COPY_ATTEMPT' ? 'low' : 'medium',
      mock: true,
    }
    mockDb.mutate((db) => {
      const draft = db.attemptDrafts[attemptId]
      if (!draft) return
      draft.violations = [...(draft.violations ?? []), record]
      db.violations.unshift({
        ...record,
        studentId: draft.studentId,
        assessmentId: draft.assessmentId,
        status: 'PENDING',
        note: 'Recorded by browser simulation. Not a trusted integrity signal.',
      })
    })
    return record
  },

  async submit(attemptId) {
    await wait(280)
    const draft = mockDb.get().attemptDrafts[attemptId]
    if (!draft) throw new Error('No in-progress attempt')
    const questions = QUESTIONS.filter((item) => item.assessmentId === draft.assessmentId)
    let earned = 0
    let max = 0
    const skill = {}
    questions.forEach((question) => {
      max += question.points
      skill[question.skill] ??= { earned: 0, max: 0 }
      skill[question.skill].max += question.points
      if (gradeQuestion(question, draft.answers?.[question.id])) {
        earned += question.points
        skill[question.skill].earned += question.points
      }
    })
    const percent = max ? Math.round((earned / max) * 100) : 0
    const assessment = ASSESSMENTS.find((item) => item.id === draft.assessmentId)
    const passed = percent >= (assessment?.passPercent ?? 70)
    const result = {
      id: draft.id,
      studentId: draft.studentId,
      assessmentId: draft.assessmentId,
      accessId: draft.accessId,
      startedAt: draft.startedAt,
      submittedAt: new Date().toISOString(),
      status: 'PUBLISHED',
      score: percent,
      percent,
      grade: percent >= 85 ? 'A' : percent >= 75 ? 'B' : percent >= 70 ? 'C' : 'D',
      passed,
      timeUsedMinutes: Math.max(1, Math.round(((assessment.durationMinutes * 60 * 1000) - (draft.remainingMs ?? 0)) / 60000)),
      attemptNumber: draft.attemptNumber,
      skillBreakdown: Object.entries(skill).map(([name, value]) => ({
        skill: name,
        percent: value.max ? Math.round((value.earned / value.max) * 100) : 0,
      })),
      mock: true,
      warning: 'Score computed in the browser. Backend must re-grade.',
    }
    mockDb.mutate((db) => {
      db.attempts.push(result)
      delete db.attemptDrafts[attemptId]
      const grant = db.access.find((item) => item.id === draft.accessId)
      if (grant) {
        grant.attemptsUsed += 1
        grant.status = 'EXPIRED'
      }
    })
    return result
  },
}

export const resultService = {
  async listForStudent(studentId) {
    await wait(160)
    return mockDb
      .get()
      .attempts.filter((item) => item.studentId === studentId && item.status === 'PUBLISHED')
      .map((item) => ({
        ...item,
        assessment: ASSESSMENTS.find((assessment) => assessment.id === item.assessmentId),
        student: USERS.find((user) => user.id === item.studentId),
      }))
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
  },

  async listAll() {
    await wait(160)
    return mockDb
      .get()
      .attempts.filter((item) => item.submittedAt)
      .map((item) => ({
        ...item,
        assessment: ASSESSMENTS.find((assessment) => assessment.id === item.assessmentId),
        student: USERS.find((user) => user.id === item.studentId),
      }))
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
  },

  async get(id) {
    const all = await this.listAll()
    return all.find((item) => item.id === id) ?? null
  },
}

function publicQuestion(question) {
  const { answer, accepted, sample, ...rest } = question
  return rest
}

function gradeQuestion(question, value) {
  if (question.rubric) {
    return String(value ?? '').trim().length > 12
  }
  if (question.type === 'multiple-choice' || question.type === 'log-analysis') {
    return Number(value) === Number(question.answer)
  }
  if (question.type === 'true-false') {
    return Boolean(value) === Boolean(question.answer)
  }
  if (question.type === 'multiple-select' || question.type === 'ordering') {
    const a = [...(value ?? [])].map(Number).sort().join(',')
    const b = [...question.answer].map(Number).sort().join(',')
    if (question.type === 'ordering') {
      return JSON.stringify(value ?? []) === JSON.stringify(question.answer)
    }
    return a === b
  }
  if (question.type === 'short-answer') {
    const needle = String(value ?? '').trim().toLowerCase()
    return (question.accepted ?? [question.answer]).some((item) => item.toLowerCase() === needle)
  }
  return false
}
