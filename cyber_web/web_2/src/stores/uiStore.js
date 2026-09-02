import { create } from 'zustand'
import { localState } from '@/services/localState'

export const useUiStore = create((set) => ({
  sidebarCollapsed: Boolean(localState.get('ui.sidebarCollapsed', false)),
  mobileNavOpen: false,
  toasts: [],
  toggleSidebar: () =>
    set((state) => {
      const sidebarCollapsed = !state.sidebarCollapsed
      localState.set('ui.sidebarCollapsed', sidebarCollapsed)
      return { sidebarCollapsed }
    }),
  setSidebarCollapsed: (sidebarCollapsed) => {
    localState.set('ui.sidebarCollapsed', sidebarCollapsed)
    set({ sidebarCollapsed })
  },
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  pushToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          tone: 'info',
          ...toast,
        },
      ].slice(-4),
    })),
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}))
