import { BarChart3, Bell, Boxes, Building2, CircleDollarSign, ClipboardList, CreditCard, FileBarChart, Gauge, LayoutDashboard, PackageCheck, RotateCcw, Settings, ShoppingBag, Store, Truck, Undo2, Users, Warehouse } from 'lucide-react'

export const navigation = [
  { label: 'Ерөнхий', items: [{ title: 'Хянах самбар', href: '/dashboard', icon: LayoutDashboard }] },
  { label: 'Үйл ажиллагаа', items: [
    { title: 'Бараа материал', href: '/inventory', icon: Boxes }, { title: 'Агуулах', href: '/warehouses', icon: Warehouse },
    { title: 'Нийлүүлэгчид', href: '/suppliers', icon: Building2 }, { title: 'Худалдан авах захиалга', href: '/purchase-orders', icon: ClipboardList },
    { title: 'Тээвэрлэлт', href: '/shipping', icon: Truck }, { title: 'Хүргэлт', href: '/delivery', icon: PackageCheck },
    { title: 'Буцаалт', href: '/returns', icon: RotateCcw }, { title: 'Буцаан олголт', href: '/refunds', icon: Undo2 },
  ]},
  { label: 'Худалдаа', items: [
    { title: 'Зах зээл', href: '/marketplace', icon: Store }, { title: 'Харилцагчид', href: '/customers', icon: Users },
    { title: 'Борлуулагчид', href: '/vendors', icon: ShoppingBag }, { title: 'Санхүү', href: '/finance', icon: CircleDollarSign },
  ]},
  { label: 'Шинжилгээ', items: [
    { title: 'Аналитик', href: '/analytics', icon: BarChart3 }, { title: 'Тайлан', href: '/reports', icon: FileBarChart },
    { title: 'Мэдэгдэл', href: '/notifications', icon: Bell },
  ]},
  { label: 'Систем', items: [{ title: 'Дизайны систем', href: '/design-system', icon: Gauge }, { title: 'Тохиргоо', href: '/settings', icon: Settings }, { title: 'Төлбөр тооцоо', href: '/billing', icon: CreditCard }] },
]
