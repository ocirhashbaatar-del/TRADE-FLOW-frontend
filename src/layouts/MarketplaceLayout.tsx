import { Link, NavLink, Outlet } from 'react-router-dom'
import { Heart, Menu, Moon, Search, ShoppingCart, Sun } from 'lucide-react'
import { AppLogo } from '@/components/common/app-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useTheme } from '@/contexts/theme-context'
import { cn } from '@/utils/cn'

const links = [
  ['Marketplace', '/marketplace'],
  ['Categories', '/marketplace/categories'],
  ['Recommendations', '/marketplace/recommendations'],
  ['Orders', '/marketplace/orders'],
] as const

export function MarketplaceLayout() {
  const { resolvedTheme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <a href="#marketplace-content" className="skip-link">Skip to marketplace content</a>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-5 px-4 sm:px-6 lg:px-8">
          <Link to="/marketplace" aria-label="TradeFlow Marketplace home">
            <AppLogo />
          </Link>
          <nav aria-label="Marketplace navigation" className="hidden items-center gap-1 lg:flex">
            {links.map(([label, href]) => (
              <NavLink
                key={href}
                to={href}
                end={href === '/marketplace'}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <form action="/marketplace/search" className="relative ml-auto hidden w-full max-w-sm md:block" role="search">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <Input name="q" className="pl-9" placeholder="Search the marketplace" aria-label="Search marketplace" />
          </form>
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {resolvedTheme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link to="/marketplace/wishlist" aria-label="Open wishlist"><Heart className="size-5" /></Link>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link to="/marketplace/cart" aria-label="Open shopping cart"><ShoppingCart className="size-5" /></Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open marketplace menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent title="Marketplace menu">
                <nav aria-label="Mobile marketplace navigation" className="mt-8 space-y-2">
                  {links.map(([label, href]) => (
                    <NavLink
                      key={href}
                      to={href}
                      end={href === '/marketplace'}
                      className={({ isActive }) =>
                        cn(
                          'block rounded-xl px-4 py-3 text-sm font-medium',
                          isActive
                            ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800',
                        )
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main id="marketplace-content" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          <div>
            <AppLogo />
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Verified B2B products from trusted suppliers, connected to enterprise operations.
            </p>
          </div>
          {['Marketplace', 'Company', 'Support'].map((group) => (
            <div key={group}>
              <div className="text-sm font-semibold">{group}</div>
              <div className="mt-4 space-y-3 text-sm text-slate-500">
                <a className="block hover:text-brand-600" href="#overview">Overview</a>
                <a className="block hover:text-brand-600" href="#resources">Resources</a>
                <a className="block hover:text-brand-600" href="#contact">Contact</a>
              </div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  )
}
