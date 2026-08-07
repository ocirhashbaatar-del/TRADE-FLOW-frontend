import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import { PageHeader } from '@/components/common/page-header'
import { LoadingState } from '@/components/common/loading-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { currency } from '@/utils/format'
import { usePageTitle } from '@/hooks/use-page-title'

type Status = 'PENDING' | 'PAID' | 'CONFIRMED' | 'PROCESSING' | 'READY' | 'PARTIALLY_SHIPPED' | 'SHIPPED' | 'PARTIALLY_DELIVERED' | 'DELIVERED' | 'RETURNED' | 'CANCELLED'
type Order = { id: string; orderNumber: string; status: Status; channel: string; total: number; recipientName: string; createdAt: string; items: Array<{ id: string; quantity: number; shippedQuantity: number; backorderedQuantity: number; returnedQuantity: number; appliedPriceSource: string; product: { name: string } }> }
const next: Partial<Record<Status, Status[]>> = { PENDING: ['CONFIRMED', 'CANCELLED'], PAID: ['CONFIRMED', 'CANCELLED'], CONFIRMED: ['PROCESSING', 'READY', 'CANCELLED'], PROCESSING: ['READY', 'CANCELLED'], READY: ['CANCELLED'], SHIPPED: ['PARTIALLY_DELIVERED', 'DELIVERED'], PARTIALLY_DELIVERED: ['DELIVERED'] }
const label: Record<Status, string> = { PENDING: 'Хүлээгдэж буй', PAID: 'Төлөгдсөн', CONFIRMED: 'Баталгаажсан', PROCESSING: 'Бэлтгэж буй', READY: 'Ачилтад бэлэн', PARTIALLY_SHIPPED: 'Хэсэгчлэн ачсан', SHIPPED: 'Ачигдсан', PARTIALLY_DELIVERED: 'Хэсэгчлэн хүргэсэн', DELIVERED: 'Хүргэсэн', RETURNED: 'Буцаагдсан', CANCELLED: 'Цуцлагдсан' }

export default function AdminOrders() {
  usePageTitle('Захиалгын удирдлага')
  const client = useQueryClient()
  const orders = useQuery({ queryKey: ['admin-orders'], queryFn: async () => (await apiClient.get<Order[]>('/orders')).data })
  const transition = useMutation({ mutationFn: ({ id, status }: { id: string; status: Status }) => apiClient.patch(`/orders/${id}/status`, { status, reason: `Admin ${label[status]} төлөвт шилжүүлэв` }), onSuccess: async () => client.invalidateQueries({ queryKey: ['admin-orders'] }) })
  if (orders.isLoading) return <LoadingState />
  return <><PageHeader eyebrow="FR-3.5 / FR-7" title="Захиалгын lifecycle" description="Үнэ тогтсон эх үүсвэр, зөвшөөрөгдсөн төлөв, shipment болон backorder-ийг бодит API-аас удирдана." />
    <div className="space-y-4">{(orders.data ?? []).map((order) => <Card key={order.id}><CardContent className="p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-start"><div className="flex-1"><div className="flex flex-wrap items-center gap-2"><span className="font-mono font-bold text-emerald-700">{order.orderNumber}</span><Badge>{label[order.status]}</Badge><Badge variant="blue">{order.channel}</Badge></div><div className="mt-1 text-sm text-slate-500">{order.recipientName} · {new Date(order.createdAt).toLocaleString('mn-MN')}</div><div className="mt-4 space-y-2">{order.items.map((item) => <div key={item.id} className="rounded-xl bg-slate-50 p-3 text-sm"><div className="flex flex-wrap justify-between gap-2"><span className="font-semibold">{item.product.name} · {item.quantity} ш</span><span>{currency.format(Number(order.total))}</span></div><div className="mt-1 text-xs text-slate-500">Үнэ: {item.appliedPriceSource} · Ачсан: {item.shippedQuantity} · Backorder: {item.backorderedQuantity} · Буцаасан: {item.returnedQuantity}</div></div>)}</div></div><div className="flex flex-wrap gap-2 lg:max-w-64">{(next[order.status] ?? []).map((status) => <Button key={status} size="sm" variant={status === 'CANCELLED' ? 'secondary' : 'default'} disabled={transition.isPending} onClick={() => transition.mutate({ id: order.id, status })}>{label[status]}</Button>)}</div></div></CardContent></Card>)}</div>
  </>
}
