// Suggestions cache with sessionStorage persistence and TTL
const STORAGE_PREFIX = 'cineview:suggestions:';
const TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

function storageKey(type) {
  return `${STORAGE_PREFIX}${type || 'mixed'}`;
}

export function setSuggestions(type, items) {
  try {
    const payload = { ts: Date.now(), items };
    const raw = JSON.stringify(payload);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(storageKey(type), raw);
    }
  } catch {
    // ignore storage failures
  }
}

export function getSuggestions(type) {
  try {
    if (typeof sessionStorage === 'undefined') return null;
    const raw = sessionStorage.getItem(storageKey(type));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.ts || !parsed.items) return null;
    if (Date.now() - parsed.ts > TTL_MS) {
      sessionStorage.removeItem(storageKey(type));
      return null;
    }
    return parsed.items;
  } catch {
    return null;
  }
}

export default { setSuggestions, getSuggestions };