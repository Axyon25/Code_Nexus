import { delay } from './api'

export const DECISION_STATUS = {
  approve: 'approved',
  'request-changes': 'changes-requested',
  reject: 'rejected',
}

export const DECISION_LABEL = {
  approve: 'Approved',
  'request-changes': 'Changes requested',
  reject: 'Rejected',
}

/**
 * Mock approval endpoint.
 * POST /api/reviews/:id/decision  { decision, note }
 */
export async function decideReview({ decision, note }) {
  await delay(650)
  if (!DECISION_STATUS[decision]) {
    throw new Error('Unknown approval decision.')
  }
  if (decision !== 'approve' && !note?.trim()) {
    throw new Error('A note is required when requesting changes or rejecting content.')
  }
  return {
    status: DECISION_STATUS[decision],
    label: DECISION_LABEL[decision],
    note: note?.trim() ?? '',
  }
}
