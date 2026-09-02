import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { roleHome, rolePathPrefix } from '@/data/users'

export function RequireAuth({ children }) {
  const user = useAuthStore((state) => state.user)
  const location = useLocation()
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}

export function RequireRole({ role, children }) {
  const user = useAuthStore((state) => state.user)
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) {
    return <Navigate to={roleHome(user.role)} replace />
  }
  return children
}

export function GuestOnly({ children }) {
  const user = useAuthStore((state) => state.user)
  if (user) return <Navigate to={roleHome(user.role)} replace />
  return children
}

export function rolePrefix(user) {
  return rolePathPrefix(user?.role)
}
