import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MapPin, Phone, Truck } from 'lucide-react'
import { apiClient } from '@/api/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { currency } from '@/utils/format'
import { usePageTitle } from '@/hooks/use-page-title'

type Status = 'PARTIALLY_SHIPPED' | 'SHIPPED' | 'PARTIALLY_DELIVERED' | 'DELIVERED'
type Delivery = { id: string; orderNumber: string; status: Status; total: number; recipientName: string; phone: string; city: string; district: string; address: string; items: Array<{ id: string; quantity: number; shippedQuantity: number; product: { name: string } }> }
const labels: Record<Status, string> = { PARTIALLY_SHIPPED: 'Хэсэгчлэн ачсан', SHIPPED: 'Хүргэлтэд гарсан', PARTIALLY_DELIVERED: 'Хэсэгчлэн хүргэсэн', DELIVERED: 'Хүргэж өгсөн' }

export default function TransportDashboard() {
  usePageTitle('Тээвэрлэгчийн самбар')
  const client = useQueryClient()
  const query = useQuery({ queryKey: ['deliveries'], queryFn: async () => (await apiClient.get<Delivery[]>('/deliveries')).data })
  const update = useMutation({ mutationFn: ({ id, status }: { id: string; status: 'PARTIALLY_DELIVERED' | 'DELIVERED' }) => apiClient.patch(`/deliveries/${id}/status`, { status }), onSuccess: async () => client.invalidateQueries({ queryKey: ['deliveries'] }) })
  const deliveries = (query.data ?? []).filter((row) => ['PARTIALLY_SHIPPED', 'SHIPPED', 'PARTIALLY_DELIVERED', 'DELIVERED'].includes(row.status))
  return <div className="mx-auto min-h-screen max-w-6xl px-4 py-10"><div className="rounded-[32px] bg-emerald-950 p-8 text-white"><div className="text-sm font-bold uppercase tracking-[.18em] text-emerald-300">Тээвэрлэгч</div><h1 className="mt-3 text-4xl font-semibold">Хүргэлтийн хяналт</h1><p className="mt-3 text-white/60">Ачигдсан захиалгыг хэсэгчлэн эсвэл бүрэн хүргэсэн төлөвт шилжүүлнэ.</p></div>
    <div className="mt-6 space-y-4">{query.isLoading ? <div className="p-10 text-center">Уншиж байна...</div> : deliveries.map((row) => <Card key={row.id} className="p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-center"><div className="grid size-12 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><Truck className="size-5" /></div><div className="flex-1"><div className="flex flex-wrap items-center gap-2"><span className="font-bold">{row.orderNumber}</span><Badge variant={row.status === 'DELIVERED' ? 'green' : 'blue'}>{labels[row.status]}</Badge></div><div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500"><span className="flex items-center gap-1"><Phone className="size-4" />{row.phone}</span><span className="flex items-center gap-1"><MapPin className="size-4" />{row.city}, {row.district}, {row.address}</span></div><div className="mt-2 text-xs text-slate-500">Ачсан: {row.items.reduce((sum, item) => sum + item.shippedQuantity, 0)} ш · {currency.format(Number(row.total))}</div></div>{row.status !== 'DELIVERED' && <div className="flex gap-2"><Button size="sm" variant="secondary" disabled={update.isPending} onClick={() => update.mutate({ id: row.id, status: 'PARTIALLY_DELIVERED' })}>Хэсэгчлэн хүргэсэн</Button><Button size="sm" disabled={update.isPending} onClick={() => update.mutate({ id: row.id, status: 'DELIVERED' })}>Бүрэн хүргэсэн</Button></div>}</div></Card>)}</div>
  </div>
}
