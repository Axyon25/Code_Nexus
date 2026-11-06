import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Field, Input } from '../components/common/Form'
import { mockRegister } from '../services/authService'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function scorePassword(password) {
  let score = 0
  if (password.length >= 8) score += 1
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  return score
}

const STRENGTH = [
  { label: 'Too weak', className: 'bg-[var(--danger)]' },
  { label: 'Weak', className: 'bg-[var(--danger)]' },
  { label: 'Fair', className: 'bg-[var(--warning)]' },
  { label: 'Good', className: 'bg-[var(--accent)]' },
  { label: 'Strong', className: 'bg-[var(--success)]' },
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    terms: false,
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const strength = useMemo(() => scorePassword(form.password), [form.password])

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Enter your full name.'
    if (!form.email.trim()) next.email = 'Enter your work email.'
    else if (!EMAIL_PATTERN.test(form.email.trim())) next.email = 'Enter a valid email address.'
    if (!form.password) next.password = 'Create a password.'
    else if (form.password.length < 8) next.password = 'Use at least 8 characters.'
    if (!form.confirm) next.confirm = 'Confirm your password.'
    else if (form.confirm !== form.password) next.confirm = 'Passwords do not match.'
    if (!form.terms) next.terms = 'Acknowledge the demo notice to continue.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await mockRegister({ name: form.name.trim(), email: form.email.trim() })
      toast.success('Demo workspace ready', {
        description:
          'No server account was created. You are exploring the shared Truth Nuke sample workspace.',
      })
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message || 'Unable to create the demo account.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="glass-panel p-6 sm:p-8">
      <div className="flex items-start justify-between gap-3">
        <Badge tone="violet" dot>
          Get started
        </Badge>
        <span className="badge tone-approved">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          Demo access
        </span>
      </div>

      <h1 className="mt-4 text-[28px] font-semibold leading-tight tracking-[-0.04em] text-ink">
        Create your account
      </h1>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">
        Set up a demonstration workspace and explore the full governance workflow with realistic
        sample content.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        <Field label="Full name" htmlFor="register-name" error={errors.name}>
          <Input
            id="register-name"
            type="text"
            autoComplete="name"
            autoFocus
            placeholder="Alex Morgan"
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? 'register-name-error' : undefined}
          />
        </Field>

        <Field
          label="Work email"
          htmlFor="register-email"
          error={errors.email}
          hint={!errors.email ? 'Any valid email format is accepted in this demo.' : undefined}
        >
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
            aria-invalid={errors.email ? 'true' : undefined}
            aria-describedby={errors.email ? 'register-email-error' : undefined}
          />
        </Field>

        <Field label="Password" htmlFor="register-password" error={errors.password}>
          <div className="relative">
            <Input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={(event) => update('password', event.target.value)}
              aria-invalid={errors.password ? 'true' : undefined}
              aria-describedby={errors.password ? 'register-password-error' : undefined}
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
          {form.password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[0, 1, 2, 3].map((index) => (
                  <span
                    key={index}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      index < strength ? STRENGTH[strength].className : 'bg-[var(--line)]'
                    }`}
                  />
                ))}
              </div>
              <span className="w-14 text-right text-[9px] font-medium text-subtle">
                {STRENGTH[strength].label}
              </span>
            </div>
          )}
        </Field>

        <Field label="Confirm password" htmlFor="register-confirm" error={errors.confirm}>
          <Input
            id="register-confirm"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={form.confirm}
            onChange={(event) => update('confirm', event.target.value)}
            aria-invalid={errors.confirm ? 'true' : undefined}
            aria-describedby={errors.confirm ? 'register-confirm-error' : undefined}
          />
        </Field>

        <div>
          <label htmlFor="register-terms" className="flex cursor-pointer items-start gap-2.5 text-[11px] leading-relaxed text-muted">
            <input
              id="register-terms"
              type="checkbox"
              checked={form.terms}
              onChange={(event) => update('terms', event.target.checked)}
              className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-[var(--line-strong)] accent-[var(--accent)]"
              aria-invalid={errors.terms ? 'true' : undefined}
            />
            <span>
              I understand this is a frontend demonstration. No real account is created and sample
              data is stored only in my browser.
            </span>
          </label>
          {errors.terms && (
            <p className="field-error" role="alert">
              {errors.terms}
            </p>
          )}
        </div>

        <Button type="submit" variant="primary" className="w-full" loading={submitting}>
          Create demo account
          {!submitting && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </Button>
      </form>

      <p className="mt-5 text-center text-[11px] text-muted">
        Already have access?{' '}
        <Link to="/login" className="font-semibold text-[var(--accent)] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
