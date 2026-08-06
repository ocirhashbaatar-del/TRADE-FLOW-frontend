import { BarChart3, Boxes, CircleDollarSign, LayoutDashboard, Package, Settings, Shield, ShoppingBag, Truck, Users } from 'lucide-react'

export const navigation = [
  { label: 'Үндсэн', items: [{ title: 'Хяналтын самбар', href: '/admin/dashboard', icon: LayoutDashboard }] },
  { label: 'Каталог ба худалдаа', items: [
    { title: 'Каталог, ангилал, хувилбар', href: '/admin/catalog', icon: Boxes },
    { title: 'Бараа', href: '/admin/products', icon: Package },
    { title: 'Захиалга', href: '/admin/orders', icon: ShoppingBag },
    { title: 'Manual / B2B захиалга', href: '/admin/manual-order', icon: ShoppingBag },
    { title: 'Үнэ ба урамшуулал', href: '/admin/operations/pricing', icon: CircleDollarSign },
  ] },
  { label: 'SCM модулиуд', items: [
    { title: 'Агуулах ба нөөц', href: '/admin/operations/inventory', icon: Boxes },
    { title: 'Нийлүүлэгч ба PO', href: '/admin/operations/procurement', icon: Truck },
    { title: 'Picking / Packing', href: '/admin/fulfillment', icon: Package },
    { title: 'Буцаалтын хүсэлт', href: '/admin/returns', icon: Truck },
    { title: 'OTP / QPay / E-barimt', href: '/admin/payments', icon: CircleDollarSign },
    { title: 'Санхүү ба авлага', href: '/admin/operations/invoices', icon: CircleDollarSign },
    { title: 'Бодит тайлан', href: '/admin/operations/reports', icon: BarChart3 },
  ] },
  { label: 'Удирдлага', items: [
    { title: 'Ажилтан ба урилга', href: '/admin/users', icon: Users },
    { title: 'RBAC эрх', href: '/admin/roles', icon: Shield },
    { title: 'Tenant branding / Super Admin', href: '/admin/platform', icon: Settings },
    { title: 'Тохиргоо', href: '/admin/settings', icon: Settings },
  ] },
]
