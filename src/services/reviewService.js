import { delay, makeId } from './api'

/**
 * Mock AI review service.
 *
 * This is a small, transparent rules engine running in the browser. It is NOT a
 * real AI model and no content leaves the page. The shape of the returned
 * findings matches the contract expected from the future review endpoint:
 *
 * POST /api/reviews/analyse
 * { content: string, guidelineIds: string[] }
 * => { complianceScore: number, findings: Finding[] }
 */

const DATE_MONTHS =
  'January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec'

function sentenceCase(value) {
  const lower = value.trim().toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

const rules = [
  {
    id: 'clinical',
    pattern: /clinically proven[^.!?\n]*/i,
    category: 'claims',
    severity: 'critical',
    guidelineId: 'g-mc-03',
    explanation:
      'Health and wellness claims require peer-reviewed clinical evidence and Legal sign-off. Internal studies cannot be described as clinical proof.',
    correction: () => 'tested with 120 volunteers to support everyday focus',
    confidence: 0.98,
  },
  {
    id: 'guarantee',
    pattern: /\b(?:guaranteed|100%)\b[^.!?\n]*/i,
    category: 'claims',
    severity: 'critical',
    guidelineId: 'g-af-02',
    explanation:
      'Absolute outcomes and 100% figures need a named, current source. This statement has no source attached to the review.',
    correction: () => 'a result supported by our latest documented study',
    confidence: 0.95,
  },
  {
    id: 'superlative',
    pattern:
      /(?:the\s+)?(?:world['’]?s\s+|worlds\s+)?(?:best|first|fastest|biggest|leading|ultimate|number one)[^.,!?\n]*/i,
    category: 'claims',
    severity: 'high',
    guidelineId: 'g-mc-01',
    explanation:
      'Unverifiable superlatives are not permitted unless covered by a current, dated verification report. Replace the claim with a specific capability.',
    correction: () => 'a smart speaker built with 92% recycled aluminium',
    confidence: 0.93,
  },
  {
    id: 'date',
    pattern: new RegExp(`\\b(?:${DATE_MONTHS})[a-z]*\\s+20(?:0\\d|1\\d|2[0-5])\\b`, 'i'),
    category: 'outdated',
    severity: 'high',
    guidelineId: 'g-af-03',
    explanation:
      'This date is in the past. Offers, availability windows and reporting periods must match the current content calendar before publication.',
    correction: (match) => match.replace(/20\d{2}/, '2027'),
    confidence: 0.97,
  },
  {
    id: 'numeric-date',
    pattern: /\b(?:0?[1-9]|[12]\d|3[01])\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+20(?:0\d|1\d|2[0-5])\b/i,
    category: 'outdated',
    severity: 'high',
    guidelineId: 'g-af-03',
    explanation:
      'This date is in the past. Confirm the live offer window and update the reference before publication.',
    correction: (match) => match.replace(/20\d{2}/, '2027'),
    confidence: 0.97,
  },
  {
    id: 'caps',
    pattern: /\b[A-Z][A-Z0-9\s:,'’–-]{12,}\b/,
    category: 'accessibility',
    severity: 'high',
    guidelineId: 'g-ac-03',
    explanation:
      'Long all-caps runs are difficult to scan and may be read letter by letter by screen readers. Use sentence case with weight for emphasis.',
    correction: (match) => sentenceCase(match),
    confidence: 0.96,
  },
  {
    id: 'click-here',
    pattern: /\bclick here\b/i,
    category: 'accessibility',
    severity: 'medium',
    guidelineId: 'g-ac-02',
    explanation:
      'Link text must describe its destination. “Click here” is meaningless when a screen-reader user navigates by links alone.',
    correction: () => 'Open the linked help article',
    confidence: 0.92,
  },
  {
    id: 'read-more',
    pattern: /\bread more\b/i,
    category: 'accessibility',
    severity: 'medium',
    guidelineId: 'g-ac-02',
    explanation: 'Replace vague link text with the name of the content being linked to.',
    correction: () => 'Read the full article',
    confidence: 0.9,
  },
  {
    id: 'utilize',
    pattern: /(?:simply\s+)?utiliz(?:e|es|ed|ing)\b/i,
    category: 'terminology',
    severity: 'medium',
    guidelineId: 'g-tb-02',
    explanation:
      '“Utilize” is on the plain-language substitution list. The preferred verb is “use”.',
    correction: () => 'use',
    confidence: 0.98,
  },
  {
    id: 'leverage',
    pattern: /\bleverag(?:e|es|ed|ing)\b/i,
    category: 'terminology',
    severity: 'medium',
    guidelineId: 'g-tb-02',
    explanation: 'Prefer the plain verb “use” instead of corporate jargon such as “leverage”.',
    correction: () => 'use',
    confidence: 0.97,
  },
  {
    id: 'customers',
    pattern: /\b(?:our|the)\s+customers\b/i,
    category: 'terminology',
    severity: 'low',
    guidelineId: 'g-tb-03',
    explanation:
      'Northwind audiences are “members”. Reserve “customers” for commercial account contexts.',
    correction: (match) => match.replace(/customers/i, 'members'),
    confidence: 0.9,
  },
  {
    id: 'stakeholders',
    pattern: /\bstakeholders\b/i,
    category: 'terminology',
    severity: 'low',
    guidelineId: 'g-tb-04',
    explanation: 'Name the people or groups involved instead of the abstract noun “stakeholders”.',
    correction: () => 'partners and internal teams',
    confidence: 0.86,
  },
  {
    id: 'at-northwind',
    pattern: /\bAt Northwind,\s+we\b/i,
    category: 'voice',
    severity: 'low',
    guidelineId: 'g-bv-01',
    explanation:
      'The voice guide asks for first-person conviction without corporate pluralism. Lead with the belief itself.',
    correction: () => 'We',
    confidence: 0.88,
  },
  {
    id: 'carbon-neutral',
    pattern: /\bcarbon neutral\b[^.!?\n]*/i,
    category: 'claims',
    severity: 'critical',
    guidelineId: 'g-mc-04',
    explanation:
      'Environmental neutrality claims require current third-party verification and a stated boundary. The previous certification has expired.',
    correction: () => 'on a verified path to net zero across our own operations',
    confidence: 0.94,
  },
]

/**
 * Runs the demo rules engine against content and selected guidelines.
 * Findings are capped and de-overlapped so every finding maps to one snippet.
 */
export function analyseContent({ content = '', guidelines = [] }) {
  const selected = new Set(guidelines.map((guideline) => guideline.id))
  const accepted = []
  const usedRanges = []

  for (const rule of rules) {
    if (accepted.length >= 6) break
    if (!selected.has(rule.guidelineId)) continue

    const match = rule.pattern.exec(content)
    if (!match) continue

    const start = match.index
    const end = start + match[0].length
    const overlaps = usedRanges.some(([from, to]) => start < to && end > from)
    if (overlaps) continue

    const originalText = match[0].trim()
    if (originalText.length < 3) continue

    usedRanges.push([start, end])
    accepted.push({
      id: makeId('finding'),
      category: rule.category,
      severity: rule.severity,
      originalText,
      explanation: rule.explanation,
      guidelineId: rule.guidelineId,
      suggestedCorrection: rule.correction(originalText),
      status: 'pending',
      confidence: rule.confidence,
    })
  }

  const penalties = accepted.reduce((total, finding) => {
    const weight = { critical: 14, high: 10, medium: 6, low: 3 }[finding.severity] ?? 3
    return total + weight
  }, 0)

  return {
    complianceScore: Math.max(34, 100 - penalties),
    findings: accepted,
  }
}

const reviewCounter = { value: 1050 }

export async function submitReview({
  title,
  content,
  contentType,
  guidelineIds,
  guidelines,
  createdBy,
  actorName = 'You',
}) {
  await delay(1700)

  const selectedGuidelines = guidelines.filter((guideline) => guidelineIds.includes(guideline.id))
  const analysis = analyseContent({ content, guidelines: selectedGuidelines })
  reviewCounter.value += 1
  const id = `RV-${reviewCounter.value}`
  const now = new Date().toISOString()

  const review = {
    id,
    title,
    contentType,
    content,
    status: 'in-review',
    complianceScore: analysis.complianceScore,
    revision: 1,
    createdAt: now,
    updatedAt: now,
    createdBy,
    reviewer: null,
    guidelines: guidelineIds,
    findings: analysis.findings.map((finding, index) => ({
      ...finding,
      id: `f-${id}-${index + 1}`,
    })),
    comments: [],
    history: [
      {
        id: makeId('history'),
        action: 'Draft created',
        actorId: createdBy,
        note: 'Submitted from the new review workspace.',
        at: now,
      },
      {
        id: makeId('history'),
        action: 'Demo analysis completed',
        actorId: 'ai',
        note: `${analysis.findings.length} findings detected · baseline compliance ${analysis.complianceScore}.`,
        at: now,
      },
    ],
  }

  return { review, actorName }
}
