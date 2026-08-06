import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import { Card, CardContent } from '@/components/ui/card'
import { LoadingState } from '@/components/common/loading-state'
import { usePageTitle } from '@/hooks/use-page-title'

type Portal = { customer: { name: string; creditLimit: number; creditUsed: number }; availableCredit: number; invoices: Array<{ id: string; code: string; total: number; status: string }>; orders: Array<{ id: string; orderNumber: string; total: number; status: string }> }
export default function B2BPortal() {
  usePageTitle('B2B харилцагчийн портал')
  const query = useQuery({ queryKey: ['b2b-portal'], queryFn: async () => (await apiClient.get<Portal>('/b2b/portal')).data })
  if (query.isLoading) return <LoadingState />
  if (!query.data) return <div className="mx-auto max-w-3xl p-10 text-center text-slate-500">B2B порталын эрх эсвэл мэдээлэл олдсонгүй.</div>
  const data = query.data
  return <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
    <div><div className="text-sm font-bold uppercase tracking-widest text-emerald-600">B2B Portal</div><h1 className="mt-2 text-4xl font-bold">{data.customer.name}</h1></div>
    <div className="grid gap-4 sm:grid-cols-3">{[['Зээлийн хязгаар', data.customer.creditLimit], ['Ашигласан зээл', data.customer.creditUsed], ['Боломжит зээл', data.availableCredit]].map(([label, value]) => <Card key={String(label)}><CardContent className="p-6"><div className="text-sm text-slate-500">{label}</div><div className="mt-2 text-2xl font-bold">{Number(value).toLocaleString()} ₮</div></CardContent></Card>)}</div>
    <section><h2 className="mb-3 text-xl font-bold">Миний захиалгууд</h2><div className="grid gap-3 md:grid-cols-2">{data.orders.map((row) => <Card key={row.id}><CardContent className="flex items-center justify-between p-5"><div><div className="font-bold">{row.orderNumber}</div><div className="text-sm text-slate-500">{row.status}</div></div><div className="font-bold">{Number(row.total).toLocaleString()} ₮</div></CardContent></Card>)}</div></section>
    <section><h2 className="mb-3 text-xl font-bold">Нэхэмжлэлүүд</h2><div className="grid gap-3 md:grid-cols-2">{data.invoices.map((row) => <Card key={row.id}><CardContent className="flex items-center justify-between p-5"><div><div className="font-bold">{row.code}</div><div className="text-sm text-slate-500">{row.status}</div></div><div className="font-bold">{Number(row.total).toLocaleString()} ₮</div></CardContent></Card>)}</div></section>
  </div>
}
