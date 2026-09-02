import { create } from 'zustand'
import { authService } from '@/services/authService'

export const useAuthStore = create((set, get) => ({
  session: authService.currentSession(),
  user: authService.currentUser(),
  loading: false,
  error: null,

  hydrate() {
    set({ session: authService.currentSession(), user: authService.currentUser() })
  },

  async login(payload) {
    set({ loading: true, error: null })
    try {
      const result = await authService.login(payload)
      set({ session: result.session, user: result.user, loading: false, error: null })
      return result
    } catch (error) {
      set({ loading: false, error: error.message })
      throw error
    }
  },

  async loginPreview(role) {
    set({ loading: true, error: null })
    const result = await authService.loginPreview(role)
    set({ session: result.session, user: result.user, loading: false })
    return result
  },

  logout() {
    authService.logout()
    set({ session: null, user: null, error: null })
  },

  isRole(role) {
    return get().user?.role === role
  },
}))
