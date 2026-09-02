import { LABS, LAB_PROGRESS, TERMINAL_SCRIPTS } from '@/data/labs'
import { LEVELS } from '@/data/curriculum'
import { wait } from '@/services/localState'
import { mockDb } from '@/services/mockDb'

function progressFor(studentId, labId) {
  return (
    mockDb.get().labProgress[studentId]?.[labId] ?? {
      status: 'LOCKED',
      completedTaskIds: [],
      percent: 0,
    }
  )
}

function labStatus(studentId, lab) {
  const stored = progressFor(studentId, lab.id)
  if (stored.status && stored.status !== 'LOCKED') return stored
  const levelState = mockDb.get().levelProgress[studentId]?.[lab.levelId]?.state
  if (['COMPLETED', 'CURRENT', 'IN_PROGRESS', 'AVAILABLE'].includes(levelState) || lab.levelId <= 3) {
    return { ...stored, status: stored.percent > 0 ? 'IN_PROGRESS' : 'AVAILABLE' }
  }
  return { status: 'LOCKED', completedTaskIds: [], percent: 0 }
}

export const practiceService = {
  async listLabs({ studentId, query = '', category = 'all', difficulty = 'all', status = 'all' }) {
    await wait(200)
    return LABS.map((lab) => ({
      ...lab,
      ...labStatus(studentId, lab),
      levelTitle: LEVELS.find((level) => level.id === lab.levelId)?.title,
    })).filter((lab) => {
      const hay = `${lab.title} ${lab.category} ${lab.skills.join(' ')}`.toLowerCase()
      if (query && !hay.includes(query.toLowerCase())) return false
      if (category !== 'all' && lab.category !== category) return false
      if (difficulty !== 'all' && lab.difficulty !== difficulty) return false
      if (status !== 'all' && lab.status !== status) return false
      return true
    })
  },

  async getLab(studentId, labId) {
    await wait(140)
    const lab = LABS.find((item) => item.id === labId || item.slug === labId)
    if (!lab) return null
    return {
      ...lab,
      ...labStatus(studentId, lab),
      levelTitle: LEVELS.find((level) => level.id === lab.levelId)?.title,
      terminal: TERMINAL_SCRIPTS[lab.id] ?? TERMINAL_SCRIPTS.default,
    }
  },

  normalizeAnswer(value) {
    return String(value ?? '')
      .trim()
      .toLowerCase()
  },

  async submitTask(studentId, labId, taskId, value) {
    await wait(160)
    const lab = await this.getLab(studentId, labId)
    const task = lab?.tasks.find((item) => item.id === taskId)
    if (!lab || !task) throw new Error('Task not found')
    if (lab.status === 'LOCKED') throw new Error('This lab is locked in the mock catalogue.')
    const ok = this.normalizeAnswer(value) === this.normalizeAnswer(task.answer)
    if (!ok) {
      const error = new Error('That answer does not match the mock validator.')
      error.code = 'INVALID'
      throw error
    }
    mockDb.mutate((db) => {
      db.labProgress[studentId] ??= {}
      const current = db.labProgress[studentId][lab.id] ?? { status: 'IN_PROGRESS', completedTaskIds: [], percent: 0 }
      const completed = new Set(current.completedTaskIds)
      completed.add(taskId)
      const percent = Math.round((completed.size / lab.tasks.length) * 100)
      db.labProgress[studentId][lab.id] = {
        status: percent >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
        completedTaskIds: [...completed],
        percent,
      }
    })
    return this.getLab(studentId, lab.id)
  },

  seedDefaults() {
    if (!mockDb.get().labProgress['u-amina']) {
      mockDb.mutate((db) => {
        db.labProgress = { ...LAB_PROGRESS, ...db.labProgress }
      })
    }
  },
}

export function runSimulatedCommand(script, input) {
  const raw = String(input ?? '').trim()
  const [cmd, ...rest] = raw.split(/\s+/)
  const arg = rest.join(' ')
  const files = script.files ?? {}
  const cwd = script.cwd ?? '/home/analyst'

  if (!cmd || cmd === 'help') {
    return { ok: true, lines: ['allowlist: help, pwd, ls, cat, whoami, clear', 'Host execution is disabled.'] }
  }
  if (cmd === 'pwd') return { ok: true, lines: [cwd] }
  if (cmd === 'whoami') return { ok: true, lines: ['analyst'] }
  if (cmd === 'ls') {
    const names = Object.keys(files)
      .filter((path) => path.startsWith(cwd) || path.startsWith('/etc') || path.startsWith('/home'))
      .map((path) => path.split('/').pop())
    return { ok: true, lines: names.length ? names : ['.', '..'] }
  }
  if (cmd === 'cat') {
    const target = arg.startsWith('/') ? arg : `${cwd}/${arg}`
    if (files[target]) return { ok: true, lines: files[target].split('\n') }
    const match = Object.entries(files).find(([path]) => path.endsWith(arg) || path === arg)
    if (match) return { ok: true, lines: match[1].split('\n') }
    return { ok: false, lines: [`cat: ${arg || '?'}: no such file in the simulation`] }
  }
  return { ok: false, lines: [`${cmd}: not in the CyberNex allowlist. Host execution is refused.`] }
}
