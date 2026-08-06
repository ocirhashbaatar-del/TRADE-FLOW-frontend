import { BarChart3, Boxes, Calculator, ClipboardList, Package, Truck } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { usePageTitle } from '@/hooks/use-page-title'
import type { UserRole } from '@/types'

const portals: Partial<Record<UserRole, { title: string; description: string; links: Array<{ label: string; href: string; icon: typeof Package }> }>> = {
  Manager: { title: 'Ажилтны хэсэг', description: 'Захиалга, бараа материал болон өдөр тутмын ажиллагаа.', links: [{ label: 'Захиалга', href: '/orders', icon: ClipboardList }, { label: 'Бараа материал', href: '/products', icon: Boxes }] },
  Employee: { title: 'Ажилтны хэсэг', description: 'Захиалга, бараа материал болон өдөр тутмын ажиллагаа.', links: [{ label: 'Захиалга', href: '/orders', icon: ClipboardList }, { label: 'Бараа материал', href: '/products', icon: Boxes }] },
  Vendor: { title: 'Нийлүүлэгчийн хэсэг', description: 'Нийлүүлэх бараа болон худалдан авалтын захиалга.', links: [{ label: 'Бараа', href: '/products', icon: Package }, { label: 'Захиалга', href: '/orders', icon: ClipboardList }] },
  Transporter: { title: 'Тээвэрлэгчийн хэсэг', description: 'Хүргэлт болон тээвэрлэлтийн ажлын хяналт.', links: [{ label: 'Тээвэр, хүргэлт', href: '/orders', icon: Truck }, { label: 'Профайл', href: '/profile', icon: ClipboardList }] },
  Accountant: { title: 'Нягтлангийн хэсэг', description: 'Санхүү, төлбөр тооцоо болон тайлан.', links: [{ label: 'Санхүү ба авлага', href: '/orders', icon: Calculator }, { label: 'Профайл', href: '/profile', icon: BarChart3 }] },
}

export default function RolePortal() {
  const { user } = useAuth()
  const portal = user ? portals[user.role] : undefined
  usePageTitle(`${portal?.title ?? 'Ажлын хэсэг'} — TradeFlow`)
  if (!portal) return <Navigate to="/products" replace />
  return <div className="mx-auto min-h-[70vh] max-w-5xl px-4 py-14 sm:px-6"><div className="rounded-[32px] bg-emerald-950 p-8 text-white sm:p-12"><div className="text-sm font-bold uppercase tracking-[.18em] text-emerald-300">{user?.role}</div><h1 className="mt-4 text-4xl font-semibold">{portal.title}</h1><p className="mt-4 text-emerald-50/70">{portal.description}</p></div><div className="mt-8 grid gap-5 sm:grid-cols-2">{portal.links.map(({ label, href, icon: Icon }) => <Link key={href} to={href} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 dark:border-white/10 dark:bg-white/5"><Icon className="size-7 text-emerald-600" /><div className="mt-5 text-xl font-bold">{label}</div><div className="mt-2 text-sm text-slate-500">Нээх →</div></Link>)}</div></div>
}
