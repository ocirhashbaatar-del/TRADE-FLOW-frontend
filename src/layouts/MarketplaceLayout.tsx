import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useCart, type CartItem } from '@/contexts/cart-context'
import { currency } from '@/utils/format'

export function MarketplaceLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { items, lastAdded, drawerOpen, closeCart, clearLastAdded, updateQty, removeItem } = useCart()
  const selected = lastAdded ? items.find((item) => item.id === lastAdded.id) : items.at(-1)
  const previous = items.filter((item) => item.id !== selected?.id)
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const saveAndClose = () => { closeCart(); window.setTimeout(clearLastAdded, 500) }
  const checkout = () => { closeCart(); navigate('/checkout') }
  return <div className="flex min-h-screen flex-col bg-[#fafaf9] dark:bg-stone-950">
    <a href="#marketplace-content" className="skip-link">Үндсэн хэсэг рүү очих</a>{pathname !== '/' && <Header />}
    <main id="marketplace-content" tabIndex={-1} className="flex-1"><Outlet /></main><div className="mt-20"><Footer /></div>
    <Sheet open={drawerOpen} onOpenChange={(open) => { if (!open) saveAndClose() }}><SheetContent title="Сагс" className="inset-y-2 right-2 flex h-auto w-[calc(100vw-1rem)] max-w-[480px] flex-col overflow-hidden rounded-[28px] border border-emerald-950/10 p-0 shadow-[0_28px_90px_-24px_rgba(6,78,59,.45)] sm:inset-y-3 sm:right-3 sm:w-[calc(100vw-1.5rem)] dark:border-white/10">
      <div className="border-b border-emerald-950/10 p-6 dark:border-white/10"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"><ShoppingBag className="size-5" /></span><div><h2 className="text-xl font-semibold">Таны сагс</h2><p className="text-sm text-slate-500">{items.length} төрлийн, {items.reduce((sum, item) => sum + item.qty, 0)} ширхэг бараа</p></div></div></div>
      <div className="flex-1 space-y-6 overflow-y-auto p-6">{selected ? <><div><div className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-emerald-600">Одоо сагсалж байгаа</div><CartRow item={selected} featured updateQty={updateQty} removeItem={removeItem} /></div>{previous.length > 0 && <div><div className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-slate-400">Өмнө сагсалсан бараа</div><div className="space-y-3">{previous.map((item) => <CartRow key={item.id} item={item} updateQty={updateQty} removeItem={removeItem} />)}</div></div>}</> : <div className="grid h-full place-items-center text-center text-slate-500"><div><ShoppingBag className="mx-auto size-10 opacity-30" /><p className="mt-3">Сагс хоосон байна</p></div></div>}</div>
      <div className="border-t border-emerald-950/10 bg-white p-6 dark:border-white/10 dark:bg-slate-900"><div className="mb-4 flex justify-between text-lg font-bold"><span>Нийт төлөх</span><span className="text-emerald-700 dark:text-emerald-300">{currency.format(total)}</span></div><div className="grid gap-3"><Button size="lg" onClick={saveAndClose} variant="secondary" className="h-13 rounded-full">Хадгалах</Button><Button size="lg" onClick={checkout} disabled={!items.length} className="h-13 rounded-full bg-emerald-600 text-white hover:bg-emerald-500">Шууд төлбөр төлөх</Button></div></div>
    </SheetContent></Sheet>
  </div>
}

function CartRow({ item, featured = false, updateQty, removeItem }: { item: CartItem; featured?: boolean; updateQty: (id: string, delta: number) => void; removeItem: (id: string) => void }) {
  return <div className={`relative border border-emerald-950/10 bg-[#fbfcf8] dark:border-white/10 dark:bg-white/5 ${featured ? 'rounded-[24px] p-4' : 'rounded-2xl p-3'}`}><div className="flex gap-3"><img src={item.image} alt={item.name} className={`shrink-0 rounded-xl object-cover ${featured ? 'size-20 sm:size-24' : 'size-16'}`} /><div className="min-w-0 flex-1 pr-7"><div className="truncate text-xs font-bold text-emerald-600">{item.category}</div><h3 className={`mt-1 line-clamp-2 font-semibold ${featured ? 'text-base' : 'text-sm'}`}>{item.name}</h3><div className="mt-1 text-sm font-bold text-emerald-700 dark:text-emerald-300">{currency.format(item.price * item.qty)}</div></div><button type="button" onClick={() => removeItem(item.id)} className="absolute right-3 top-3 grid size-8 place-items-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Сагснаас хасах"><Trash2 className="size-4" /></button></div><div className="mt-3 flex items-center justify-between"><span className="text-xs text-slate-500">{currency.format(item.price)} / ширхэг</span><div className="flex items-center gap-2 rounded-full border border-emerald-950/10 bg-white p-1 dark:border-white/10 dark:bg-white/10"><button type="button" onClick={() => updateQty(item.id, -1)} className="grid size-8 place-items-center rounded-full"><Minus className="size-3.5" /></button><span className="min-w-5 text-center text-sm font-bold">{item.qty}</span><button type="button" onClick={() => updateQty(item.id, 1)} className="grid size-8 place-items-center rounded-full bg-emerald-600 text-white"><Plus className="size-3.5" /></button></div></div></div>
}
