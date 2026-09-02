import { DEMO_ACCOUNTS, roleHome, USERS } from '@/data/users'
import { localState, wait } from '@/services/localState'
import { mockDb } from '@/services/mockDb'

const SESSION_KEY = 'auth.session'

/** Mock authentication. Replace with a real auth API. Never trust this session. */
export const authService = {
  demoAccounts() {
    return DEMO_ACCOUNTS
  },

  async login({ email, password, remember }) {
    await wait(420)
    const db = mockDb.get()
    const user = db.users.find((entry) => entry.email.toLowerCase() === String(email).trim().toLowerCase())
    if (!user || user.password !== password) {
      const error = new Error('Email or password is not recognised in this mock directory.')
      error.code = 'INVALID_CREDENTIALS'
      throw error
    }
    const session = {
      mock: true,
      warning: 'Mock session stored in the browser. This is not authentication.',
      userId: user.id,
      role: user.role,
      remember: Boolean(remember),
      issuedAt: new Date().toISOString(),
    }
    localState.set(SESSION_KEY, session)
    return { session, user: publicUser(user), home: roleHome(user.role) }
  },

  async loginPreview(roleLabel) {
    const demo = DEMO_ACCOUNTS.find((entry) => entry.label === roleLabel || entry.role === roleLabel)
    if (!demo) throw new Error('Unknown preview role')
    return this.login({ email: demo.email, password: 'preview', remember: true })
  },

  logout() {
    localState.remove(SESSION_KEY)
  },

  currentSession() {
    return localState.get(SESSION_KEY, null)
  },

  currentUser() {
    const session = this.currentSession()
    if (!session?.userId) return null
    const user = mockDb.get().users.find((entry) => entry.id === session.userId) ?? USERS.find((entry) => entry.id === session.userId)
    return user ? publicUser(user) : null
  },
}

export function publicUser(user) {
  const { password: _password, ...rest } = user
  return rest
}
