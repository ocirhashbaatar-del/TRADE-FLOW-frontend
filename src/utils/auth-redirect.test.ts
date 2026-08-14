import { describe, expect, it } from 'vitest'
import { resolveAuthRedirect } from './auth-redirect'

describe('resolveAuthRedirect', () => {
  it('preserves a safe internal return path', () => {
    expect(resolveAuthRedirect('/checkout')).toBe('/checkout')
    expect(resolveAuthRedirect('/checkout', '/products')).toBe('/checkout')
  })

  it('falls back to the default destination for invalid values', () => {
    expect(resolveAuthRedirect('/')).toBe('/products')
    expect(resolveAuthRedirect('https://example.com')).toBe('/products')
    expect(resolveAuthRedirect(null)).toBe('/products')
  })
})
