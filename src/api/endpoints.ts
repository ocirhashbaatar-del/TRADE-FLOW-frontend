export const endpoints = {
  auth: { login: '/auth/login', register: '/auth/register', me: '/auth/me' },
  dashboard: '/dashboard',
  products: '/products',
  categories: '/categories',
  orders: '/orders',
  inventory: '/inventory',
  notifications: '/notifications',
} as const
