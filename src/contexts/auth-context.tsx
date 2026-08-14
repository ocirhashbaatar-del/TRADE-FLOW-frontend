import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { repositories } from '@/services/repositories'
import type { User } from '@/types'

interface AuthContextValue { user: User | null; loading: boolean; login: (input: { email: string; password: string }) => Promise<void>; register: (input: { name: string; email: string; password: string }) => Promise<void>; googleLogin: (credential: string) => Promise<void>; oauthExchange: (code: string) => Promise<void>; logout: () => Promise<void> }
const AuthContext = createContext<AuthContextValue | null>(null)
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { repositories.auth.currentUser().then(setUser).finally(() => setLoading(false)) }, [])
  useEffect(() => {
    const refreshSession = () => { void repositories.auth.currentUser().then(setUser) }
    window.addEventListener('tradeflow-auth-changed', refreshSession)
    return () => window.removeEventListener('tradeflow-auth-changed', refreshSession)
  }, [])
  const value = useMemo(() => ({ user, loading, login: async (input: { email: string; password: string }) => setUser((await repositories.auth.login(input)).user), register: async (input: { name: string; email: string; password: string }) => setUser((await repositories.auth.register(input)).user), googleLogin: async (credential: string) => setUser((await repositories.auth.googleLogin(credential)).user), oauthExchange: async (code: string) => setUser((await repositories.auth.oauthExchange(code)).user), logout: async () => { await repositories.auth.logout(); localStorage.removeItem('tradeflow-cart-guest'); localStorage.removeItem('tradeflow-saved-guest-v2'); localStorage.removeItem('tradeflow-user'); localStorage.removeItem('tradeflow-token'); localStorage.removeItem('tradeflow-refresh-token'); setUser(null); window.dispatchEvent(new Event('tradeflow-auth-changed')) } }), [user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used within AuthProvider'); return value }
