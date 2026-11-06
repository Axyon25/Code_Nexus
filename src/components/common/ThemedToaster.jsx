import { Toaster } from 'sonner'
import { useTheme } from '../../context/useTheme'

export function ThemedToaster() {
  const { resolvedTheme } = useTheme()

  return (
    <Toaster
      theme={resolvedTheme}
      position="bottom-right"
      closeButton
      toastOptions={{
        style: {
          background: 'var(--panel-strong)',
          color: 'var(--ink)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-pop)',
          borderRadius: '16px',
          fontSize: '12px',
        },
        classNames: {
          title: 'text-ink',
          description: 'text-muted',
        },
      }}
    />
  )
}
