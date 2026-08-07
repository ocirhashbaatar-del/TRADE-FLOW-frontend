import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LockKeyhole, MapPin, PackageCheck, ShieldCheck, Truck } from 'lucide-react'
import { apiClient } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { useCart } from '@/contexts/cart-context'
import { usePageTitle } from '@/hooks/use-page-title'
import { currency } from '@/utils/format'

function Field({ name, label, placeholder, type = 'text', required = true }: { name: string; label: string; placeholder: string; type?: string; required?: boolean }) {
  return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Input id={name} name={name} required={name === 'couponCode' ? false : required} type={type} placeholder={placeholder} className="h-12" /></div>
}

export default function CheckoutPage() {
  const { items, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const isB2B = items.length > 0 && items.every((item) => item.purchaseChannel === 'B2B')
  const mixedChannels = items.some((item) => item.purchaseChannel === 'B2B') && !isB2B
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const delivery = items.length ? 180 : 0
  usePageTitle(isB2B ? 'B2B захиалга — TradeFlow' : 'Stripe төлбөр — TradeFlow')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!items.length) return
    if (mixedChannels) { setError('B2B болон жижиглэнгийн барааг тусдаа захиална уу.'); return }
    setSubmitting(true); setError('')
    try {
      if (!user && !localStorage.getItem('tradeflow-token')) {
        let guestId = localStorage.getItem('tradeflow-guest-id')
        if (!guestId) { guestId = crypto.randomUUID(); localStorage.setItem('tradeflow-guest-id', guestId) }
        const auth = (await apiClient.post<{ token: string; refreshToken?: string; user: unknown }>('/auth/guest', { guestId })).data
        localStorage.setItem('tradeflow-token', auth.token); localStorage.setItem('tradeflow-user', JSON.stringify(auth.user))
        if (auth.refreshToken) localStorage.setItem('tradeflow-refresh-token', auth.refreshToken)
        window.dispatchEvent(new Event('tradeflow-auth-changed'))
      }
      const data = new FormData(event.currentTarget)
      const order = (await apiClient.post<{ id: string }>('/orders', { items: items.map((item) => ({ productId: item.productId ?? item.id, variantId: item.variantId, quantity: item.qty })), recipientName: data.get('recipientName'), phone: data.get('phone'), city: data.get('city'), district: data.get('district'), address: data.get('address'), couponCode: data.get('couponCode') || undefined, deliveryZoneId: data.get('deliveryZoneId') || undefined, channel: isB2B ? 'B2B' : 'B2C' })).data
      if (isB2B) { clearCart(); navigate('/b2b'); return }
      const session = (await apiClient.post<{ url: string | null }>('/payments/checkout-session', { orderId: order.id })).data
      if (!session.url) throw new Error('Stripe URL missing')
      clearCart()
      window.location.assign(session.url)
    } catch (reason) {
      setSubmitting(false)
      const status = (reason as { response?: { status?: number } }).response?.status
      setError(status === 503 ? 'Stripe payment тохируулагдаагүй байна. STRIPE_SECRET_KEY оруулна уу.' : 'Захиалга эсвэл төлбөр үүсгэхэд алдаа гарлаа.')
    }
  }

  return <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950"><form onSubmit={submit} className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_380px]">
    <div><div className="rounded-[28px] bg-emerald-950 p-7 text-white"><div className="flex items-center gap-2 text-sm font-bold text-emerald-300"><ShieldCheck className="size-5" />{isB2B ? 'Гэрээт худалдан авалт' : 'Аюулгүй Stripe Checkout'}</div><h1 className="mt-3 text-4xl font-bold">Хүргэлтийн мэдээлэл</h1><p className="mt-3 text-white/60">{isB2B ? 'Үнэ болон зээлийн хязгаарыг сервер дахин баталгаажуулж захиалга үүсгэнэ.' : 'Картын мэдээллийг зөвхөн Stripe-ийн хамгаалагдсан хуудсанд оруулна.'}</p></div>
      <Card className="mt-6 p-6"><h2 className="flex items-center gap-2 text-xl font-bold"><MapPin className="size-5 text-emerald-600" />Хүргэлтийн хаяг</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field name="recipientName" label="Хүлээн авагч" placeholder="Овог, нэр" /><Field name="phone" label="Утас" placeholder="9911 2233" type="tel" /><Field name="city" label="Хот" placeholder="Улаанбаатар" /><Field name="district" label="Дүүрэг, хороо" placeholder="Сүхбаатар, 1-р хороо" /><div className="sm:col-span-2"><Field name="address" label="Дэлгэрэнгүй хаяг" placeholder="Байр, орц, тоот, нэмэлт тайлбар" /></div><div className="sm:col-span-2"><Field name="couponCode" label="Coupon / promo code" placeholder="Жишээ: WELCOME10" /></div></div></Card>
    </div>
    <Card className="h-fit p-6 lg:sticky lg:top-24"><div className="flex items-center gap-3"><PackageCheck className="size-6 text-emerald-600" /><h2 className="text-xl font-bold">Захиалгын мэдээлэл</h2></div><div className="mt-5 max-h-80 space-y-3 overflow-auto">{items.map((item) => <div key={item.id} className="flex items-center gap-3"><img src={item.image} alt={item.name} className="size-12 rounded-xl object-cover" /><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{item.name}</div><div className="text-xs text-slate-500">{item.qty} ширхэг</div></div><div className="text-sm font-bold">{currency.format(item.price * item.qty)}</div></div>)}</div><div className="mt-5 space-y-2 border-t pt-4 text-sm"><div className="flex justify-between"><span>Бараа</span><span>{currency.format(subtotal)}</span></div><div className="flex justify-between"><span>Хүргэлт</span><span>{currency.format(delivery)}</span></div><div className="flex justify-between pt-2 text-lg font-bold"><span>Нийт</span><span>{currency.format(subtotal + delivery)}</span></div></div>{mixedChannels && <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">B2B болон жижиглэнгийн барааг нэг захиалгад хольж болохгүй.</div>}{error && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</div>}<Button className="mt-5 h-12 w-full" disabled={!items.length || mixedChannels} loading={submitting}><LockKeyhole className="size-4" />{isB2B ? 'Гэрээт захиалга батлах' : 'Stripe-аар төлөх'}</Button><div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400"><Truck className="size-4" />{isB2B ? 'Гэрээт үнэ, зээлийн хязгаараар захиална' : 'Захиалга үүсгээд Stripe руу шилжинэ'}</div><Button type="button" variant="ghost" className="mt-2 w-full" onClick={() => navigate('/cart')}>Сагс руу буцах</Button></Card>
  </form></div>
}
