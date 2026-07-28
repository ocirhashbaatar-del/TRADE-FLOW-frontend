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
  async register(input: { name: string; email: string }): Promise<AuthResponse> { await delay(); const user = { ...demoUser, name: input.name, email: input.email }; localStorage.setItem('tradeflow-user', JSON.stringify(user)); localStorage.setItem('tradeflow-token', 'mock-token'); return { user, token: 'mock-token' } }
  async currentUser(): Promise<User | null> { await delay(150); return safeJsonParse(localStorage.getItem('tradeflow-user'), demoUser) }
  async logout(): Promise<void> { await delay(150); localStorage.removeItem('tradeflow-user'); localStorage.removeItem('tradeflow-token') }
}

class ApiAuthRepository implements AuthRepository {
  async login(input: { email: string; password: string }): Promise<AuthResponse> { return (await apiClient.post<AuthResponse>(endpoints.auth.login, input)).data }
  async register(input: { name: string; email: string; password: string }): Promise<AuthResponse> { return (await apiClient.post<AuthResponse>(endpoints.auth.register, input)).data }
  async currentUser(): Promise<User | null> { return (await apiClient.get<User | null>(endpoints.auth.me)).data }
  async logout(): Promise<void> { await apiClient.post('/auth/logout') }
}

class MockDashboardRepository implements DashboardRepository {
  async getSnapshot(): Promise<DashboardSnapshot> { await delay(); return { metrics, recentOrders: orders, notifications, activities, salesSeries, inventorySeries } }
}
class ApiDashboardRepository implements DashboardRepository { async getSnapshot(): Promise<DashboardSnapshot> { return (await apiClient.get<DashboardSnapshot>(endpoints.dashboard)).data } }

class MockMarketplaceRepository implements MarketplaceRepository {
  async listCategories(): Promise<Category[]> { await delay(180); return categories }
  async listProducts(query = ''): Promise<Product[]> { await delay(350); const normalized = query.toLowerCase(); return products.filter((p) => !normalized || [p.name, p.category, p.vendor, ...p.tags].join(' ').toLowerCase().includes(normalized)) }
  async getProduct(id: string): Promise<Product | undefined> { await delay(250); return products.find((p) => p.id === id) }
}
class ApiMarketplaceRepository implements MarketplaceRepository {
  async listCategories(): Promise<Category[]> { return (await apiClient.get<Category[]>(endpoints.categories)).data }
  async listProducts(query = ''): Promise<Product[]> { return (await apiClient.get<Product[]>(endpoints.products, { params: { q: query } })).data }
  async getProduct(id: string): Promise<Product | undefined> { return (await apiClient.get<Product | undefined>(`${endpoints.products}/${id}`)).data }
}

class MockEnterpriseRepository implements EnterpriseRepository {
  async list(module: string, page = 1, pageSize = 8): Promise<Paginated<ModuleRecord>> { await delay(350); const all = moduleRecords(module); const start = (page - 1) * pageSize; return { data: all.slice(start, start + pageSize), total: all.length, page, pageSize } }
}
class ApiEnterpriseRepository implements EnterpriseRepository {
  async list(module: string, page = 1, pageSize = 8): Promise<Paginated<ModuleRecord>> { return (await apiClient.get<Paginated<ModuleRecord>>(`/${module}`, { params: { page, pageSize } })).data }
}

const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false'
export const repositories: { auth: AuthRepository; dashboard: DashboardRepository; marketplace: MarketplaceRepository; enterprise: EnterpriseRepository } = {
  auth: useMocks ? new MockAuthRepository() : new ApiAuthRepository(),
  dashboard: useMocks ? new MockDashboardRepository() : new ApiDashboardRepository(),
  marketplace: useMocks ? new MockMarketplaceRepository() : new ApiMarketplaceRepository(),
  enterprise: useMocks ? new MockEnterpriseRepository() : new ApiEnterpriseRepository(),
}
