export type Status = 'Active' | 'Pending' | 'Processing' | 'Completed' | 'Delayed' | 'Cancelled' | 'Low stock' | 'Draft'

export interface Metric {
  id: string
  label: string
  value: string
  change: number
  trend: 'up' | 'down'
  helper: string
  icon: string
}

export interface Order {
  id: string
  customer: string
  vendor: string
  total: number
  status: Status
  date: string
  items: number
}


export interface Category {
  name: string
  count: number
  icon: string
}

export interface Product {
  id: string
  name: string
  category: string
  vendor: string
  price: number
  compareAt?: number
  rating: number
  reviews: number
  stock: number
  image: string
  description: string
  featured?: boolean
  tags: string[]
}

export interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: 'order' | 'inventory' | 'shipment' | 'system' | 'message'
}

export interface ActivityItem {
  id: string
  title: string
  description: string
  time: string
  tone: 'blue' | 'green' | 'amber' | 'violet'
}

export interface TableColumn<T> {
  key: keyof T | string
  header: string
  render?: (row: T) => React.ReactNode
  className?: string
}

export interface ModuleRecord {
  id: string
  name: string
  detail: string
  owner: string
  status: Status
  amount: number
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Manager' | 'Vendor' | 'Analyst'
  tenant: string
  avatar?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface Paginated<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
