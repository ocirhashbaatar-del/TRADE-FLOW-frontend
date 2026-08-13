import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, Clock3, MapPin, PackageCheck, Phone, Truck } from 'lucide-react'
import { apiClient } from '@/api/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePageTitle } from '@/hooks/use-page-title'

type DeliveryStatus = 'PAID' | 'CONFIRMED' | 'PROCESSING' | 'READY' | 'PARTIALLY_SHIPPED' | 'SHIPPED' | 'PARTIALLY_DELIVERED' | 'DELIVERED'
type DeliveryItem = { id: string; quantity: number; shippedQuantity: number; backorderedQuantity: number; product: { name: string } }
type Delivery = { id: string; orderNumber: string; status: DeliveryStatus; recipientName: string; phone: string; city: string; district: string; address: string; createdAt: string; items: DeliveryItem[] }

const statusLabels: Record<DeliveryStatus, string> = {
  PAID: 'Төлбөр төлөгдсөн', CONFIRMED: 'Баталгаажсан', PROCESSING: 'Бэлтгэж байна', READY: 'Ачилтад бэлэн',
  PARTIALLY_SHIPPED: 'Хэсэгчлэн ачсан', SHIPPED: 'Хүргэлтэд гарсан', PARTIALLY_DELIVERED: 'Хэсэгчлэн хүргэсэн', DELIVERED: 'Хүргэж өгсөн',
}

const nextStatuses: Record<DeliveryStatus, DeliveryStatus[]> = {
  PAID: ['CONFIRMED'], CONFIRMED: ['PROCESSING', 'READY'], PROCESSING: ['READY', 'PARTIALLY_SHIPPED', 'SHIPPED'],
  READY: ['PARTIALLY_SHIPPED', 'SHIPPED'], PARTIALLY_SHIPPED: ['SHIPPED', 'PARTIALLY_DELIVERED'],
  SHIPPED: ['PARTIALLY_DELIVERED', 'DELIVERED'], PARTIALLY_DELIVERED: ['DELIVERED'], DELIVERED: [],
}

export default function TransportDashboard() {
  usePageTitle('Тээвэрлэгчийн хүргэлт')
  const queryClient = useQueryClient()
  const deliveries = useQuery({ queryKey: ['deliveries'], queryFn: async () => (await apiClient.get<Delivery[]>('/deliveries')).data })
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: DeliveryStatus }) => apiClient.patch(`/deliveries/${id}/status`, { status }),
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['deliveries'] }) },
  })

  const active = deliveries.data?.filter((delivery) => delivery.status !== 'DELIVERED') ?? []
  const completed = deliveries.data?.filter((delivery) => delivery.status === 'DELIVERED') ?? []
  const remainingItems = active.reduce((sum, delivery) => sum + delivery.items.reduce((itemSum, item) => itemSum + Math.max(0, item.quantity - item.shippedQuantity), 0), 0)

  return <div className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6">
    <div className="rounded-[32px] bg-emerald-950 p-8 text-white">
      <div className="text-sm font-bold uppercase tracking-[.18em] text-emerald-300">Тээвэрлэгч</div>
      <h1 className="mt-3 text-4xl font-semibold">Хүргэлтийн удирдлага</h1>
      <p className="mt-3 text-white/60">Төлбөр баталгаажсан захиалгаас эхлэн хүргэлтийн явцыг эндээс хянаж, төлөв шинэчилнэ.</p>
    </div>

    <div className="mt-6 grid gap-4 sm:grid-cols-3">
      <Summary icon={Truck} label="Одоо хүргэх захиалга" value={active.length} />
      <Summary icon={Clock3} label="Ачилт дутуу бараа" value={remainingItems} />
      <Summary icon={CheckCircle2} label="Хүргэж дууссан" value={completed.length} />
    </div>

    {deliveries.isLoading ? <Card className="mt-6 p-10 text-center text-slate-500">Хүргэлтүүдийг ачаалж байна...</Card> : deliveries.isError ? <Card className="mt-6 border-rose-200 p-6 text-rose-600">Хүргэлтийн мэдээлэл авахад алдаа гарлаа.</Card> : <>
      <section className="mt-8"><h2 className="text-2xl font-bold">Одоо хүргэх</h2><div className="mt-4 space-y-5">{active.length ? active.map((delivery) => <DeliveryCard key={delivery.id} delivery={delivery} updating={updateStatus.isPending} onStatus={(status) => updateStatus.mutate({ id: delivery.id, status })} />) : <Card className="p-8 text-center text-slate-500">Одоогоор хүргэх захиалга алга.</Card>}</div></section>
      <section className="mt-10"><h2 className="text-2xl font-bold">Өмнө хүргэж өгсөн</h2><div className="mt-4 space-y-5">{completed.length ? completed.map((delivery) => <DeliveryCard key={delivery.id} delivery={delivery} updating={false} onStatus={() => undefined} />) : <Card className="p-8 text-center text-slate-500">Хүргэж дууссан захиалга алга.</Card>}</div></section>
    </>}
  </div>
}

function Summary({ icon: Icon, label, value }: { icon: typeof Truck; label: string; value: number }) {
  return <Card className="p-5"><Icon className="size-6 text-emerald-600" /><div className="mt-3 text-3xl font-bold">{value}</div><div className="text-sm text-slate-500">{label}</div></Card>
}

function DeliveryCard({ delivery, updating, onStatus }: { delivery: Delivery; updating: boolean; onStatus: (status: DeliveryStatus) => void }) {
  return <Card className="overflow-hidden">
    <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
      <div><div className="flex flex-wrap items-center gap-2"><span className="text-lg font-bold">{delivery.orderNumber}</span><Badge variant={delivery.status === 'DELIVERED' ? 'green' : delivery.status === 'SHIPPED' ? 'blue' : 'amber'}>{statusLabels[delivery.status]}</Badge></div><div className="mt-2 text-xs text-slate-500">{new Date(delivery.createdAt).toLocaleString('mn-MN')}</div></div>
      {nextStatuses[delivery.status].length > 0 && <div className="flex flex-wrap gap-2">{nextStatuses[delivery.status].map((status) => <Button key={status} size="sm" variant={status === 'DELIVERED' ? 'default' : 'secondary'} loading={updating} disabled={updating} onClick={() => onStatus(status)}>{statusLabels[status]}</Button>)}</div>}
    </div>
    <div className="grid gap-6 p-5 lg:grid-cols-[.8fr_1.2fr]">
      <div className="space-y-2 text-sm"><div className="font-bold">{delivery.recipientName}</div><a href={`tel:${delivery.phone}`} className="flex items-center gap-2 text-slate-600 hover:text-emerald-700"><Phone className="size-4 text-emerald-600" />{delivery.phone}</a><div className="flex items-start gap-2 text-slate-600"><MapPin className="mt-0.5 size-4 shrink-0 text-emerald-600" />{delivery.city}, {delivery.district}, {delivery.address}</div></div>
      <div className="space-y-2">{delivery.items.map((item) => {
        const delivered = delivery.status === 'DELIVERED' ? item.quantity : 0
        const nowDelivering = delivery.status === 'DELIVERED' ? 0 : Math.max(0, item.quantity - item.backorderedQuantity)
        return <div key={item.id} className="grid gap-2 rounded-2xl bg-slate-50 p-3 text-sm sm:grid-cols-[1fr_auto_auto_auto] sm:items-center dark:bg-white/5"><div className="flex items-center gap-2 font-semibold"><PackageCheck className="size-4 text-emerald-600" />{item.product.name}</div><span>Хүргэсэн: <b className="text-emerald-700">{delivered}</b></span><span>Одоо хүргэх: <b className="text-blue-700">{nowDelivering}</b></span><span>Дутуу: <b className="text-rose-600">{item.backorderedQuantity}</b></span></div>
      })}</div>
    </div>
  </Card>
}
