import { delay, makeId } from './api'

const CODE_PREFIX = {
  'Brand Voice': 'BV',
  'Approved Facts': 'AF',
  Terminology: 'TB',
  'Marketing Claims': 'MC',
  Accessibility: 'AC',
  'Content Restrictions': 'CR',
}

export async function createGuideline(payload, ownerId) {
  await delay(500)
  const prefix = CODE_PREFIX[payload.category] ?? 'GN'
  const suffix = String(Math.floor(10 + Math.random() * 89)).padStart(3, '0')
  return {
    id: makeId('guideline'),
    code: payload.code?.trim() || `${prefix}-${suffix}`,
    title: payload.title.trim(),
    category: payload.category,
    description: payload.description.trim(),
    severity: payload.severity,
    source: payload.source.trim(),
    status: payload.status ?? 'active',
    ownerId,
    updatedAt: new Date().toISOString(),
    example: payload.example?.trim() || '',
  }
}

export async function updateGuideline(guideline, payload) {
  await delay(400)
  return {
    ...guideline,
    ...payload,
    updatedAt: new Date().toISOString(),
  }
}

export async function deleteGuideline(id) {
  await delay(350)
  return { id }
}

/**
 * Simulated document upload. The file never leaves the browser in this demo.
 * The future backend would parse the document and return extracted rules.
 */
export async function uploadGuidelineDocument(file) {
  await delay(1900)
  return {
    id: makeId('document'),
    name: file.name,
    size: file.size,
    status: 'ready',
    extractedRules: Math.max(2, Math.min(6, Math.round(file.size / 90000) || 3)),
  }
}
