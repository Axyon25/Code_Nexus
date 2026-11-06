export const REVIEW_STATUSES = ['draft', 'in-review', 'changes-requested', 'approved', 'rejected']

export const REVIEW_STATUS_META = {
  draft: { label: 'Draft', tone: 'draft' },
  'in-review': { label: 'Under Review', tone: 'review' },
  'changes-requested': { label: 'Changes Requested', tone: 'changes' },
  approved: { label: 'Approved', tone: 'approved' },
  rejected: { label: 'Rejected', tone: 'rejected' },
}

export const SEVERITY_META = {
  critical: { label: 'Critical', tone: 'critical', weight: 14, rank: 0 },
  high: { label: 'High', tone: 'high', weight: 10, rank: 1 },
  medium: { label: 'Medium', tone: 'medium', weight: 6, rank: 2 },
  low: { label: 'Low', tone: 'low', weight: 3, rank: 3 },
}

export const SEVERITIES = ['critical', 'high', 'medium', 'low']

export const CATEGORY_META = {
  claims: { label: 'Incorrect Claims', short: 'Claims', tone: 'violet' },
  outdated: { label: 'Outdated Information', short: 'Outdated', tone: 'orange' },
  voice: { label: 'Brand Voice', short: 'Voice', tone: 'indigo' },
  terminology: { label: 'Terminology', short: 'Terms', tone: 'teal' },
  accessibility: { label: 'Accessibility', short: 'Access', tone: 'amber' },
  'off-brand': { label: 'Off-brand Content', short: 'Off-brand', tone: 'rose' },
}

export const CATEGORY_KEYS = Object.keys(CATEGORY_META)

export const GUIDELINE_CATEGORY_META = {
  'Brand Voice': { tone: 'indigo' },
  'Approved Facts': { tone: 'info' },
  Terminology: { tone: 'teal' },
  'Marketing Claims': { tone: 'violet' },
  Accessibility: { tone: 'amber' },
  'Content Restrictions': { tone: 'rose' },
}

export const GUIDELINE_CATEGORIES = Object.keys(GUIDELINE_CATEGORY_META)

export const GUIDELINE_STATUS_META = {
  active: { label: 'Active', tone: 'approved' },
  review: { label: 'Needs review', tone: 'changes' },
  draft: { label: 'Draft', tone: 'draft' },
}

export const ROLE_META = {
  Creator: { tone: 'info', description: 'Submits content and addresses feedback.' },
  Manager: { tone: 'violet', description: 'Oversees governance and team settings.' },
  Reviewer: { tone: 'teal', description: 'Reviews findings and approves content.' },
}

export const ROLES = Object.keys(ROLE_META)

export const CONTENT_TYPES = ['Blog post', 'Website', 'Social', 'Email', 'Documentation', 'Report']

export function getStatusMeta(status) {
  return REVIEW_STATUS_META[status] ?? REVIEW_STATUS_META.draft
}

export function getSeverityMeta(severity) {
  return SEVERITY_META[severity] ?? SEVERITY_META.low
}

export function getCategoryMeta(category) {
  return CATEGORY_META[category] ?? { label: category, short: category, tone: 'neutral' }
}

export function getScoreTone(score) {
  if (score >= 90) return { tone: 'success', label: 'Excellent' }
  if (score >= 75) return { tone: 'info', label: 'Good' }
  if (score >= 60) return { tone: 'warning', label: 'Needs work' }
  return { tone: 'danger', label: 'High risk' }
}

export function countBySeverity(findings = []) {
  return findings.reduce(
    (acc, finding) => {
      acc[finding.severity] = (acc[finding.severity] ?? 0) + 1
      return acc
    },
    { critical: 0, high: 0, medium: 0, low: 0 },
  )
}

export function scoreFromFindings(findings = []) {
  const open = findings.filter((finding) => finding.status !== 'accepted')
  const penalty = open.reduce(
    (total, finding) => total + (SEVERITY_META[finding.severity]?.weight ?? 3),
    0,
  )
  return Math.max(28, Math.min(100, 100 - penalty))
}

export function reviewNeedsApproval(review) {
  return review.status === 'in-review' || review.status === 'changes-requested'
}

/**
 * Illustrative score once accepted AI suggestions are applied. This is a
 * projection only — a human reviewer still determines the final decision.
 */
export function projectedScore(review) {
  if (!review) return 0
  const accepted = review.findings.filter((finding) => finding.status === 'accepted')
  const lift = accepted.reduce(
    (total, finding) => total + (SEVERITY_META[finding.severity]?.weight ?? 3) / 2,
    0,
  )
  return Math.min(100, Math.round(review.complianceScore + lift))
}
