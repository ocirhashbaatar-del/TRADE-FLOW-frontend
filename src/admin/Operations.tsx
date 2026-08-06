import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { apiClient } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/common/page-header'
import { LoadingState } from '@/components/common/loading-state'

const modules = {
  pricing: ['Үнэ ба урамшуулал', '/pricing/rules'],
  promotions: ['Promotion', '/pricing/promotions'],
  inventory: ['Агуулахын үлдэгдэл', '/inventory/balances'],
  movements: ['Нөөцийн хөдөлгөөн', '/inventory/movements'],
  suppliers: ['Нийлүүлэгчид', '/procurement/suppliers'],
  procurement: ['Худалдан авалтын захиалга', '/procurement/purchase-orders'],
  invoices: ['Нэхэмжлэл ба авлага', '/finance/invoices'],
  ledger: ['Санхүүгийн ledger', '/finance/ledger'],
  reports: ['Бодит тайлан', '/reports/sales'],
  customers: ['B2B харилцагчид', '/b2b/customers'],
  returns: ['Буцаалтын хүсэлт', '/fulfillment/returns'],
} as const

export default function Operations() {
  const key = (useParams().module ?? 'inventory') as keyof typeof modules
  const current = modules[key] ?? modules.inventory
  const query = useQuery({ queryKey: ['operations', key], queryFn: async () => (await apiClient.get<unknown[]>(current[1])).data })
  if (query.isLoading) return <LoadingState />
  const rows = Array.isArray(query.data) ? query.data : []
  return <>
    <PageHeader eyebrow="SCM удирдлага" title={current[0]} description="PostgreSQL дээрх бодит tenant өгөгдөл." actions={<Button variant="secondary" onClick={() => void query.refetch()}>Сэргээх</Button>} />
    <div className="mb-5 flex flex-wrap gap-2">{Object.entries(modules).map(([id, item]) => <Button key={id} asChild variant={id === key ? 'default' : 'secondary'} size="sm"><Link to={`/admin/operations/${id}`}>{item[0]}</Link></Button>)}</div>
    {query.isError && <div className="rounded-2xl bg-rose-50 p-4 text-rose-700">API мэдээлэл авахад алдаа гарлаа.</div>}
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{rows.map((raw, index) => { const row = raw as Record<string, unknown>; return <Card key={String(row.id ?? index)}><CardContent className="p-5"><div className="text-xs font-bold uppercase tracking-wider text-emerald-600">{String(row.code ?? row.status ?? current[0])}</div><div className="mt-2 truncate text-lg font-bold">{String(row.name ?? row.orderNumber ?? row.reference ?? row.productId ?? `Бичлэг ${index + 1}`)}</div><div className="mt-4 space-y-1 text-xs text-slate-500">{Object.entries(row).filter(([field, value]) => !['id', 'name'].includes(field) && ['string', 'number'].includes(typeof value)).slice(0, 6).map(([field, value]) => <div key={field} className="flex justify-between gap-3"><span>{field}</span><span className="truncate font-semibold">{String(value)}</span></div>)}</div></CardContent></Card> })}</div>
  </>
}
