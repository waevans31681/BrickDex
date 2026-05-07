// All calls go to our Express proxy — the API key never touches the client (ADR-001)

const BASE = '/api/rebrickable'

async function apiFetch(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

// Look up a single set by set number (e.g. "75192" or "75192-1")
export async function fetchSetByNumber(setNumber) {
  return apiFetch(`/sets/${encodeURIComponent(setNumber)}`)
}

// Search sets by name — returns array of matching set objects
export async function searchSets(query) {
  return apiFetch(`/sets/search?q=${encodeURIComponent(query)}`)
}
