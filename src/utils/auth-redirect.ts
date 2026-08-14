export function resolveAuthRedirect(from: unknown, fallback = '/products') {
  if (typeof from === 'string' && from.startsWith('/') && from !== '/') {
    return from
  }
  return fallback
}
