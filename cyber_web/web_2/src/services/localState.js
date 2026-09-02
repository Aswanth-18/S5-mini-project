const PREFIX = 'cybernex.'

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export const localState = {
  get(key, fallback = null) {
    if (!canUseStorage()) return fallback
    try {
      const raw = window.localStorage.getItem(PREFIX + key)
      if (raw == null) return fallback
      return JSON.parse(raw)
    } catch {
      return fallback
    }
  },
  set(key, value) {
    if (!canUseStorage()) return
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {
      /* preview persistence only — never store secrets here */
    }
  },
  remove(key) {
    if (!canUseStorage()) return
    try {
      window.localStorage.removeItem(PREFIX + key)
    } catch {
      /* ignore */
    }
  },
}

export function wait(ms = 240) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}
