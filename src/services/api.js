/**
 * Thin integration layer for the future backend.
 *
 * The demo runs entirely on local mock services. When VITE_API_BASE_URL is set,
 * `apiRequest` is ready to talk to the Express/LLM service without changing any
 * page component. No request is made while the variable is unset.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
export const USE_MOCK_API = !API_BASE_URL

export function delay(ms = 600) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function apiRequest(path, { method = 'GET', body, headers, ...rest } = {}) {
  if (!API_BASE_URL) {
    throw new Error(
      'The API is not configured. Set VITE_API_BASE_URL to connect the Truth Nuke backend.',
    )
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  })

  if (!response.ok) {
    const message = await response.text().catch(() => '')
    throw new Error(message || `Request failed with status ${response.status}`)
  }

  return response.status === 204 ? null : response.json()
}

let idCounter = 0

export function makeId(prefix) {
  idCounter += 1
  return `${prefix}-${Date.now().toString(36)}${idCounter.toString(36)}`
}
