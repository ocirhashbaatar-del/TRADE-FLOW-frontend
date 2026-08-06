import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'

export function GuestLanding({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/products" replace /> : children
}
