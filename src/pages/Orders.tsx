import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { PackageCheck, PackageOpen } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { apiClient } from '@/api/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePageTitle } from '@/hooks/use-page-title'
import { currency } from '@/utils/format'

type OrderStatus = 'PENDING' | 'PAID' | 'CONFIRMED' | 'PROCESSING' | 'READY' | 'PARTIALLY_SHIPPED' | 'SHIPPED' | 'PARTIALLY_DELIVERED' | 'DELIVERED' | 'RETURNED' | 'CANCELLED'
type ApiOrder = { id: string; orderNumber: string; status: OrderStatus; total: number; createdAt: string; items: Array<{ id: string; quantity: number; shippedQuantity: number; backorderedQuantity: number; returnedQuantity: number; appliedPriceSource: string; product: { id: string; name: string; image: string } }> }
const labels: Record<OrderStatus, string> = { PENDING: 'Хүлээгдэж байна', PAID: 'Төлөгдсөн', CONFIRMED: 'Баталгаажсан', PROCESSING: 'Бэлтгэж байна', READY: 'Ачилтад бэлэн', PARTIALLY_SHIPPED: 'Хэсэгчлэн ачсан', SHIPPED: 'Хүргэлтэд гарсан', PARTIALLY_DELIVERED: 'Хэсэгчлэн хүргэсэн', DELIVERED: 'Хүргэж өгсөн', RETURNED: 'Буцаагдсан', CANCELLED: 'Цуцлагдсан' }

export default function OrdersPage() {
  usePageTitle('Захиалгын түүх')
  const [searchParams, setSearchParams] = useSearchParams(), queryClient = useQueryClient()
  useEffect(() => { const sessionId=searchParams.get('session_id'); if (!sessionId || searchParams.get('payment')!=='success') return; void apiClient.post('/payments/checkout-session/confirm',{sessionId}).then(async()=>{await queryClient.invalidateQueries({queryKey:['orders']});setSearchParams({payment:'confirmed'},{replace:true})}) }, [queryClient, searchParams, setSearchParams])
  const { data: orders = [], isLoading } = useQuery({ queryKey: ['orders'], queryFn: async () => (await apiClient.get<ApiOrder[]>('/orders')).data })
  return <div className="mx-auto max-w-[1300px] px-4 py-12 sm:px-6 lg:px-8"><h1 className="text-3xl font-bold">Захиалгын түүх</h1><p className="mt-2 text-sm text-slate-500">Таны захиалга болон хүргэлтийн төлөв realtime шинэчлэгдэнэ.</p>{isLoading ? <div className="mt-12 text-center text-slate-500">Уншиж байна...</div> : orders.length === 0 ? <div className="mt-16 flex flex-col items-center gap-4 text-center"><PackageOpen className="size-12 text-slate-400" /><h2 className="text-xl font-semibold">Захиалга байхгүй</h2><Button asChild><Link to="/products">Дэлгүүр үзэх</Link></Button></div> : <div className="mt-8 space-y-4">{orders.map((order) => <Card key={order.id} className="p-5"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="grid size-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><PackageCheck className="size-6" /></div><div className="flex-1"><div className="flex flex-wrap items-center gap-2"><span className="font-bold">{order.orderNumber}</span><Badge variant={order.status === 'DELIVERED' ? 'green' : order.status === 'SHIPPED' ? 'blue' : 'amber'}>{labels[order.status]}</Badge></div><div className="mt-1 text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString('mn-MN')} · {order.items.length} төрлийн бараа</div><div className="mt-3 flex items-center gap-3">{order.items.slice(0, 4).map((item) => <div key={item.id} className="relative"><img src={item.product.image} alt={item.product.name} title={item.product.name} className="size-10 rounded-full border-2 border-white object-cover" /><span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">{item.quantity}</span></div>)}</div></div><div className="font-bold">{currency.format(Number(order.total))}</div></div></Card>)}</div>}</div>
}
