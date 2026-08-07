import type { User, UserRole } from '@/types'

export const canAccessRolePortal = (user: User) => {
  return user.role !== 'Customer'
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
