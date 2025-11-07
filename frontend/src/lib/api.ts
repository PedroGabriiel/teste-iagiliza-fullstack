// Lightweight fetch-based API helper to avoid adding axios dependency.
const BASE = 'http://localhost:3333'

async function request(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = { ...(opts.headers as Record<string, string> || {}) }
  if (token) headers.authorization = `Bearer ${token}`
  if (opts.body && !(opts.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json'
  }
  const res = await fetch(BASE + path, { ...opts, headers })
  const text = await res.text()
  try {
    const json = text ? JSON.parse(text) : null
    if (!res.ok) throw new Error(json?.message || res.statusText)
    return json
  } catch (err) {
    // if response isn't JSON, throw generic error or return text
    if (!res.ok) throw new Error(text || res.statusText)
    return text
  }
}

export default { request }
