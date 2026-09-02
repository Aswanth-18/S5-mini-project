import { clone } from '@/lib/clone'
import { ACTIVITY, ATTENDANCE, CERTIFICATES, NOTIFICATIONS, SCHEDULE } from '@/data/campus'
import { ASSESSMENT_ACCESS, ATTEMPTS, QUESTIONS, VIOLATIONS } from '@/data/assessments'
import { LAB_PROGRESS } from '@/data/labs'
import { STUDENT_LEVEL_PROGRESS } from '@/data/curriculum'
import { AUDIT_LOGS, RESTRICTIONS } from '@/data/operations'
import { USERS } from '@/data/users'
import { localState } from '@/services/localState'

const KEY = 'mock.db.v1'

function seed() {
  return {
    users: clone(USERS),
    access: clone(ASSESSMENT_ACCESS),
    attempts: clone(ATTEMPTS),
    questions: clone(QUESTIONS),
    violations: clone(VIOLATIONS),
    attendance: clone(ATTENDANCE),
    schedule: clone(SCHEDULE),
    certificates: clone(CERTIFICATES),
    notifications: clone(NOTIFICATIONS),
    activity: clone(ACTIVITY),
    labProgress: clone(LAB_PROGRESS),
    levelProgress: clone(STUDENT_LEVEL_PROGRESS),
    restrictions: clone(RESTRICTIONS),
    audit: clone(AUDIT_LOGS),
    lessonCompletions: {},
    attemptDrafts: {},
  }
}

let memory = null

function load() {
  if (memory) return memory
  const stored = localState.get(KEY, null)
  memory = stored ? { ...seed(), ...stored } : seed()
  return memory
}

function persist() {
  localState.set(KEY, memory)
}

export const mockDb = {
  get() {
    return load()
  },
  mutate(writer) {
    const db = load()
    writer(db)
    persist()
    return db
  },
  reset() {
    memory = seed()
    persist()
    return memory
  },
}
