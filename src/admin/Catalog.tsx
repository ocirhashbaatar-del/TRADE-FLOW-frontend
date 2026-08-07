import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Download, FolderTree, Upload } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { apiClient } from '@/api/client'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { usePageTitle } from '@/hooks/use-page-title'

type Category = { id: string; name: string; slug: string; parentId?: string; _count: { products: number } }
type Product = { id: string; name: string }
type Variant = { id: string; sku: string; name: string; barcode?: string; options: Record<string, string>; price?: number; active: boolean }
type Warehouse = { id: string; name: string }
type VariantInput = { sku: FormDataEntryValue | null; barcode?: FormDataEntryValue; name: FormDataEntryValue | null; options: Record<string, string>; price?: number; warehouseId?: string; initialStock: number }

const parseCsv = (text: string) => {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean)
  const split = (line: string) => {
    const out: string[] = []; let value = ''; let quoted = false
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i]
      if (char === '"' && line[i + 1] === '"') { value += '"'; i += 1 }
      else if (char === '"') quoted = !quoted
      else if (char === ',' && !quoted) { out.push(value); value = '' }
      else value += char
    }
    out.push(value); return out
  }
  const headers = split(lines[0] ?? '')
  return lines.slice(1).map((line) => Object.fromEntries(headers.map((header, index) => [header, split(line)[index] ?? ''])))
}

export default function CatalogAdmin() {
  usePageTitle('Каталог, ангилал, хувилбар')
  const client = useQueryClient()
  const [productId, setProductId] = useState('')
  const [message, setMessage] = useState('')
  const categories = useQuery({ queryKey: ['catalog', 'categories'], queryFn: async () => (await apiClient.get<Category[]>('/catalog/categories')).data })
  const products = useQuery({ queryKey: ['marketplace-catalog'], queryFn: async () => (await apiClient.get<Product[]>('/products')).data })
  const variants = useQuery({ queryKey: ['catalog', 'variants', productId], enabled: Boolean(productId), queryFn: async () => (await apiClient.get<Variant[]>(`/catalog/products/${productId}/variants`)).data })
  const warehouses = useQuery({ queryKey: ['inventory', 'warehouses'], queryFn: async () => (await apiClient.get<Warehouse[]>('/inventory/warehouses')).data })
  const categoryAction = useMutation({ mutationFn: async (body: unknown) => apiClient.post('/catalog/categories', body), onSuccess: async () => client.invalidateQueries({ queryKey: ['catalog', 'categories'] }) })
  const variantAction = useMutation({
    mutationFn: async ({ warehouseId, initialStock, ...body }: VariantInput) => {
      const { data: variant } = await apiClient.post<Variant>(`/catalog/products/${productId}/variants`, body)
      if (initialStock > 0 && warehouseId) await apiClient.post('/inventory/adjustments', { warehouseId, productId, variantId: variant.id, quantity: initialStock, reason: 'Variant initial stock' })
      return variant
    },
    onSuccess: async () => {
      setMessage('Хувилбар, үнэ болон эхний үлдэгдэл амжилттай бүртгэгдлээ.')
      await Promise.all([client.invalidateQueries({ queryKey: ['catalog', 'variants', productId] }), client.invalidateQueries({ queryKey: ['inventory'] })])
    },
  })
  const submitCategory = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const data = new FormData(event.currentTarget)
    categoryAction.mutate({ name: data.get('name'), slug: data.get('slug'), parentId: data.get('parentId') || null }); event.currentTarget.reset()
  }
  const submitVariant = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const data = new FormData(event.currentTarget)
    const options = Object.fromEntries(String(data.get('options')).split(',').map((part) => part.split('=').map((item) => item.trim())).filter((part) => part.length === 2))
    variantAction.mutate({ sku: data.get('sku'), barcode: data.get('barcode') || undefined, name: data.get('name'), options, price: data.get('price') ? Number(data.get('price')) : undefined, warehouseId: String(data.get('warehouseId') || ''), initialStock: Number(data.get('initialStock') || 0) }); event.currentTarget.reset()
  }
  const importFile = async (file?: File) => {
    if (!file) return
    try { const rows = parseCsv(await file.text()); const { data } = await apiClient.post<{ imported: number }>('/catalog/import', rows); setMessage(`${data.imported} бараа импортлогдлоо.`); await client.invalidateQueries() }
    catch { setMessage('CSV импортын формат буруу байна.') }
  }
  const exportCsv = async () => { const response = await apiClient.get('/catalog/export.csv', { responseType: 'blob' }); const url = URL.createObjectURL(response.data as Blob); const link = document.createElement('a'); link.href = url; link.download = 'tradeflow-products.csv'; link.click(); URL.revokeObjectURL(url) }
  const tree = (parentId?: string, level = 0): React.ReactNode => categories.data?.filter((row) => (row.parentId ?? undefined) === parentId).map((row) => <div key={row.id}><div className="flex items-center justify-between border-b p-3" style={{ paddingLeft: 12 + level * 24 }}><div><span className="font-semibold">{row.name}</span><span className="ml-2 text-xs text-slate-400">/{row.slug}</span></div><span className="text-xs">{row._count.products} бараа</span></div>{tree(row.id, level + 1)}</div>)

  return <>
    <PageHeader eyebrow="FR-2" title="Каталогийн удирдлага" description="Олон түвшний ангилал, бүтээгдэхүүний хувилбар, үнэ, үлдэгдэл болон CSV import/export." actions={<><Button variant="secondary" onClick={() => void exportCsv()}><Download className="size-4" />Экспорт</Button><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"><Upload className="size-4" />Импорт<input type="file" accept=".csv,text/csv" hidden onChange={(event) => void importFile(event.target.files?.[0])} /></label></>} />
    {message && <div className="mb-5 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">{message}</div>}
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="space-y-5">
        <Card className="p-5"><h2 className="flex items-center gap-2 font-bold"><FolderTree className="size-5 text-emerald-600" />Ангилал нэмэх</h2><form onSubmit={submitCategory} className="mt-4 grid gap-3 sm:grid-cols-2"><Input name="name" required placeholder="Ангиллын нэр" /><Input name="slug" required pattern="[a-z0-9-]+" placeholder="slug" /><select name="parentId" className="h-10 rounded-xl border bg-transparent px-3 sm:col-span-2"><option value="">Үндсэн ангилал</option>{categories.data?.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select><Button className="sm:col-span-2" loading={categoryAction.isPending}>Ангилал үүсгэх</Button></form></Card>
        <Card className="overflow-hidden"><div className="border-b p-5 font-bold">Ангиллын мод</div>{tree()}</Card>
      </div>
      <div className="space-y-5">
        <Card className="p-5"><h2 className="font-bold">Бүтээгдэхүүний хувилбар</h2><select value={productId} onChange={(event) => setProductId(event.target.value)} className="mt-4 h-10 w-full rounded-xl border bg-transparent px-3"><option value="">Бараа сонгох</option>{products.data?.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select>{productId && <form onSubmit={submitVariant} className="mt-3 space-y-3"><Input name="name" required placeholder="Хувилбарын нэр (500мл, Улаан...)" /><Input name="sku" required placeholder="SKU" /><Input name="barcode" placeholder="Штрих код" /><Input name="options" required placeholder="size=500ml,color=red" /><Input name="price" type="number" min={0.01} step="0.01" placeholder="Тусгай үнэ (заавал биш)" /><select name="warehouseId" className="h-10 w-full rounded-xl border bg-transparent px-3"><option value="">Эхний үлдэгдэлгүй</option>{warehouses.data?.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select><Input name="initialStock" type="number" min={0} defaultValue={0} placeholder="Эхний үлдэгдэл" /><Button className="w-full" loading={variantAction.isPending}>Хувилбар нэмэх</Button></form>}</Card>
        <Card className="overflow-hidden"><div className="border-b p-5 font-bold">Хувилбарууд</div><div className="divide-y">{variants.data?.map((row) => <div key={row.id} className="p-4"><div className="font-semibold">{row.name}</div><div className="text-xs text-slate-500">SKU: {row.sku}{row.price ? ` · ${row.price.toLocaleString()}₮` : ''} · {Object.entries(row.options).map(([key, value]) => `${key}: ${value}`).join(' · ')}</div></div>)}</div></Card>
      </div>
    </div>
  </>
}
