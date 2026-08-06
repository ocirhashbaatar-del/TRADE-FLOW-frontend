import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { LoadingState } from '@/components/common/loading-state'
import { useAuth } from '@/contexts/auth-context'
import type { UserRole } from '@/types'
import { DELIVERY_EMAIL, getRoleHome } from '@/utils/role-routing'

export function RoleGuard({ roles, children }: { roles: UserRole[]; children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <LoadingState />
  if (!user) return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />
  if (!roles.includes(user.role)) return <Navigate to={getRoleHome(user.role)} replace />
  if (roles.includes('Transporter') && user.email.trim().toLowerCase() !== DELIVERY_EMAIL) return <Navigate to="/products" replace />
  return children
}
