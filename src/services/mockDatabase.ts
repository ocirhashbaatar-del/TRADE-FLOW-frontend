import type { ActivityItem, Metric, ModuleRecord, NotificationItem, Order, Product } from '@/types'

export const metrics: Metric[] = [
  { id: 'revenue', label: 'Total revenue', value: '$2.48M', change: 12.8, trend: 'up', helper: 'vs. previous month', icon: 'DollarSign' },
  { id: 'orders', label: 'Orders', value: '8,492', change: 8.2, trend: 'up', helper: '622 awaiting action', icon: 'ShoppingCart' },
  { id: 'inventory', label: 'Inventory value', value: '$684K', change: 2.4, trend: 'down', helper: '31 low-stock items', icon: 'Boxes' },
  { id: 'warehouses', label: 'Warehouses', value: '24', change: 4.1, trend: 'up', helper: '92.6% utilization', icon: 'Warehouse' },
  { id: 'suppliers', label: 'Active suppliers', value: '186', change: 6.7, trend: 'up', helper: '14 pending approval', icon: 'Truck' },
  { id: 'fulfillment', label: 'On-time fulfillment', value: '96.8%', change: 1.3, trend: 'up', helper: 'Target: 95%', icon: 'Gauge' },
]

export const orders: Order[] = [
  { id: 'TF-10492', customer: 'Northstar Retail', vendor: 'Atlas Components', total: 18420, status: 'Processing', date: '2026-07-28', items: 16 },
  { id: 'TF-10491', customer: 'Evergreen Goods', vendor: 'Nova Industrial', total: 9270, status: 'Pending', date: '2026-07-28', items: 8 },
  { id: 'TF-10490', customer: 'Urban Thread Co.', vendor: 'Pacific Supply', total: 24100, status: 'Completed', date: '2026-07-27', items: 21 },
  { id: 'TF-10489', customer: 'Aperture Labs', vendor: 'Vertex Works', total: 7680, status: 'Delayed', date: '2026-07-27', items: 5 },
  { id: 'TF-10488', customer: 'Field & Form', vendor: 'Atlas Components', total: 12860, status: 'Completed', date: '2026-07-26', items: 12 },
  { id: 'TF-10487', customer: 'Cobalt Market', vendor: 'Nova Industrial', total: 4890, status: 'Cancelled', date: '2026-07-25', items: 3 },
]


export const categories = [
  { name: 'Industrial Automation', count: 128, icon: '⚙️' },
  { name: 'Warehouse Equipment', count: 94, icon: '🏭' },
  { name: 'IoT & Tracking', count: 156, icon: '📡' },
  { name: 'Packaging', count: 212, icon: '📦' },
  { name: 'Fleet Management', count: 86, icon: '🚚' },
  { name: 'Safety & Compliance', count: 73, icon: '🛡️' },
]

export const products: Product[] = [
  { id: 'p-1', name: 'Precision Torque Controller', category: 'Industrial Automation', vendor: 'Atlas Components', price: 1290, compareAt: 1490, rating: 4.9, reviews: 128, stock: 42, featured: true, image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80', description: 'High-accuracy programmable torque controller with production-grade telemetry and configurable safety profiles.', tags: ['B2B', 'Automation', 'Certified'] },
  { id: 'p-2', name: 'Modular Storage System', category: 'Warehouse Equipment', vendor: 'Nova Industrial', price: 780, rating: 4.7, reviews: 94, stock: 18, featured: true, image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80', description: 'Configurable warehouse storage system designed for efficient picking, labeling, and scalable inventory operations.', tags: ['Warehouse', 'Modular'] },
  { id: 'p-3', name: 'Smart Pallet Sensor Kit', category: 'IoT & Tracking', vendor: 'Vertex Works', price: 460, rating: 4.8, reviews: 76, stock: 105, image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=1200&q=80', description: 'Real-time temperature, humidity, tilt, and geolocation monitoring for high-value freight.', tags: ['IoT', 'Tracking', 'Live data'] },
  { id: 'p-4', name: 'Protective Shipping Cases', category: 'Packaging', vendor: 'Pacific Supply', price: 240, compareAt: 280, rating: 4.6, reviews: 61, stock: 230, image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=1200&q=80', description: 'Stackable, impact-resistant reusable shipping cases for sensitive industrial equipment.', tags: ['Packaging', 'Reusable'] },
  { id: 'p-5', name: 'Fleet Route Tablet', category: 'Fleet Management', vendor: 'Aperture Systems', price: 920, rating: 4.8, reviews: 109, stock: 64, featured: true, image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1200&q=80', description: 'Rugged fleet tablet with offline routing, proof-of-delivery workflows, and driver communication.', tags: ['Fleet', 'Rugged', 'GPS'] },
  { id: 'p-6', name: 'Cold Chain Data Logger', category: 'IoT & Tracking', vendor: 'Northline Tech', price: 180, rating: 4.5, reviews: 44, stock: 9, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', description: 'Compact reusable logger for audited temperature-sensitive supply chains.', tags: ['Cold chain', 'Compliance'] },
  { id: 'p-7', name: 'Dock Safety Light System', category: 'Warehouse Equipment', vendor: 'SafePort', price: 540, rating: 4.7, reviews: 52, stock: 31, image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80', description: 'High-visibility dock signaling system that improves loading coordination and safety.', tags: ['Safety', 'Dock'] },
  { id: 'p-8', name: 'Recycled Transit Packaging', category: 'Packaging', vendor: 'GreenLoop', price: 96, rating: 4.6, reviews: 83, stock: 360, image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1200&q=80', description: 'Durable recycled transit packaging for repeat B2B shipping cycles.', tags: ['Sustainable', 'Packaging'] },
]

export const notifications: NotificationItem[] = [
  { id: 'n1', title: 'Shipment delayed', description: 'Shipment SH-2098 is delayed at the northern hub.', time: '4 min ago', read: false, type: 'shipment' },
  { id: 'n2', title: 'Low inventory', description: 'Cold Chain Data Logger dropped below reorder threshold.', time: '18 min ago', read: false, type: 'inventory' },
  { id: 'n3', title: 'New purchase order', description: 'PO-4412 from Northstar Retail is ready for review.', time: '32 min ago', read: false, type: 'order' },
  { id: 'n4', title: 'Supplier approved', description: 'GreenLoop Packaging has completed verification.', time: '2 hours ago', read: true, type: 'system' },
]

export const activities: ActivityItem[] = [
  { id: 'a1', title: 'Order TF-10492 confirmed', description: 'Atlas Components accepted the purchase order.', time: '8 minutes ago', tone: 'blue' },
  { id: 'a2', title: 'Inventory transfer completed', description: '240 units moved to West Distribution Center.', time: '26 minutes ago', tone: 'green' },
  { id: 'a3', title: 'Supplier document expiring', description: 'Nova Industrial insurance expires in 14 days.', time: '1 hour ago', tone: 'amber' },
  { id: 'a4', title: 'Forecast generated', description: 'Q3 inventory demand forecast is now available.', time: '3 hours ago', tone: 'violet' },
]

const moduleNames: Record<string, string[]> = {
  inventory: ['Torque Controllers', 'Cold Chain Loggers', 'Shipping Cases', 'Pallet Sensors', 'Safety Lights'],
  warehouses: ['East Distribution Center', 'West Distribution Center', 'Central Fulfillment Hub', 'Cold Storage One', 'Returns Processing Center'],
  suppliers: ['Atlas Components', 'Nova Industrial', 'Pacific Supply', 'Vertex Works', 'GreenLoop'],
  'purchase-orders': ['PO-4412', 'PO-4411', 'PO-4410', 'PO-4409', 'PO-4408'],
  finance: ['July Receivables', 'Vendor Payout Batch', 'Freight Accruals', 'Tax Reconciliation', 'Marketplace Fees'],
  customers: ['Northstar Retail', 'Evergreen Goods', 'Urban Thread Co.', 'Aperture Labs', 'Field & Form'],
  vendors: ['Atlas Components', 'Nova Industrial', 'Pacific Supply', 'SafePort', 'Northline Tech'],
  shipping: ['SH-2098', 'SH-2097', 'SH-2096', 'SH-2095', 'SH-2094'],
  delivery: ['DL-8102', 'DL-8101', 'DL-8100', 'DL-8099', 'DL-8098'],
  returns: ['RT-3041', 'RT-3040', 'RT-3039', 'RT-3038', 'RT-3037'],
  refunds: ['RF-1419', 'RF-1418', 'RF-1417', 'RF-1416', 'RF-1415'],
  reports: ['Monthly Operations', 'Supplier Performance', 'Inventory Aging', 'Order Fulfillment', 'Marketplace Revenue'],
}

export function moduleRecords(module: string): ModuleRecord[] {
  const names = moduleNames[module] ?? ['Enterprise Record A', 'Enterprise Record B', 'Enterprise Record C', 'Enterprise Record D', 'Enterprise Record E']
  return Array.from({ length: 25 }, (_, index) => ({
    id: `${module.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(4, '0')}`,
    name: names[index % names.length],
    detail: index % 2 ? 'Primary operating record' : 'Requires scheduled review',
    owner: ['Maya Chen', 'Liam Wilson', 'Noah Kim', 'Emma Davis'][index % 4],
    status: (['Active', 'Pending', 'Processing', 'Completed', 'Delayed'] as const)[index % 5],
    amount: 2400 + index * 875,
    updatedAt: `2026-07-${String(28 - (index % 20)).padStart(2, '0')}`,
  }))
}

export const salesSeries = [
  { month: 'Feb', revenue: 182000, orders: 610 }, { month: 'Mar', revenue: 212000, orders: 720 },
  { month: 'Apr', revenue: 198000, orders: 680 }, { month: 'May', revenue: 246000, orders: 810 },
  { month: 'Jun', revenue: 271000, orders: 890 }, { month: 'Jul', revenue: 318000, orders: 1040 },
]

export const inventorySeries = [
  { name: 'Healthy', value: 68 }, { name: 'Low stock', value: 18 }, { name: 'Overstock', value: 9 }, { name: 'Unavailable', value: 5 },
]
