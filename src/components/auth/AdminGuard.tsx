import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { LoadingState } from '@/components/common/loading-state'
import { useAuth } from '@/contexts/auth-context'
import { ADMIN_EMAIL, getRoleHome } from '@/utils/role-routing'
export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth(), location = useLocation()
  if (loading) return <LoadingState />
  if (!user) return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />
  if (user.role !== 'Admin' || user.email.trim().toLowerCase() !== ADMIN_EMAIL) return <Navigate to={getRoleHome(user.role) === '/admin/dashboard' ? '/products' : getRoleHome(user.role)} replace />
  return children
}
