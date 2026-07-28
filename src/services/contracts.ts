import type { ActivityItem, AuthResponse, Category, Metric, ModuleRecord, NotificationItem, Order, Paginated, Product, User } from '@/types'

export interface DashboardSnapshot {
  metrics: Metric[]
  recentOrders: Order[]
  notifications: NotificationItem[]
  activities: ActivityItem[]
  salesSeries: { month: string; revenue: number; orders: number }[]
  inventorySeries: { name: string; value: number }[]
}

export interface AuthRepository {
  login(input: { email: string; password: string }): Promise<AuthResponse>
  register(input: { name: string; email: string; password: string }): Promise<AuthResponse>
  currentUser(): Promise<User | null>
  logout(): Promise<void>
}

export interface DashboardRepository { getSnapshot(): Promise<DashboardSnapshot> }
export interface MarketplaceRepository {
  listCategories(): Promise<Category[]>
  listProducts(query?: string): Promise<Product[]>
  getProduct(id: string): Promise<Product | undefined>
}
export interface EnterpriseRepository {
  list(module: string, page?: number, pageSize?: number): Promise<Paginated<ModuleRecord>>
}
