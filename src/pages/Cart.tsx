import { Link } from 'react-router-dom'
import { ArrowRight, Minus, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { currency } from '@/utils/format'
import { usePageTitle } from '@/hooks/use-page-title'
import { useCart } from '@/contexts/cart-context'

function OrderSummary({ subtotal }: { subtotal: number }) {
  return (
    <Card className="h-fit lg:sticky lg:top-24">
      <CardHeader>
        <CardTitle>Захиалгын дүн</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-stone-500">
            <span>Дүн</span>
            <span>{currency.format(subtotal)}</span>
          </div>
          <div className="flex justify-between text-stone-500">
            <span>Хүргэлт</span>
            <span>{currency.format(180)}</span>
          </div>
          <div className="flex justify-between text-stone-500">
            <span>Татвар</span>
            <span>{currency.format(subtotal * 0.08)}</span>
          </div>
          <div className="flex justify-between border-t border-stone-200 pt-4 text-base font-bold dark:border-stone-800">
            <span>Нийт</span>
            <span>{currency.format(subtotal * 1.08 + 180)}</span>
          </div>
        </div>
        <Button asChild size="lg" className="mt-6 w-full">
          <Link to="/checkout">
            Төлбөр руу шилжих <ArrowRight className="size-4" />
          </Link>
        </Button>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-400">
          <ShieldCheck className="size-4" /> Аюулгүй төлбөр
        </div>
      </CardContent>
    </Card>
  )
}

export default function CartPage() {
  usePageTitle('Сагс')
  const { items, updateQty, setItemQty, removeItem } = useCart()

  const subtotal = items.reduce((s, p) => s + p.price * p.qty, 0)

  return (
    <div className="mx-auto max-w-[1300px] px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white">Сагс</h1>
      <p className="mt-2 text-sm text-stone-500">Тоо хэмжээг шалгаад төлбөр рүү шилжинэ үү.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardContent className="divide-y divide-stone-100 p-0 dark:divide-stone-800">
            {items.length === 0 ? (
              <div className="p-10 text-center text-stone-500">Сагс хоосон байна.</div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                  <img src={item.image} alt="" className="size-24 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-stone-900 dark:text-white">{item.name}</div>
                    <div className="mt-1 text-xs text-stone-500">
                      {item.vendor} · {item.category}
                    </div>
                    <div className="mt-3 font-bold">{currency.format(item.price)}</div>
                  </div>
                  <div className="flex items-center rounded-xl border border-stone-200 dark:border-stone-700">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateQty(item.id, -1)}
                    >
                      <Minus className="size-4" />
                    </Button>
                    <input type="number" min={1} max={item.stock} value={item.qty} onChange={(event) => setItemQty(item.id, Number(event.target.value))} className="h-10 w-16 border-x border-stone-200 bg-transparent text-center font-medium outline-none dark:border-stone-700" aria-label={`${item.name} авах тоо`} />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateQty(item.id, 1)}
                      disabled={item.qty >= item.stock}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-stone-400 hover:text-red-600"
                    aria-label="Устгах"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <OrderSummary subtotal={subtotal} />
      </div>
    </div>
  )
}

