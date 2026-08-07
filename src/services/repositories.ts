import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type { AuthRepository, DashboardRepository, DashboardSnapshot, EnterpriseRepository, MarketplaceRepository } from './contracts'
import { delay } from '@/utils/format'
import { activities, categories, inventorySeries, metrics, moduleRecords, notifications, orders, products, salesSeries } from './mockDatabase'
import type { AuthResponse, Category, Paginated, Product, User, ModuleRecord } from '@/types'
import { safeJsonParse } from '@/utils/safe-json'

const demoUser: User = { id: 'u-1', name: 'Alex Morgan', email: 'alex@tradeflow.dev', role: 'Admin', tenant: 'TradeFlow Global' }

class MockAuthRepository implements AuthRepository {
  async login(): Promise<AuthResponse> { await delay(); localStorage.setItem('tradeflow-user', JSON.stringify(demoUser)); localStorage.setItem('tradeflow-token', 'mock-token'); return { user: demoUser, token: 'mock-token' } }
  async register(input: { name: string; email: string }): Promise<AuthResponse> { await delay(); const user = { ...demoUser, name: input.name, email: input.email, role: 'Customer' as const }; localStorage.setItem('tradeflow-user', JSON.stringify(user)); localStorage.setItem('tradeflow-token', 'mock-token'); return { user, token: 'mock-token' } }
  async googleLogin(): Promise<AuthResponse> { await delay(); localStorage.setItem('tradeflow-user', JSON.stringify(demoUser)); localStorage.setItem('tradeflow-token', 'mock-token'); return { user: demoUser, token: 'mock-token' } }
  async oauthExchange(): Promise<AuthResponse> { return this.googleLogin() }
  async currentUser(): Promise<User | null> { await delay(150); return safeJsonParse(localStorage.getItem('tradeflow-user'), demoUser) }
  async logout(): Promise<void> { await delay(150); localStorage.removeItem('tradeflow-user'); localStorage.removeItem('tradeflow-token') }
}

class ApiAuthRepository implements AuthRepository {
  private save(response: AuthResponse & { refreshToken?: string }) { localStorage.setItem('tradeflow-token', response.token); localStorage.setItem('tradeflow-user', JSON.stringify(response.user)); if (response.refreshToken) localStorage.setItem('tradeflow-refresh-token', response.refreshToken); return response }
  async login(input: { email: string; password: string }): Promise<AuthResponse> { return this.save((await apiClient.post<AuthResponse & { refreshToken?: string }>(endpoints.auth.login, input)).data) }
  async register(input: { name: string; email: string; password: string }): Promise<AuthResponse> { return this.save((await apiClient.post<AuthResponse & { refreshToken?: string }>(endpoints.auth.register, input)).data) }
  async googleLogin(credential: string): Promise<AuthResponse> { return this.save((await apiClient.post<AuthResponse & { refreshToken?: string }>(endpoints.auth.google, { credential })).data) }
  async oauthExchange(code: string): Promise<AuthResponse> { return this.save((await apiClient.post<AuthResponse & { refreshToken?: string }>(endpoints.auth.oauthExchange, { code })).data) }
  async currentUser(): Promise<User | null> { if (!localStorage.getItem('tradeflow-token')) return null; try { return (await apiClient.get<User>(endpoints.auth.me)).data } catch { localStorage.removeItem('tradeflow-token'); localStorage.removeItem('tradeflow-user'); return null } }
  async logout(): Promise<void> { const refreshToken = localStorage.getItem('tradeflow-refresh-token'); await apiClient.post('/auth/logout', { refreshToken }).catch(() => undefined); localStorage.removeItem('tradeflow-token'); localStorage.removeItem('tradeflow-refresh-token'); localStorage.removeItem('tradeflow-user') }
}

class MockDashboardRepository implements DashboardRepository {
  async getSnapshot(): Promise<DashboardSnapshot> { await delay(); return { metrics, recentOrders: orders, notifications, activities, salesSeries, inventorySeries } }
}
class ApiDashboardRepository implements DashboardRepository {
  async getSnapshot(): Promise<DashboardSnapshot> {
    const [{ data }, { data: sales }] = await Promise.all([
      apiClient.get<{ metrics: Record<string, number>; recentOrders: Array<{ id: string; orderNumber: string; total: number; status: string; createdAt: string }> }>(endpoints.dashboard),
      apiClient.get<Array<{ period: string; revenue: number; orders: number }>>('/reports/sales'),
    ])
    const labels: Record<string, string> = { todaySales: 'Өнөөдрийн борлуулалт', newOrders: 'Шинэ захиалга', lowStock: 'Бага үлдэгдэл', expiringBatches: 'Дуусах багц', openReceivables: 'Нээлттэй авлага' }
    return {
      metrics: Object.entries(data.metrics).map(([id, value]) => ({ id, label: labels[id] ?? id, value: id.includes('Sales') || id.includes('Receivables') ? `${value.toLocaleString()} ₮` : String(value), change: 0, trend: 'up', helper: 'Бодит өгөгдөл', icon: id })),
      recentOrders: data.recentOrders.map((row) => ({ id: row.orderNumber, customer: '-', vendor: '-', total: row.total, status: row.status as never, date: row.createdAt.slice(0, 10), items: 0 })),
      notifications: [], activities: [],
      salesSeries: sales.map((row) => ({ month: row.period, revenue: row.revenue, orders: row.orders })),
      inventorySeries: [],
    }
  }
}

class MockMarketplaceRepository implements MarketplaceRepository {
  async listCategories(): Promise<Category[]> { await delay(180); return categories }
  async listProducts(query = ''): Promise<Product[]> { await delay(350); const normalized = query.toLowerCase(); let custom: Product[] = []; try { custom = JSON.parse(localStorage.getItem('tradeflow-custom-products') ?? '[]') as Product[] } catch { custom = [] } return [...custom, ...products].filter((p) => !normalized || [p.name, p.category, p.vendor, ...p.tags].join(' ').toLowerCase().includes(normalized)) }
  async getProduct(id: string): Promise<Product | undefined> { await delay(250); return products.find((p) => p.id === id) }
}
class ApiMarketplaceRepository implements MarketplaceRepository {
  async listCategories(): Promise<Category[]> { return (await apiClient.get<Category[]>(endpoints.categories)).data }
  async listProducts(query = ''): Promise<Product[]> { return (await apiClient.get<Product[]>(endpoints.products, { params: { q: query } })).data }
  async getProduct(id: string, quantity = 1, channel: 'B2C' | 'B2B' = 'B2C', variantId?: string): Promise<Product | undefined> { return (await apiClient.get<Product | undefined>(`${endpoints.products}/${id}`, { params: { quantity, channel, variantId } })).data }
}

class MockEnterpriseRepository implements EnterpriseRepository {
  async list(module: string, page = 1, pageSize = 8): Promise<Paginated<ModuleRecord>> { await delay(350); const all = moduleRecords(module); const start = (page - 1) * pageSize; return { data: all.slice(start, start + pageSize), total: all.length, page, pageSize } }
}
class ApiEnterpriseRepository implements EnterpriseRepository {
  async list(module: string, page = 1, pageSize = 8): Promise<Paginated<ModuleRecord>> { return (await apiClient.get<Paginated<ModuleRecord>>(`/${module}`, { params: { page, pageSize } })).data }
}

// Mock data must be explicitly enabled. Production deployments without the
// variable should always use the authenticated API and the real signed-in user.
const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
export const repositories: { auth: AuthRepository; dashboard: DashboardRepository; marketplace: MarketplaceRepository; enterprise: EnterpriseRepository } = {
  auth: useMocks ? new MockAuthRepository() : new ApiAuthRepository(),
  dashboard: useMocks ? new MockDashboardRepository() : new ApiDashboardRepository(),
  marketplace: useMocks ? new MockMarketplaceRepository() : new ApiMarketplaceRepository(),
  enterprise: useMocks ? new MockEnterpriseRepository() : new ApiEnterpriseRepository(),
}
