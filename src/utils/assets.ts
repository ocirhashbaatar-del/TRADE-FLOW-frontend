const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1'
const databaseAssets = import.meta.env.VITE_USE_DATABASE_ASSETS === 'true'

export function assetUrl(source: string) {
  if (!databaseAssets || !source.startsWith('/images/')) return source
  const key = source.slice('/images/'.length)
  return `${apiBase}/assets/${encodeURIComponent(key)}`
}
