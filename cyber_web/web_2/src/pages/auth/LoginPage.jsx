import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BrandMark } from '@/components/cyber/BrandMark'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DEMO_ACCOUNTS, MOCK_PASSWORD_HINT } from '@/data/users'
import { useAuthStore } from '@/stores/authStore'

export function LoginPage() {
  const login = useAuthStore((state) => state.login)
  const loginPreview = useAuthStore((state) => state.loginPreview)
  const loading = useAuthStore((state) => state.loading)
  const error = useAuthStore((state) => state.error)
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('student@cybernex.local')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [fieldError, setFieldError] = useState({})

  const from = location.state?.from

  const validation = useMemo(() => {
    const next = {}
    if (!email.trim()) next.email = 'Email is required.'
    else if (!email.includes('@')) next.email = 'Enter a valid email.'
    if (!password) next.password = 'Password is required.'
    return next
  }, [email, password])

  async function onSubmit(event) {
    event.preventDefault()
    setFieldError(validation)
    if (Object.keys(validation).length) return
    try {
      const result = await login({ email, password, remember })
      navigate(from && from !== '/login' ? from : result.home, { replace: true })
    } catch {
      /* store captures message */
    }
  }

  async function enterAs(account) {
    const result = await loginPreview(account.role)
    navigate(result.home, { replace: true })
  }

  return (
    <div className="relative min-h-svh overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-[-10%] h-[420px] w-[420px] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute right-[-8%] bottom-[-10%] h-[360px] w-[360px] rounded-full bg-success/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-svh max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="max-w-xl space-y-6">
          <div className="flex items-center gap-3">
            <BrandMark size={36} />
            <div>
              <p className="font-display text-sm font-semibold tracking-[0.22em]">CYBERNEX</p>
              <p className="type-caption text-muted">Learn · Practice · Assess · Analyze · Level up</p>
            </div>
          </div>
          <h1 className="type-display">A professional path through cybersecurity skill.</h1>
          <p className="type-body text-secondary">
            Structured curriculum, simulated labs, and granted assessments — designed for students, faculty, and
            operators. This login is a mock directory for product demonstration.
          </p>
          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="type-caption text-muted">Journey</dt>
              <dd className="mt-1 text-sm text-ink">12-level Cyber Atlas</dd>
            </div>
            <div>
              <dt className="type-caption text-muted">Practice</dt>
              <dd className="mt-1 text-sm text-ink">Isolated lab simulations</dd>
            </div>
            <div>
              <dt className="type-caption text-muted">Evaluation</dt>
              <dd className="mt-1 text-sm text-ink">Access grants, not toggles</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-line bg-surface/90 p-6 shadow-[var(--shadow)] md:p-8">
          <p className="type-caption text-muted">Mock directory sign-in</p>
          <h2 className="mt-2 type-h2">Enter the platform</h2>
          <p className="mt-2 type-small text-secondary">
            Credentials are development-only. Browser storage is not security.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={fieldError.email}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={fieldError.password}
              hint={`Demo password for listed accounts: ${MOCK_PASSWORD_HINT}`}
            />
            <label className="flex items-center gap-2 type-small text-secondary">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="size-4 accent-[var(--accent)]"
              />
              Remember this mock session on this device
            </label>
            {error ? (
              <p className="rounded-md border border-danger/40 bg-danger-soft px-3 py-2 type-small text-danger" role="alert">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" loading={loading}>
              Continue
            </Button>
          </form>

          <div className="mt-8">
            <p className="type-caption text-muted">Role preview accounts</p>
            <div className="mt-3 grid gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  className="flex items-center justify-between rounded-md border border-line bg-raised px-3 py-3 text-left hover:bg-hover"
                  onClick={() => enterAs(account)}
                >
                  <span>
                    <span className="block text-sm text-ink">{account.label}</span>
                    <span className="type-small text-muted">{account.email}</span>
                  </span>
                  <span className="type-caption text-accent">{account.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
