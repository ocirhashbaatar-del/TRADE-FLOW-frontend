import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Building2, ChevronDown, Crown, LogOut, Mail, MapPin, Menu, Moon, Phone, Settings, ShoppingCart, Sun, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AppLogo } from '@/components/common/app-logo'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SearchBar } from '@/components/SearchBar'
import { useTheme } from '@/contexts/theme-context'
import { cn } from '@/utils/cn'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/contexts/auth-context'
import { canAccessRolePortal, getRoleHome, roleButtonLabel } from '@/utils/role-routing'

const links = [
  ['Home Page', '/products'],
  ['Захиалга', '/orders'],
] as const

export function Header() {
  const { itemCount, openCart } = useCart()
  const { resolvedTheme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 120)
    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    return () => window.removeEventListener('scroll', updateHeader)
  }, [pathname])

  return (
    <header
      className={cn(
        'z-40 w-full border-b border-amber-100 bg-white/90 text-slate-900 shadow-lg shadow-amber-950/5 backdrop-blur-2xl transition duration-500 [&_button]:text-slate-700 dark:border-emerald-300/10 dark:bg-[#04110d]/90 dark:text-white dark:shadow-black/5 dark:[&_button]:text-white',
        isHome
          ? `fixed left-0 top-0 ${scrolled ? 'translate-y-0 opacity-100 shadow-soft' : '-translate-y-full opacity-0 pointer-events-none'}`
          : 'sticky top-0',
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1380px] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link to={user ? '/products' : '/'} aria-label="FreshFlow Нүүр">
          <AppLogo light={resolvedTheme === 'dark'} />
        </Link>

        <nav aria-label="Үндсэн навигац" className="hidden items-center gap-1 lg:flex">
          {links.map(([label, href]) => (
            <NavLink
              key={href}
              to={href}
              end
              className={({ isActive }) =>
                cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  isActive
                    ? 'bg-amber-100 text-amber-900 dark:bg-emerald-400 dark:text-emerald-950'
                    : 'text-slate-500 hover:bg-amber-50 hover:text-slate-950 dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden md:block">
          <SearchBar />
        </div>

        <div className="flex items-center gap-1">
          {user && canAccessRolePortal(user) && roleButtonLabel[user.role] && <Button onClick={() => navigate(getRoleHome(user.role))} variant="secondary" className="hidden rounded-full border border-amber-200 bg-amber-50 px-4 text-sm font-semibold text-amber-900 hover:bg-amber-100 sm:flex dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
            <Crown className="size-4" />{roleButtonLabel[user.role]}
          </Button>}
          <Button onClick={openCart} variant="ghost" size="icon" className="relative rounded-full hover:bg-amber-50 dark:hover:bg-white/10" aria-label={`Сагс, ${itemCount} бүтээгдэхүүн`}>
            <ShoppingCart className="size-5" />{itemCount > 0 && <span className="absolute right-0.5 top-0.5 grid size-4 place-items-center rounded-full bg-amber-500 text-[10px] font-bold text-white dark:bg-emerald-500">{itemCount > 9 ? '9+' : itemCount}</span>}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-amber-50 dark:hover:bg-white/10"
            onClick={toggleTheme}
            aria-label={resolvedTheme === 'dark' ? 'Гэрэлт горим' : 'Харанхуй горим'}
          >
            {resolvedTheme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
          <DropdownMenu open={profileOpen} onOpenChange={(open) => { setProfileOpen(open); if (!open) setContactOpen(false) }}>
            <DropdownMenuTrigger asChild>
              {user ? (
                <button type="button" className={cn('flex max-w-[230px] items-center gap-2 rounded-full py-1 pl-1 pr-2 text-left transition hover:bg-amber-50 dark:hover:bg-white/10', profileOpen && 'bg-amber-100 dark:bg-white/10')} aria-label="Профайл цэс">
                  {user.avatar ? <img src={user.avatar} alt={user.name} className="size-10 shrink-0 rounded-full object-cover ring-2 ring-emerald-500/25" /> : <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 font-bold text-white ring-2 ring-emerald-500/20">{user.name.charAt(0).toUpperCase()}</span>}
                  <span className="hidden min-w-0 sm:block">
                    <span className="block truncate text-sm font-bold leading-5 text-slate-900 dark:text-white">{user.name}</span>
                    <span className="block truncate text-xs leading-4 text-slate-400 dark:text-white/45">{user.tenant}</span>
                  </span>
                  <ChevronDown className={cn('hidden size-4 shrink-0 text-slate-400 transition sm:block', profileOpen && 'rotate-180')} />
                </button>
              ) : <Button variant="ghost" size="icon" className={cn('rounded-full transition hover:bg-amber-50 dark:hover:bg-white/10', profileOpen && 'bg-amber-100 text-amber-900 dark:bg-white/10')} aria-label="Профайл"><User className="size-5" /></Button>}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[min(340px,calc(100vw-24px))] overflow-hidden rounded-3xl border-emerald-950/10 p-0 shadow-[0_22px_65px_-18px_rgba(6,78,59,.35)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2 dark:border-white/10 dark:bg-[#0b1915]">
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 to-emerald-800 p-5 text-white"><div className="absolute -right-7 -top-9 size-28 rounded-full bg-emerald-300/15" /><div className="relative flex items-center gap-3">{user?.avatar ? <img src={user.avatar} alt={user.name} className="size-12 shrink-0 rounded-full object-cover ring-4 ring-white/10" /> : <div className="grid size-12 shrink-0 place-items-center rounded-full bg-emerald-300 text-lg font-bold text-emerald-950 ring-4 ring-white/10">{(user?.name ?? 'U').charAt(0)}</div>}<div className="min-w-0"><div className="truncate font-bold">{user?.name ?? 'Зочин хэрэглэгч'}</div><div className="mt-0.5 truncate text-xs text-white/55">{user?.email ?? 'Та нэвтрээгүй байна'}</div></div></div></div>
              <div className="p-2">
                <div className="mb-1 flex items-center gap-3 rounded-2xl bg-emerald-50 px-3 py-3 dark:bg-white/5"><Building2 className="size-5 text-emerald-600" /><div className="min-w-0"><div className="text-[10px] uppercase tracking-wider text-slate-400">Байгууллага</div><div className="truncate text-sm font-semibold">{user?.tenant ?? 'TradeFlow'}</div></div></div>
                <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition hover:bg-emerald-50 dark:hover:bg-white/5"><Settings className="size-4 text-emerald-600" />Профайл тохиргоо</Link>
                <button type="button" onClick={(event) => { event.preventDefault(); setContactOpen((open) => !open) }} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition hover:bg-emerald-50 dark:hover:bg-white/5"><Phone className="size-4 text-emerald-600" />Холбоо барих<ChevronDown className={cn('ml-auto size-4 text-slate-400 transition', contactOpen && 'rotate-180')} /></button>
                {contactOpen && <div className="mx-2 mb-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs dark:border-emerald-400/15 dark:bg-emerald-400/[.07]"><a href="tel:+97670001234" className="flex items-center gap-2 text-slate-600 hover:text-emerald-700 dark:text-slate-300"><Phone className="size-3.5 text-emerald-600" />+976 7000-1234</a><a href="mailto:hello@freshflow.mn" className="mt-2 flex items-center gap-2 text-slate-600 hover:text-emerald-700 dark:text-slate-300"><Mail className="size-3.5 text-emerald-600" />hello@freshflow.mn</a><div className="mt-2 flex items-start gap-2 text-slate-600 dark:text-slate-300"><MapPin className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />Сүхбаатар дүүрэг, Улаанбаатар</div></div>}
                <div className="my-1 h-px bg-slate-100 dark:bg-white/10" />
                {user ? <button type="button" onClick={() => { void logout(); setProfileOpen(false) }} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"><LogOut className="size-4" />Гарах</button> : <Link to="/auth/login" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-white/5"><User className="size-4" />Нэвтрэх</Link>}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Цэс нээх">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent title="Навигац" side="right">
              <nav aria-label="Мобайл навигац" className="mt-8 space-y-2">
                {links.map(([label, href]) => (
                  <NavLink
                    key={href}
                    to={href}
                    end
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'block rounded-xl px-4 py-3 text-sm font-medium',
                        isActive
                          ? 'bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100'
                          : 'hover:bg-stone-50 dark:hover:bg-stone-800',
                      )
                    }
                  >
                    {label}
                  </NavLink>
                ))}
                {user && canAccessRolePortal(user) && roleButtonLabel[user.role] && <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-900/50">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">{roleButtonLabel[user.role]}</div>
                  <div className="mt-3 space-y-2">
                    <Link to={getRoleHome(user.role)} onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800">
                      Хянах самбар
                    </Link>
                    <Link to="/admin/products" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800">
                      Бараа
                    </Link>
                    <Link to="/admin/orders" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800">
                      Захиалга
                    </Link>
                  </div>
                </div>}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

