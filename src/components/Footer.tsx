import { Camera, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppLogo } from '@/components/common/app-logo'
import { useAuth } from '@/contexts/auth-context'

const groups = [
  { title: 'Дэлгүүр', links: [['Бүх бүтээгдэхүүн', '/products'], ['Онцлох ангилал', '/products'], ['Миний сагс', '/cart'], ['Захиалгууд', '/orders']] },
  { title: 'FreshFlow', links: [['Бидний тухай', '/#about'], ['Нэвтрэх', '/auth/login'], ['Хяналтын самбар', '/admin/dashboard'], ['Тусламж', '/#support']] },
] as const

export function Footer() {
  const { user } = useAuth()
  return (
    <footer className="overflow-hidden rounded-t-[40px] bg-[#04110d] text-white">
      <div className="mx-auto grid max-w-[1380px] gap-12 px-5 py-16 sm:px-7 lg:grid-cols-[1.4fr_.7fr_.7fr_1fr] lg:px-8">
        <div className="max-w-sm">
          <AppLogo light />
          <p className="mt-6 text-sm leading-7 text-white/50">Шинэхэн хүнс, ногоо, ус ундааг баталгаатай нийлүүлэгчдээс бизнесийн хэрэгцээндээ хурдан, найдвартай захиалаарай.</p>
          <div className="mt-6 flex gap-3"><a href="#facebook" aria-label="Facebook" className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[.06] transition hover:bg-emerald-400 hover:text-emerald-950"><MessageCircle className="size-4" /></a><a href="#instagram" aria-label="Instagram" className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[.06] transition hover:bg-emerald-400 hover:text-emerald-950"><Camera className="size-4" /></a></div>
        </div>
        {groups.map((group) => <div key={group.title}><h3 className="text-sm font-bold uppercase tracking-[.16em] text-emerald-300">{group.title}</h3><div className="mt-5 space-y-3">{group.links.filter(([, href]) => !(user && href === '/auth/login')).map(([label, href]) => <Link key={label} to={href} className="block text-sm text-white/50 transition hover:translate-x-1 hover:text-white">{label}</Link>)}</div></div>)}
        <div><h3 className="text-sm font-bold uppercase tracking-[.16em] text-emerald-300">Холбоо барих</h3><div className="mt-5 space-y-4 text-sm text-white/50"><a href="tel:+97670001234" className="flex gap-3 hover:text-white"><Phone className="mt-0.5 size-4 shrink-0 text-emerald-400" />+976 7000-1234</a><a href="mailto:hello@freshflow.mn" className="flex gap-3 hover:text-white"><Mail className="mt-0.5 size-4 shrink-0 text-emerald-400" />hello@freshflow.mn</a><p className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-emerald-400" />Сүхбаатар дүүрэг, Улаанбаатар</p></div></div>
      </div>
      <div className="border-t border-white/10"><div className="mx-auto flex max-w-[1380px] flex-col gap-3 px-5 py-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-8"><span>© 2026 FreshFlow. Бүх эрх хуулиар хамгаалагдсан.</span><div className="flex gap-5"><a href="#privacy" className="hover:text-white">Нууцлал</a><a href="#terms" className="hover:text-white">Үйлчилгээний нөхцөл</a></div></div></div>
    </footer>
  )
}
