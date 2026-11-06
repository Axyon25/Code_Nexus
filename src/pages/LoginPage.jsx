import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Field, Input } from '../components/common/Form'
import { DEMO_CREDENTIALS, mockLogin } from '../services/authService'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const REMEMBER_KEY = 'truthnuke-remember-email'

function readRememberedEmail() {
  try {
    return window.localStorage.getItem(REMEMBER_KEY) ?? ''
  } catch {
    return ''
  }
}

export default function LoginPage() {
  const navigate = useNavigate()
  const remembered = readRememberedEmail()
  const [email, setEmail] = useState(remembered)
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(Boolean(remembered))
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const next = {}
    if (!email.trim()) next.email = 'Enter your work email.'
    else if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Enter your password.'
    else if (password.length < 6) next.password = 'Password must be at least 6 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const finishSignIn = (address) => {
    try {
      if (remember) window.localStorage.setItem(REMEMBER_KEY, address)
      else window.localStorage.removeItem(REMEMBER_KEY)
    } catch {
      /* optional preference */
    }
    toast.success('Welcome to the demo workspace', {
      description: 'You are signed in as Maya Chen, Head of Brand Governance.',
    })
    navigate('/dashboard')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    if (!validate()) return
    setSubmitting(true)
    try {
      await mockLogin({ email: email.trim() })
      finishSignIn(email.trim())
    } catch (error) {
      setFormError(error.message || 'Unable to sign in to the demo. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const useDemo = async () => {
    setEmail(DEMO_CREDENTIALS.email)
    setPassword(DEMO_CREDENTIALS.password)
    setErrors({})
    setFormError('')
    setSubmitting(true)
    try {
      await mockLogin({ email: DEMO_CREDENTIALS.email })
      finishSignIn(DEMO_CREDENTIALS.email)
    } catch {
      setFormError('Unable to open the demo workspace.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="glass-panel p-6 sm:p-8">
      <div className="flex items-start justify-between gap-3">
        <Badge tone="info" dot>
          Welcome back
        </Badge>
        <span className="badge tone-approved">
          <LockKeyhole className="h-3 w-3" aria-hidden="true" />
          Demo only
        </span>
      </div>

      <h1 className="mt-4 text-[28px] font-semibold leading-tight tracking-[-0.04em] text-ink">
        Sign in to Truth Nuke
      </h1>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">
        Review content, inspect findings and approve changes from one governance workspace.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        <Field
          label="Work email"
          htmlFor="login-email"
          error={errors.email}
          hint={!errors.email ? 'Use any email in this demonstration.' : undefined}
        >
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-subtle"
              aria-hidden="true"
            />
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@company.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setErrors((prev) => ({ ...prev, email: undefined }))
                setFormError('')
              }}
              aria-invalid={errors.email ? 'true' : undefined}
              aria-describedby={errors.email ? 'login-email-error' : undefined}
              className="pl-9"
            />
          </div>
        </Field>

        <Field
          label="Password"
          htmlFor="login-password"
          error={errors.password}
          hint={!errors.password ? 'Minimum 6 characters. Not verified in this demo.' : undefined}
        >
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setErrors((prev) => ({ ...prev, password: undefined }))
                setFormError('')
              }}
              aria-invalid={errors.password ? 'true' : undefined}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-subtle transition-colors hover:bg-[var(--hover-surface)] hover:text-ink"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </button>
          </div>
        </Field>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="login-remember" className="flex cursor-pointer items-center gap-2 text-[11px] text-muted">
            <input
              id="login-remember"
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="h-3.5 w-3.5 rounded border-[var(--line-strong)] accent-[var(--accent)]"
            />
            Remember my email
          </label>
          <button
            type="button"
            onClick={() =>
              toast('Password reset is not connected', {
                description: 'This frontend demonstration has no authentication service.',
              })
            }
            className="rounded text-[11px] font-medium text-[var(--accent)] transition-opacity hover:opacity-80"
          >
            Forgot password?
          </button>
        </div>

        {formError && (
          <p className="rounded-xl border border-[var(--danger-line)] bg-[var(--danger-soft)] px-3 py-2 text-[11px] text-[var(--danger)]" role="alert">
            {formError}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={submitting}
        >
          Sign in
          {!submitting && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-[var(--line)]" />
        <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-subtle">or</span>
        <span className="h-px flex-1 bg-[var(--line)]" />
      </div>

      <button type="button" onClick={useDemo} className="btn btn-glass w-full" disabled={submitting}>
        Enter demo workspace
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      <div className="mt-5 rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] p-3">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-subtle">
          Demo credentials
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-muted">
          <span>{DEMO_CREDENTIALS.email}</span>
          <span className="text-subtle">/</span>
          <span>{DEMO_CREDENTIALS.password}</span>
        </div>
        <p className="mt-1.5 text-[9px] leading-relaxed text-subtle">
          Authentication is simulated. Credentials are never transmitted or stored.
        </p>
      </div>

      <p className="mt-5 text-center text-[11px] text-muted">
        New to Truth Nuke?{' '}
        <Link to="/register" className="font-semibold text-[var(--accent)] hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}
