import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, BarChart3, ChevronDown, Handshake, LayoutDashboard, LogOut, Menu, Moon, Search, Shield, Sun, Users } from 'lucide-react'
import { navigation } from '@/app/navigation'
import { AppLogo } from '@/components/common/app-logo'
import { Breadcrumbs } from '@/components/common/breadcrumbs'
import { NotificationCenter } from '@/components/common/notification-center'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/contexts/auth-context'
import { useTheme } from '@/contexts/theme-context'
import { cn } from '@/utils/cn'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

type Permission = { module: string; canRead: boolean }
const navigationModule = (href: string) => href.includes('pricing') ? 'pricing' : href.includes('inventory') ? 'inventory' : href.includes('procurement') ? 'procurement' : href.includes('fulfillment') || href.includes('returns') ? 'fulfillment' : href.includes('payments') || href.includes('invoices') ? 'finance' : href.includes('reports') ? 'reports' : href.includes('users') || href.includes('roles') ? 'users' : href.includes('settings') || href.includes('platform') ? 'settings' : href.includes('order') ? 'orders' : href.includes('catalog') || href.includes('products') ? 'catalog' : 'dashboard'

function SidebarContent() {
  const { user } = useAuth()
  const { data: permissions = [] } = useQuery({ queryKey: ['my-permissions', user?.id], queryFn: async () => (await apiClient.get<Permission[]>('/admin/my-permissions')).data, enabled: Boolean(user) })
  const canRead = (href: string) => user?.role === 'Admin' || permissions.some((permission) => permission.module === navigationModule(href) && permission.canRead)
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-100 px-4 py-4 dark:border-slate-800">
        <Link to="/" className="mb-4 flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-emerald-100 hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-300" aria-label="Marketplace руу буцах"><ArrowLeft className="size-4" />Back</Link>
        <Link to="/admin/dashboard" aria-label="Admin dashboard"><AppLogo /></Link>
      </div>
      <nav aria-label="Primary navigation" className="scrollbar-thin flex-1 overflow-y-auto px-3 pb-5">
        {navigation.map((section) => (
          <div key={section.label} className="mb-5">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">
              {section.label}
            </div>
            <div className="space-y-1">
              {section.items.filter((item) => canRead(item.href)).map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-100 dark:bg-brand-950/40 dark:text-brand-300 dark:ring-brand-900'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
                    )
                  }
                >
                  <item.icon className="size-[18px]" aria-hidden="true" />
                  <span>{item.title}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <div className="rounded-xl bg-gradient-to-br from-brand-600 to-indigo-700 p-4 text-white">
          <div className="text-xs font-bold uppercase tracking-[.14em] text-blue-100">Workspace</div>
          <div className="mt-2 text-sm font-semibold">TradeFlow Global</div>
          <div className="mt-1 text-xs text-blue-100">Enterprise plan · 86 users</div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-[68%] rounded-full bg-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

function CommandSearch() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="hidden h-10 w-full max-w-sm items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 text-left text-sm text-slate-400 shadow-sm transition hover:border-slate-300 lg:flex dark:border-slate-700 dark:bg-slate-900">
          <Search className="size-4" aria-hidden="true" />
          <span className="flex-1">Search orders, products, suppliers...</span>
          <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold dark:border-slate-700 dark:bg-slate-800">
            ⌘ K
          </kbd>
        </button>
      </DialogTrigger>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open global search">
          <Search className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent title="Global search" className="p-0">
        <div className="border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <Input autoFocus className="border-0 pl-10 shadow-none" placeholder="Search TradeFlow..." aria-label="Search TradeFlow" />
          </div>
        </div>
        <div className="p-2">
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Quick navigation</div>
          {navigation
            .flatMap((section) => section.items)
            .slice(0, 8)
            .map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <item.icon className="size-4 text-slate-400" aria-hidden="true" />
                {item.title}
              </Link>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function AppLayout() {
  const { toggleTheme, resolvedTheme } = useTheme()
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-stone-950">
      <a href="#main-content" className="skip-link">Үндсэн хэсэг рүү очих</a>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-stone-200 bg-white/95 backdrop-blur xl:block dark:border-stone-800 dark:bg-stone-900/95">
        <SidebarContent />
      </aside>
      <div className="xl:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-stone-200/80 bg-white/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8 dark:border-stone-800 dark:bg-stone-950/80">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 xl:hidden" aria-label="Навигацийн цэс нээх">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0" title="Навигац">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <CommandSearch />
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={resolvedTheme === 'dark' ? 'Гэрэлт горим' : 'Харанхуй горим'}
            >
              {resolvedTheme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
            <NotificationCenter />
            <div className="mx-1 hidden h-7 w-px bg-stone-200 sm:block dark:bg-stone-800" />
            <DropdownMenu>
              <DropdownMenuTrigger
                className="focus-ring flex items-center gap-2 rounded-xl p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800"
                aria-label="Хэрэглэгчийн цэс нээх"
              >
                <Avatar name={user?.name ?? 'Алекс Морган'} className="size-8 text-xs" />
                <div className="hidden text-left md:block">
                  <div className="text-xs font-semibold text-stone-900 dark:text-white">{user?.name ?? 'Алекс Морган'}</div>
                  <div className="text-[10px] text-stone-400">{user?.role ?? 'Админ'}</div>
                </div>
                <ChevronDown className="hidden size-3.5 text-stone-400 md:block" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-64 p-2">
                <div className="px-3 pb-2 pt-1"><div className="text-sm font-semibold text-stone-900 dark:text-white">Админы удирдлага</div><div className="mt-0.5 text-xs text-stone-400">Хяналт ба системийн тохиргоо</div></div>
                <DropdownMenuItem onSelect={() => navigate('/admin/dashboard')}><LayoutDashboard className="size-4 text-brand-600" />Admin dashboard</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate('/admin/users')}><Users className="size-4 text-brand-600" />Хэрэглэгчдийн хяналт</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate('/admin/roles')}><Shield className="size-4 text-brand-600" />Role болон эрх өгөх</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate('/admin/dashboard?view=reports')}><BarChart3 className="size-4 text-brand-600" />Тайлан, тооцоо</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate('/admin/users?view=partners')}><Handshake className="size-4 text-brand-600" />Хамтран ажиллах хүмүүс</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => void logout()} className="text-red-600">
                  <LogOut className="size-4" />Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main id="main-content" key={location.pathname} className="page-container" tabIndex={-1}>
          <Breadcrumbs />
          <Outlet />
        </main>
        <footer className="mx-auto flex max-w-[1600px] flex-col gap-2 border-t border-stone-200 px-4 py-5 text-xs text-stone-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:border-stone-800">
          <span>© 2026 TradeFlow. Аж ахуйн нэгжийн удирдлагын систем.</span>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-stone-700 dark:hover:text-white">Нууцлал</a>
            <a href="#security" className="hover:text-stone-700 dark:hover:text-white">Аюулгүй байдал</a>
            <a href="#status" className="hover:text-stone-700 dark:hover:text-white">Статус</a>
          </div>
        </footer>
      </div>
    </div>
  )
}
