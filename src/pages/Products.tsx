import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Heart, Search, ShieldCheck, ShoppingCart, SlidersHorizontal, Sparkles, Truck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '@/components/ProductCard'
import { EmptyState } from '@/components/common/empty-state'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { usePageTitle } from '@/hooks/use-page-title'
import { repositories } from '@/services/repositories'
import { useCart } from '@/contexts/cart-context'
import { assetUrl } from '@/utils/assets'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Sort = 'recommended' | 'price-low' | 'rating'

const heroSlides = [
  { image: '/images/sale-drink-hero.png', badge: 'Зуны онцгой хямдрал', title: 'Сэрүүцүүлэх ундаа', accent: '30% OFF', description: 'Шинэхэн, сэрүүцүүлэх ундааны сонголтоо онцгой үнээр аваарай.' },
  { image: '/images/sale-snacks-fruit-hero.png', badge: 'Энэ долоо хоногийн SALE', title: 'Амттай snack & chips', accent: '25% OFF', description: 'Дуртай амттан, snack болон chips-ээ хямдралтай үнээр захиалаарай.' },
] as const

export default function Products() {
  const { openCart, savedProductIds: favorites, toggleSaved: toggleFavorite } = useCart()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [sort, setSort] = useState<Sort>('recommended')
  const [category, setCategory] = useState('all')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [heroSlide, setHeroSlide] = useState(0)

  usePageTitle('Бүтээгдэхүүн — TradeFlow')
  const { data: products = [], isLoading } = useQuery({ queryKey: ['products', query], queryFn: () => repositories.marketplace.listProducts(query) })
  const categories = useMemo(() => [...new Set(products.map((product) => product.category))], [products])
  const visibleProducts = useMemo(() => {
    const result = products.filter((product) => (category === 'all' || product.category === category) && (!favoritesOnly || favorites.includes(product.id)))
    if (sort === 'price-low') result.sort((a, b) => a.price - b.price)
    if (sort === 'rating') result.sort((a, b) => b.rating - a.rating)
    return result
  }, [products, category, favoritesOnly, favorites, sort])

  return <div className="min-h-screen bg-[#edf5ef] pb-28 text-slate-950 dark:bg-[#07110e] dark:text-white">
    <section className="relative min-h-[680px] overflow-hidden bg-[#0a2a20] text-white sm:min-h-[70vh]">
      {heroSlides.map((slide, index) => <img key={slide.image} src={assetUrl(slide.image)} alt={slide.title} className={`absolute inset-0 size-full object-cover object-[70%_center] brightness-110 transition duration-700 sm:object-center ${heroSlide === index ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`} />)}
      <div className="absolute inset-0 bg-gradient-to-t from-[#041a13] via-[#06261c]/80 to-[#073126]/10 sm:bg-gradient-to-r sm:from-[#06261c]/90 sm:via-[#073126]/50 sm:to-transparent" />
      <button type="button" onClick={() => setHeroSlide((heroSlide - 1 + heroSlides.length) % heroSlides.length)} className="absolute left-2 top-[34%] z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/20 text-white shadow-xl backdrop-blur-xl transition hover:scale-110 hover:bg-white/25 sm:left-7 sm:top-1/2 sm:size-12" aria-label="Өмнөх banner"><ChevronLeft className="size-5 sm:size-6" /></button>
      <button type="button" onClick={() => setHeroSlide((heroSlide + 1) % heroSlides.length)} className="absolute right-2 top-[34%] z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/20 text-white shadow-xl backdrop-blur-xl transition hover:scale-110 hover:bg-white/25 sm:right-7 sm:top-1/2 sm:size-12" aria-label="Дараагийн banner"><ChevronRight className="size-5 sm:size-6" /></button>
      <div className="relative mx-auto flex min-h-[680px] max-w-[1380px] items-end px-5 pb-14 pt-72 sm:min-h-[70vh] sm:items-center sm:px-20 sm:py-16 lg:px-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-xl"><Sparkles className="size-4 text-amber-300" />{heroSlides[heroSlide].badge}</div>
          <h1 className="mt-5 text-3xl font-semibold leading-[1.04] tracking-[-.05em] drop-shadow-lg sm:text-6xl sm:leading-[1.02] lg:text-7xl">{heroSlides[heroSlide].title}<span className="mt-2 block text-amber-300">{heroSlides[heroSlide].accent}</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">{heroSlides[heroSlide].description}</p>
          <div className="relative mt-8 max-w-xl rounded-full border border-white/25 bg-white/15 p-2 shadow-2xl backdrop-blur-xl"><Search className="absolute left-6 top-1/2 size-5 -translate-y-1/2 text-slate-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-14 rounded-full border-0 bg-white pl-12 pr-6 text-base text-slate-900 shadow-none" placeholder="Бараа, ангилал, нийлүүлэгч хайх..." /></div>
          <div className="mt-7 flex flex-wrap gap-5 text-sm text-white/80"><span className="flex items-center gap-2"><ShieldCheck className="size-4 text-emerald-300" />Баталгаатай нийлүүлэгч</span><span className="flex items-center gap-2"><Truck className="size-4 text-emerald-300" />Шуурхай хүргэлт</span></div>
          <div className="mt-8 flex gap-2">{heroSlides.map((slide, index) => <button key={slide.image} type="button" onClick={() => setHeroSlide(index)} aria-label={`${index + 1}-р banner`} className={`h-2 rounded-full transition-all ${heroSlide === index ? 'w-10 bg-amber-300' : 'w-2 bg-white/50'}`} />)}</div>
        </div>
      </div>
    </section>

    <main className="relative z-10 mx-auto -mt-7 max-w-[1380px] rounded-t-[28px] border-x border-t border-emerald-950/[.07] bg-[#f8fbf8] px-3 pb-10 pt-8 shadow-[0_-20px_70px_rgba(4,45,32,.08)] sm:-mt-10 sm:rounded-t-[44px] sm:px-6 sm:pt-12 lg:px-8 dark:border-white/10 dark:bg-[#07110e]">
      <div className="flex flex-col gap-6 rounded-[30px] border border-emerald-950/[.07] bg-white p-6 shadow-[0_14px_45px_rgba(13,66,46,.07)] sm:flex-row sm:items-center sm:justify-between sm:p-7 dark:border-white/10 dark:bg-white/[.045]">
        <div><div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.22em] text-emerald-600"><span className="size-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-400/10" />Манай дэлгүүр</div><h2 className="mt-3 text-3xl font-bold tracking-[-.045em] sm:text-4xl">Танд зориулсан бүтээгдэхүүнүүд</h2><p className="mt-2 text-sm text-slate-500"><strong className="text-emerald-700 dark:text-emerald-300">{visibleProducts.length}</strong> бүтээгдэхүүнээс сонголтоо хийгээрэй</p></div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <button type="button" onClick={() => setFavoritesOnly((value) => !value)} className={`flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold ${favoritesOnly ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-emerald-950/10 bg-white dark:border-white/10 dark:bg-white/5'}`}><Heart className={`size-4 ${favoritesOnly ? 'fill-current' : ''}`} />Favorite <span>{favorites.length}</span></button>
          <button type="button" onClick={openCart} className="flex items-center gap-2 rounded-full border border-emerald-950/10 bg-white px-4 py-3 text-sm font-semibold dark:border-white/10 dark:bg-white/5"><ShoppingCart className="size-4 text-emerald-600" />Сагс</button>
          <Select value={sort} onValueChange={(value) => setSort(value as Sort)}><SelectTrigger className="h-12 w-[230px] rounded-full border-emerald-950/10 bg-white px-4 font-bold shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-white/10 dark:bg-white/5"><span className="flex min-w-0 items-center gap-2.5"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"><SlidersHorizontal className="size-3.5" /></span><SelectValue /></span></SelectTrigger><SelectContent className="w-[250px]"><div className="px-3 pb-2 pt-1 text-[10px] font-black uppercase tracking-[.18em] text-slate-400">Эрэмбэлэх</div><SelectItem value="recommended">Санал болгосон</SelectItem><SelectItem value="price-low">Үнэ: багаас өндөр</SelectItem><SelectItem value="rating">Өндөр үнэлгээтэй</SelectItem></SelectContent></Select>
        </div>
      </div>

      <div className="mt-7 flex gap-2 overflow-x-auto rounded-2xl border border-emerald-950/[.06] bg-white/80 p-2.5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[.04]"><CategoryButton active={category === 'all'} onClick={() => setCategory('all')}>Бүх ангилал</CategoryButton>{categories.map((item) => <CategoryButton key={item} active={category === item} onClick={() => setCategory(item)}>{item}</CategoryButton>)}</div>
      <div className="mt-6 sm:mt-8">{isLoading ? <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-[360px] rounded-[20px] sm:h-[450px] sm:rounded-[32px]" />)}</div> : visibleProducts.length === 0 ? <div className="rounded-[30px] border border-dashed border-emerald-300 bg-white py-16 dark:bg-white/5"><EmptyState title="Бүтээгдэхүүн олдсонгүй" description="Өөр хайлтын үг, ангилал эсвэл шүүлтүүр ашиглана уу." /></div> : <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">{visibleProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} favorite={favorites.includes(product.id)} onFavorite={() => toggleFavorite(product.id)} />)}</div>}</div>
    </main>
  </div>
}

function CategoryButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={`shrink-0 rounded-xl px-5 py-3 text-sm font-bold transition-all duration-300 ${active ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/20' : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-800 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white'}`}>{children}</button>
}
