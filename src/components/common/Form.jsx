import { useId } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '../../utils/cn'

export function Field({ label, htmlFor, hint, error, required, className, children }) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={htmlFor} className="field-label">
          {label}
          {required && (
            <span className="ml-1 text-[var(--danger)]" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <p className="field-error" id={htmlFor ? `${htmlFor}-error` : undefined} role="alert">
          <AlertCircle className="h-3 w-3" aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && <p className="field-hint">{hint}</p>
      )}
    </div>
  )
}

export function Input({ className, id, ...props }) {
  return <input id={id} className={cn('glass-input', className)} {...props} />
}

export function Textarea({ className, id, ...props }) {
  return <textarea id={id} className={cn('glass-input resize-y', className)} {...props} />
}

export function Select({ className, id, children, ...props }) {
  return (
    <select id={id} className={cn('glass-input', className)} {...props}>
      {children}
    </select>
  )
}

export function TextField({
  label,
  hint,
  error,
  required,
  className,
  id: providedId,
  ...props
}) {
  const generatedId = useId()
  const id = providedId ?? generatedId
  return (
    <Field label={label} htmlFor={id} hint={hint} error={error} required={required} className={className}>
      <Input
        id={id}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
    </Field>
  )
}

export function TextAreaField({
  label,
  hint,
  error,
  required,
  className,
  id: providedId,
  ...props
}) {
  const generatedId = useId()
  const id = providedId ?? generatedId
  return (
    <Field label={label} htmlFor={id} hint={hint} error={error} required={required} className={className}>
      <Textarea
        id={id}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
    </Field>
  )
}

export function SelectField({
  label,
  hint,
  error,
  required,
  className,
  id: providedId,
  children,
  ...props
}) {
  const generatedId = useId()
  const id = providedId ?? generatedId
  return (
    <Field label={label} htmlFor={id} hint={hint} error={error} required={required} className={className}>
      <Select
        id={id}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      >
        {children}
      </Select>
    </Field>
  )
}

export function Toggle({ checked, onChange, label, description, disabled = false, id }) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <label htmlFor={inputId} className="block cursor-pointer text-sm font-medium text-ink">
          {label}
        </label>
        {description && <p className="mt-0.5 text-xs leading-relaxed text-subtle">{description}</p>}
      </div>
      <button
        type="button"
        id={inputId}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors duration-200',
          checked
            ? 'border-transparent bg-[var(--accent)]'
            : 'border-[var(--line-strong)] bg-[var(--input-bg)]',
          disabled && 'opacity-50',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow-sm transition-transform duration-200',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  )
}
