import { useCallback, useEffect, useMemo, useState } from 'react'

import { ThemeContext } from './themeContext'

const STORAGE_KEY = 'truthnuke-theme'

const VALID_MODES = ['light', 'dark', 'system']

function systemPrefersDark() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function readStoredMode() {
  if (typeof window === 'undefined') return 'system'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return VALID_MODES.includes(stored) ? stored : 'system'
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(readStoredMode)
  const [systemDark, setSystemDark] = useState(systemPrefersDark)

  const resolvedTheme = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event) => setSystemDark(event.matches)
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', resolvedTheme === 'dark')
    root.style.colorScheme = resolvedTheme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', resolvedTheme === 'dark' ? '#060a13' : '#eef2f8')
  }, [resolvedTheme])

  const setTheme = useCallback((nextMode) => {
    if (!VALID_MODES.includes(nextMode)) return
    setMode(nextMode)
    try {
      window.localStorage.setItem(STORAGE_KEY, nextMode)
    } catch {
      /* storage can be blocked; the in-memory theme still works */
    }
  }, [])

  const value = useMemo(
    () => ({ mode, resolvedTheme, setTheme, isDark: resolvedTheme === 'dark' }),
    [mode, resolvedTheme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

