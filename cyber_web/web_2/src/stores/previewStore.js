import { create } from 'zustand'
import { ROLES } from '@/data/navigation'
import { localState } from '@/services/localState'

export const usePreviewStore = create((set) => ({
  role: ROLES[localState.get('preview.role', 'student')] ? localState.get('preview.role', 'student') : 'student',
  setRole: (role) => {
    if (!ROLES[role]) return
    localState.set('preview.role', role)
    set({ role })
  },
}))
