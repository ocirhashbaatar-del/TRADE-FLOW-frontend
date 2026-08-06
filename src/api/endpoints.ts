export const endpoints = {
  auth: { login: '/auth/login', register: '/auth/register', google: '/auth/oauth/google', oauthExchange: '/auth/oauth/exchange', me: '/auth/me' },
  dashboard: '/reports/dashboard',
  products: '/products',
  categories: '/categories',
  orders: '/orders',
  inventory: '/inventory',
  notifications: '/notifications',
} as const
