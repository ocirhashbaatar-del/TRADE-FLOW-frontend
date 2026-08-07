import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import { Card, CardContent } from '@/components/ui/card'
import { LoadingState } from '@/components/common/loading-state'
import { usePageTitle } from '@/hooks/use-page-title'
import { ProductCard } from '@/components/ProductCard'
import { useCart } from '@/contexts/cart-context'
import type { Product } from '@/types'

type Portal = { customer: { name: string; creditLimit: number; creditUsed: number }; availableCredit: number; invoices: Array<{ id: string; code: string; total: number; status: string }>; orders: Array<{ id: string; orderNumber: string; total: number; status: string }> }

export default function B2BPortal() {
  usePageTitle('B2B харилцагчийн портал')
  const { savedProductIds, toggleSaved } = useCart()
  const query = useQuery({ queryKey: ['b2b-portal'], queryFn: async () => (await apiClient.get<Portal>('/b2b/portal')).data })
  const catalog = useQuery({ queryKey: ['b2b-catalog'], queryFn: async () => (await apiClient.get<Product[]>('/b2b/catalog')).data })
  if (query.isLoading) return <LoadingState />
  if (!query.data) return <div className="mx-auto max-w-3xl p-10 text-center text-slate-500">B2B порталын эрх эсвэл мэдээлэл олдсонгүй.</div>
  const data = query.data
  return <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
    <div><div className="text-sm font-bold uppercase tracking-widest text-emerald-600">B2B Portal</div><h1 className="mt-2 text-4xl font-bold">{data.customer.name}</h1></div>
    <div className="grid gap-4 sm:grid-cols-3">{[['Зээлийн хязгаар', data.customer.creditLimit], ['Ашигласан зээл', data.customer.creditUsed], ['Боломжит зээл', data.availableCredit]].map(([label, value]) => <Card key={String(label)}><CardContent className="p-6"><div className="text-sm text-slate-500">{label}</div><div className="mt-2 text-2xl font-bold">{Number(value).toLocaleString()} ₮</div></CardContent></Card>)}</div>
    <section>
      <div className="mb-3"><h2 className="text-xl font-bold">Гэрээт үнийн каталог</h2><p className="mt-1 text-sm text-slate-500">Танай байгууллага болон харилцагчийн бүлэгт тохирсон үнэ автоматаар харагдана.</p></div>
      {catalog.isLoading ? <div className="py-8 text-center text-slate-500">Каталог ачаалж байна...</div> : <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">{(catalog.data ?? []).map((product, index) => <div key={product.id}><ProductCard product={product} index={index} favorite={savedProductIds.includes(product.id)} onFavorite={() => toggleSaved(product.id)} detailPath={`/products/${product.id}?channel=B2B`} /><div className="mt-1 px-2 text-[11px] text-emerald-700">Үнэ: {product.priceSource?.startsWith('RULE:') ? 'гэрээт нөхцөл' : product.priceSource?.startsWith('PROMOTION:') ? 'урамшуулал' : 'жижиглэн'}</div></div>)}</div>}
    </section>
    <section><h2 className="mb-3 text-xl font-bold">Миний захиалгууд</h2><div className="grid gap-3 md:grid-cols-2">{data.orders.map((row) => <Card key={row.id}><CardContent className="flex items-center justify-between p-5"><div><div className="font-bold">{row.orderNumber}</div><div className="text-sm text-slate-500">{row.status}</div></div><div className="font-bold">{Number(row.total).toLocaleString()} ₮</div></CardContent></Card>)}</div></section>
    <section><h2 className="mb-3 text-xl font-bold">Нэхэмжлэлүүд</h2><div className="grid gap-3 md:grid-cols-2">{data.invoices.map((row) => <Card key={row.id}><CardContent className="flex items-center justify-between p-5"><div><div className="font-bold">{row.code}</div><div className="text-sm text-slate-500">{row.status}</div></div><div className="font-bold">{Number(row.total).toLocaleString()} ₮</div></CardContent></Card>)}</div></section>
  </div>
}
