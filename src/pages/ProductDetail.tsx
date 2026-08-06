import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Check, Heart, Minus, PackageCheck, Plus, ShieldCheck, ShoppingCart, Star, Store, Truck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { repositories } from '@/services/repositories'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { currency } from '@/utils/format'
import { usePageTitle } from '@/hooks/use-page-title'
import { useCart } from '@/contexts/cart-context'

export default function ProductDetail() {
  const { id = 'p-1' } = useParams()
  const [qty, setQty] = useState(1)
  const { addItem, savedProductIds: favorites, toggleSaved: toggleFavorite } = useCart()
  const [added, setAdded] = useState(false)

  const addToCart = () => {
    if (!product) return
    addItem(product, qty)
    setAdded(true)
  }

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => repositories.marketplace.getProduct(id),
  })

  const { data: catalog = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => repositories.marketplace.listProducts(),
  })

  usePageTitle(product?.name ?? 'Бүтээгдэхүүн')

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-10">
        <Skeleton className="h-[620px] rounded-2xl" />
      </div>
    )
  }

  if (!product) {
    return <div className="p-20 text-center text-stone-500">Бүтээгдэхүүн олдсонгүй.</div>
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-brand-600"
      >
        <ArrowLeft className="size-4" /> Буцах
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <div>
          <div className="overflow-hidden rounded-3xl bg-stone-100">
            <img
              src={product.image}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <button
                key={i}
                className={`overflow-hidden rounded-xl border-2 ${i === 0 ? 'border-brand-500' : 'border-transparent'}`}
              >
                <img src={product.image} alt="" className="aspect-square object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="lg:py-4">
          <Badge variant="blue">{product.category}</Badge>
          <h1 className="mt-5 text-balance text-4xl font-bold tracking-[-.045em]">
            {product.name}
          </h1>
          <p className="mt-3 inline-flex items-center gap-2 text-sm text-stone-500">
            <Store className="size-4" /> Худалдагч: <strong>{product.vendor}</strong>
          </p>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="size-5 fill-highlight-500 text-highlight-500" />
              <span className="font-semibold">{product.rating}</span>
            </div>
            <span className="text-sm text-stone-400">{product.reviews} үнэлгээ</span>
          </div>

          <div className="mt-7 flex items-end gap-3">
            <span className="text-4xl font-bold">{currency.format(product.price)}</span>
            {product.compareAt && (
              <span className="pb-1 text-lg text-stone-400 line-through">
                {currency.format(product.compareAt)}
              </span>
            )}
          </div>

          <p className="mt-6 text-base leading-8 text-stone-600 dark:text-stone-300">
            {product.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>

          <Card className="mt-8 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Худалдан авах тоо</div>
                <div className="mt-1 text-xs text-emerald-600">
                  {product.stock} ширхэг бэлэн
                </div>
              </div>
              <div className="flex items-center rounded-xl border border-stone-200 dark:border-stone-700">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >
                  <Minus className="size-4" />
                </Button>
                <input type="number" min={1} max={product.stock} value={qty} onChange={(event) => setQty(Math.max(1, Math.min(product.stock, Math.floor(Number(event.target.value) || 1))))} className="h-10 w-16 border-x border-stone-200 bg-transparent text-center font-semibold outline-none dark:border-stone-700" aria-label="Худалдан авах тоо" />
                <Button variant="ghost" size="icon" disabled={qty >= product.stock} onClick={() => setQty(Math.min(product.stock, qty + 1))}>
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
              <Button type="button" size="lg" onClick={addToCart}>
                {added ? <Check className="size-5" /> : <ShoppingCart className="size-5" />} {added ? 'Сагсанд нэмэгдлээ' : 'Сагсанд нэмэх'} ·{' '}
                {currency.format(product.price * qty)}
              </Button>
              <Button type="button" variant="secondary" size="lg" onClick={() => toggleFavorite(product.id)} aria-label={favorites.includes(product.id) ? 'Хүслийн жагсаалтаас хасах' : 'Хүслийн жагсаалтад нэмэх'}>
                <Heart className={`size-5 ${favorites.includes(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
              </Button>
            </div>
          </Card>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Truck, title: 'Хурдан хүргэлт', description: '1–2 хоногт хүргэнэ' },
              { icon: ShieldCheck, title: 'TradeFlow хамгаалалт', description: 'Батлагдсан ханган нийлүүлэгч' },
              { icon: PackageCheck, title: 'Хялбар буцаалт', description: '30 хоногийн буцаалт' },
            ].map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-stone-200 p-3 dark:border-stone-800"
              >
                <Icon className="size-5 text-brand-600" />
                <div className="mt-2 text-xs font-semibold">{title}</div>
                <div className="mt-1 text-[11px] text-stone-400">{description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="mt-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Санал болгож буй бүтээгдэхүүн</h2>
            <p className="mt-1 text-sm text-stone-500">
              Бусад ижил төстэй бүтээгдэхүүнүүдийг үзнэ үү.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {catalog.slice(0, 4).map((item, index) => (
          <ProductCard key={item.id} product={item} index={index} favorite={favorites.includes(item.id)} onFavorite={() => toggleFavorite(item.id)} />
        ))}
      </div>
    </div>
  )
}
