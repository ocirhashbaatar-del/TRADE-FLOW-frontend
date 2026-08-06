import { Check, Heart, ShoppingBag, Star } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { currency } from '@/utils/format'
import { useCart } from '@/contexts/cart-context'
import { assetUrl } from '@/utils/assets'

export function ProductCard({ product, index = 0, favorite = false, onFavorite }: { product: Product; index?: number; favorite?: boolean; onFavorite?: () => void }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const addToCart = () => {
    addItem(product)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1400)
  }

  return (
    <motion.article initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * .045, .3), duration: .45 }} className="group relative flex overflow-hidden rounded-[32px] border border-emerald-950/[.08] bg-white p-2.5 shadow-[0_12px_40px_rgba(13,66,46,.07)] transition duration-500 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-[0_30px_75px_rgba(13,66,46,.17)] dark:border-white/10 dark:bg-[#0c1d17]">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[24px]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[25px] bg-gradient-to-br from-[#edf7ee] to-[#e4f1e8] dark:from-white/[.08] dark:to-white/[.03]">
          <Link to={`/products/${product.id}`}><img src={assetUrl(product.image)} alt={product.name} loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-110" /></Link>
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/25 via-transparent to-white/5 opacity-70 transition group-hover:opacity-40" />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            {product.featured ? <span className="rounded-full border border-white/50 bg-amber-300 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.14em] text-amber-950 shadow-lg">★ Онцлох</span> : <span />}
            <Button variant="secondary" size="icon" onClick={onFavorite} className="size-10 rounded-full border border-white/60 bg-white/90 shadow-lg backdrop-blur hover:scale-105 hover:bg-white" aria-label={favorite ? 'Хүслийн жагсаалтаас хасах' : 'Хүслийн жагсаалтад нэмэх'}><Heart className={`size-4 ${favorite ? 'fill-rose-500 text-rose-500' : 'text-emerald-900'}`} /></Button>
          </div>
          {product.compareAt && <div className="absolute bottom-3 left-3 rounded-full bg-rose-500 px-3 py-1.5 text-xs font-extrabold text-white shadow-lg">SALE</div>}
        </div>
        <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-4">
          <div className="flex items-center justify-between gap-3"><span className="truncate rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.1em] text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">{product.category}</span><span className="flex shrink-0 items-center gap-1 text-xs font-bold text-slate-600 dark:text-white/70"><Star className="size-3.5 fill-amber-400 text-amber-400" />{product.rating}<span className="font-normal text-slate-400">({product.reviews})</span></span></div>
          <Link to={`/products/${product.id}`} className="mt-3 line-clamp-2 block min-h-12 text-lg font-bold leading-6 tracking-[-.025em] text-slate-900 transition hover:text-emerald-700 dark:text-white dark:hover:text-emerald-300">{product.name}</Link>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-400"><span className="size-1.5 rounded-full bg-emerald-400 ring-4 ring-emerald-100 dark:ring-emerald-400/10" />{product.vendor}</p>
          <div className="mt-auto pt-5">
            <div className="flex items-end justify-between gap-3 rounded-2xl bg-[#f2f8f3] px-3.5 py-3 dark:bg-white/5"><div><div><span className="text-xl font-black tracking-[-.035em] text-emerald-950 dark:text-emerald-300">{currency.format(product.price)}</span>{product.compareAt && <span className="ml-2 text-xs text-slate-400 line-through">{currency.format(product.compareAt)}</span>}</div><div className={`mt-1 text-[10px] font-extrabold uppercase tracking-wider ${product.stock < 10 ? 'text-rose-600' : 'text-emerald-600'}`}>{product.stock < 10 ? `Зөвхөн ${product.stock} үлдсэн` : `${product.stock} нөөцтэй`}</div></div></div>
            <Button className={`mt-3 h-12 w-full overflow-hidden rounded-2xl text-white shadow-lg transition-all duration-300 ${added ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-gradient-to-r from-[#064e3b] to-[#059669] shadow-emerald-800/20 hover:from-[#065f46] hover:to-[#10b981] hover:shadow-xl'}`} aria-label="Сагсанд нэмэх" onClick={addToCart}>{added ? <><span className="grid size-7 place-items-center rounded-full bg-white/20"><Check className="size-4" /></span>Сагсанд нэмэгдлээ</> : <><span className="grid size-7 place-items-center rounded-full bg-white/15"><ShoppingBag className="size-4" /></span>Сагслах</>}</Button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
