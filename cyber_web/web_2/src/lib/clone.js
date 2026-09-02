export function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export function id(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 8)}`
}
