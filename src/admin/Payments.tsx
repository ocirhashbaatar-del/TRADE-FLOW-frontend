import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { apiClient } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/common/page-header'

type Order = { id: string; orderNumber: string; total: number; paymentStatus: string }
type QPay = { invoiceId: string; amount: number; qrData: string; qrImage?: string; status: string }
type Transfer = { id: string; reference: string; amount: number; bankName: string; transferredAt: string; status: string; rejectionReason?: string }

export default function Payments() {
  const queryClient = useQueryClient()
  const [orderId, setOrderId] = useState('')
  const [qpay, setQpay] = useState<QPay | null>(null)
  const orders = useQuery({ queryKey: ['orders'], queryFn: async () => (await apiClient.get<Order[]>('/orders')).data })
  const transfers = useQuery({ queryKey: ['bank-transfers'], queryFn: async () => (await apiClient.get<Transfer[]>('/payments/bank-transfers')).data })
  const invoice = useMutation({ mutationFn: async () => (await apiClient.post<QPay>('/payments/qpay/invoice', { orderId })).data, onSuccess: setQpay })
  const review = useMutation({ mutationFn: async ({ id, action }: { id: string; action: 'approve' | 'reject' }) => (await apiClient.post(`/payments/bank-transfers/${id}/${action}`, action === 'reject' ? { reason: 'Нягтлан татгалзсан' } : {})).data, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bank-transfers'] }) })

  return <>
    <PageHeader eyebrow="FR-6.1.3 / FR-8.3" title="QPay ба банкны шилжүүлэг" description="Provider-оор баталгаажсан QPay төлбөр болон нягтлангийн хяналттай банкны шилжүүлэг." />
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-5">
        <h2 className="font-bold">QPay invoice</h2>
        <select value={orderId} onChange={(event) => { setOrderId(event.target.value); setQpay(null) }} className="mt-4 h-10 w-full rounded-xl border bg-transparent px-3">
          <option value="">Захиалга сонгох</option>
          {orders.data?.map((order) => <option key={order.id} value={order.id}>{order.orderNumber} · {Number(order.total).toLocaleString()}₮ · {order.paymentStatus}</option>)}
        </select>
        <Button className="mt-4" disabled={!orderId} loading={invoice.isPending} onClick={() => invoice.mutate()}>QPay invoice үүсгэх</Button>
        {qpay && <div className="mt-5 rounded-2xl bg-slate-950 p-5 text-white">
          <div className="font-bold">{Number(qpay.amount).toLocaleString()}₮</div>
          {qpay.qrImage ? <img src={qpay.qrImage} alt="QPay QR" className="mx-auto mt-3 max-h-64 rounded-xl bg-white p-3" /> : <div className="mt-3 break-all rounded-xl bg-white p-3 text-xs text-slate-900">{qpay.qrData}</div>}
          <div className="mt-2 text-xs text-white/60">Төлбөр callback ирэхэд QPay API-аас дахин шалгагдана.</div>
        </div>}
      </Card>
      <Card className="p-5">
        <h2 className="font-bold">Банкны шилжүүлгийн хяналт</h2>
        <div className="mt-4 space-y-3">
          {transfers.data?.map((row) => <div key={row.id} className="rounded-xl border p-4 text-sm">
            <div className="flex justify-between gap-3"><strong>{row.reference}</strong><span>{Number(row.amount).toLocaleString()}₮</span></div>
            <div className="mt-1 text-slate-500">{row.bankName} · {row.status}</div>
            {row.status === 'PENDING' && <div className="mt-3 flex gap-2"><Button loading={review.isPending} onClick={() => review.mutate({ id: row.id, action: 'approve' })}>Батлах</Button><Button variant="secondary" onClick={() => review.mutate({ id: row.id, action: 'reject' })}>Татгалзах</Button></div>}
          </div>)}
          {!transfers.data?.length && <div className="text-sm text-slate-500">Хүлээгдэж буй шилжүүлэг байхгүй.</div>}
        </div>
      </Card>
    </div>
  </>
}
