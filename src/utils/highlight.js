/**
 * Splits submitted content into plain and highlighted segments based on the
 * review findings. Only the first occurrence of each finding is highlighted.
 * Accepted findings can optionally be rendered with their suggested correction.
 */
export function buildSegments(content = '', findings = [], { corrected = false } = {}) {
  const candidates = findings
    .filter((finding) => finding.originalText && finding.status !== 'rejected')
    .map((finding) => ({ finding, index: content.indexOf(finding.originalText) }))
    .filter((entry) => entry.index >= 0)
    .sort((a, b) => a.index - b.index)

  const segments = []
  let cursor = 0

  for (const { finding, index } of candidates) {
    if (index < cursor) continue // skip overlapping findings
    if (index > cursor) {
      segments.push({ type: 'text', text: content.slice(cursor, index) })
    }
    segments.push({
      type: finding.status === 'accepted' ? 'accepted' : 'finding',
      text:
        corrected && finding.status === 'accepted'
          ? finding.suggestedCorrection
          : content.slice(index, index + finding.originalText.length),
      finding,
    })
    cursor = index + finding.originalText.length
  }

  if (cursor < content.length) {
    segments.push({ type: 'text', text: content.slice(cursor) })
  }

  return segments
}

export function findOpenFinding(id, findings) {
  return findings.find((finding) => finding.id === id) ?? findings[0] ?? null
}
