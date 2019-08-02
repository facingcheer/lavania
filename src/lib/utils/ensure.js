export function ensureDefined(value) {
  if (value === undefined) {
      throw new Error('Value is undefined')
  }
  return value
}

export function ensureNotNull(value) {
  if (value === null) {
      throw new Error('Value is null')
  }
  return value
}

export function ensure(value) {
  return ensureNotNull(ensureDefined(value))
}
