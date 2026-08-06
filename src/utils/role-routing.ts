import type { User, UserRole } from '@/types'

export const ADMIN_EMAIL = 'ocirhashbaatar@gmail.com'
export const DELIVERY_EMAIL = 'gardi@gmail.com'

export const canAccessRolePortal = (user: User) => {
  const email = user.email.trim().toLowerCase()
  if (user.role === 'Admin') return email === ADMIN_EMAIL
  if (user.role === 'Transporter') return email === DELIVERY_EMAIL
  return true
}

export const roleHome: Record<UserRole, string> = {
  Admin: '/admin/dashboard',
  Manager: '/employee',
  Employee: '/employee',
  Vendor: '/supplier',
  Transporter: '/transport',
  Accountant: '/accounting',
  Customer: '/products',
}

export const roleButtonLabel: Partial<Record<UserRole, string>> = {
  Admin: 'Админ',
  Manager: 'Ажилтан',
  Employee: 'Ажилтан',
  Vendor: 'Нийлүүлэгч',
  Transporter: 'Тээвэр',
  Accountant: 'Нягтлан',
}

export const getRoleHome = (role: UserRole) => roleHome[role] ?? '/products'
