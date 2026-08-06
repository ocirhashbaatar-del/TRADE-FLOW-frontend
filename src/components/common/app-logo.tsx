import { Leaf, ShoppingBasket } from 'lucide-react'
import { cn } from '@/utils/cn'

export function AppLogo({ compact = false, className, light = false }: { compact?: boolean; className?: string; light?: boolean }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('relative grid size-11 shrink-0 place-items-center rounded-[16px] bg-gradient-to-br shadow-lg', light ? 'from-emerald-400 to-lime-400 text-emerald-950 shadow-emerald-500/20' : 'from-amber-400 to-orange-400 text-amber-950 shadow-amber-500/20 dark:from-emerald-400 dark:to-lime-400 dark:text-emerald-950 dark:shadow-emerald-500/20')}>
        <ShoppingBasket className="size-5" />
        <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full border-2 border-current/10 bg-white text-emerald-600 shadow-sm">
          <Leaf className={cn('size-3 fill-current', light ? 'text-emerald-600' : 'text-amber-600 dark:text-emerald-600')} />
        </span>
      </div>
      {!compact && (
        <div>
          <div className={cn('text-[17px] font-extrabold tracking-[-.04em]', light ? 'text-white' : 'text-slate-950 dark:text-white')}>
            Fresh<span className={light ? 'text-emerald-400' : 'text-amber-500 dark:text-emerald-400'}>Flow</span>
          </div>
          <div className={cn('mt-0.5 text-[9px] font-bold uppercase tracking-[.24em]', light ? 'text-white/45' : 'text-slate-400')}>
            Food marketplace
          </div>
        </div>
      )}
    </div>
  )
}
