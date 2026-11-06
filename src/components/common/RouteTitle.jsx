import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const PAGE_TITLES = {
  '/': 'Truth Nuke — Nuke inconsistencies before you publish.',
  '/login': 'Sign in · Truth Nuke',
  '/register': 'Create account · Truth Nuke',
  '/dashboard': 'Dashboard · Truth Nuke',
  '/guidelines': 'Guideline Library · Truth Nuke',
  '/review/new': 'New Review · Truth Nuke',
  '/approvals': 'Approval Center · Truth Nuke',
  '/history': 'Review History · Truth Nuke',
  '/team': 'Team · Truth Nuke',
  '/settings': 'Settings · Truth Nuke',
}

function titleFor(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname

  if (PAGE_TITLES[path]) return PAGE_TITLES[path]

  if (path.startsWith('/review/')) {
    const id = path.slice('/review/'.length)
    if (id) return `Review ${id.toUpperCase()} · Truth Nuke`
  }

  return 'Page not found · Truth Nuke'
}

export function RouteTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = titleFor(pathname)
  }, [pathname])

  return null
}
