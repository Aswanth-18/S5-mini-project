import { Link } from 'react-router-dom'
import { BrandMark } from '@/components/cyber/BrandMark'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/authStore'
import { roleHome } from '@/data/users'

export function NotFoundPage() {
  const user = useAuthStore((state) => state.user)
  const to = user ? roleHome(user.role) : '/login'
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col justify-center gap-4">
      <BrandMark />
      <p className="type-caption text-muted">404</p>
      <h1 className="type-h1">This route is not in CyberNex</h1>
      <p className="text-secondary">The path does not match a student, faculty, or admin destination.</p>
      <div>
        <Button asChild={false}>
          <Link to={to} className="contents">
            Return
          </Link>
        </Button>
      </div>
    </div>
  )
}
