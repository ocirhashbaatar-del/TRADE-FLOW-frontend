/** Parses browser storage without allowing malformed persisted values to crash the UI. */
export function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback

  try {
    return JSON.parse(value) as T
  } catch (error) {
    console.warn('Ignoring malformed persisted TradeFlow data.', error)
    return fallback
  }
}
