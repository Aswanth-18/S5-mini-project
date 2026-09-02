import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { flattenNav, findNavItem } from '@/data/navigation'
import { AppShell } from '@/layouts/AppShell'
import { DesignSystemPage } from '@/pages/DesignSystemPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { RoleHomePage } from '@/pages/RoleHomePage'
import { ToastViewport } from '@/components/ui/Toast'

function RolePlaceholder() {
  const { pathname } = useLocation()
  const match = findNavItem(pathname)
  return (
    <PlaceholderPage
      title={match?.item.label ?? 'Reserved'}
      purpose={match?.item.purpose}
    />
  )
}

function roleRoutes(roleId) {
  return flattenNav(roleId).map((item) => {
    const isHome = item.to.endsWith('/dashboard')
    return (
      <Route
        key={item.to}
        path={item.to.replace(`/${roleId}/`, '')}
        element={isHome ? <RoleHomePage roleId={roleId} /> : <RolePlaceholder />}
      />
    )
  })
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
        <Route path="/dev/design-system" element={<DesignSystemPage />} />
        <Route path="/student" element={<AppShell />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          {roleRoutes('student')}
          <Route path="*" element={<RolePlaceholder />} />
        </Route>
        <Route path="/faculty" element={<AppShell />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          {roleRoutes('faculty')}
          <Route path="*" element={<RolePlaceholder />} />
        </Route>
        <Route path="/admin" element={<AppShell />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          {roleRoutes('admin')}
          <Route path="*" element={<RolePlaceholder />} />
        </Route>
        <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
      </Routes>
      <ToastViewport />
    </>
  )
}
