import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download, Pencil, Plus, Trash2, Upload } from 'lucide-react'
import { repositories } from '@/services/repositories'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SearchFilterBar } from '@/components/common/search-filter-bar'
import { DataTable } from '@/components/common/data-table'
import { Pagination } from '@/components/common/pagination'
import { StatusBadge } from '@/components/common/status-badge'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingState } from '@/components/common/loading-state'
import { currency } from '@/utils/format'
import type { ModuleRecord, Product, TableColumn } from '@/types'
import { usePageTitle } from '@/hooks/use-page-title'

const productColumns = (onEdit: (row: ModuleRecord) => void, onDelete: (id: string) => void): TableColumn<ModuleRecord>[] => [
  {
    key: 'id',
    header: 'ID',
    render: (row) => (
      <span className="font-mono text-xs font-semibold text-brand-600">{row.id}</span>
    ),
  },
  {
    key: 'name',
    header: 'Бүтээгдэхүүн',
    render: (row) => (
      <div>
        <div className="font-semibold text-stone-900 dark:text-white">{row.name}</div>
        <div className="mt-1 text-xs text-stone-400">{row.detail}</div>
      </div>
    ),
  },
  { key: 'owner', header: 'Эзэмшигч' },
  {
    key: 'status',
    header: 'Төлөв',
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: 'amount',
    header: 'Үнэ',
    render: (row) => <span className="font-semibold">{currency.format(row.amount)}</span>,
  },
  { key: 'actions', header: 'Үйлдэл', render: (row) => <div className="flex gap-1"><Button size="sm" variant="ghost" onClick={() => onEdit(row)}><Pencil className="size-4" />Засах</Button><Button size="sm" variant="ghost" className="text-rose-600" onClick={() => onDelete(row.id)}><Trash2 className="size-4" />Хасах</Button></div> },
]

export default function AdminProducts() {
  usePageTitle('Бүтээгдэхүүний удирдлага')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [removed, setRemoved] = useState<string[]>([])
  const [editing, setEditing] = useState<ModuleRecord | null>(null)
  const [editedNames, setEditedNames] = useState<Record<string, string>>({})
  const [added, setAdded] = useState<ModuleRecord[]>(() => {
    try { return (JSON.parse(localStorage.getItem('tradeflow-custom-products') ?? '[]') as Product[]).map((product) => ({ id: product.id, name: product.name, detail: product.category, owner: product.vendor, status: 'Active', amount: product.price, updatedAt: 'Өнөөдөр' })) }
    catch { return [] }
  })
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', stock: '', image: '' })
  const [imageError, setImageError] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['enterprise', 'inventory', page],
    queryFn: () => repositories.enterprise.list('inventory', page, 8),
  })

  const filtered = useMemo(
    () =>
      [...added, ...(data?.data ?? [])].filter((item) => !removed.includes(item.id)).map((item) => ({ ...item, name: editedNames[item.id] ?? item.name })).filter((item) =>
        [item.id, item.name, item.owner, item.status]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [data, search, removed, editedNames, added],
  )

  const columns = productColumns(setEditing, (id) => setRemoved((current) => [...current, id]))

  const chooseImage = (file?: File) => {
    setImageError('')
    if (!file) return
    if (!file.type.startsWith('image/')) { setImageError('Зөвхөн зураг сонгоно уу.'); return }
    if (file.size > 1_500_000) { setImageError('Зураг 1.5MB-аас бага байх шаардлагатай.'); return }
    const reader = new FileReader()
    reader.onload = () => setNewProduct((current) => ({ ...current, image: String(reader.result) }))
    reader.readAsDataURL(file)
  }

  const addProduct = () => {
    if (!newProduct.name.trim()) return
    const product: Product = { id: `custom-${Date.now()}`, name: newProduct.name.trim(), category: newProduct.category.trim() || 'Бусад', vendor: 'TradeFlow Seller', price: Number(newProduct.price) || 0, rating: 5, reviews: 0, stock: Number(newProduct.stock) || 0, image: newProduct.image || '/images/category-packaging.jpg', description: `${newProduct.name} бүтээгдэхүүн`, tags: [newProduct.category || 'Бусад'] }
    const stored = JSON.parse(localStorage.getItem('tradeflow-custom-products') ?? '[]') as Product[]
    localStorage.setItem('tradeflow-custom-products', JSON.stringify([product, ...stored]))
    setAdded((current) => [{ id: product.id, name: product.name, detail: product.category, owner: product.vendor, status: 'Active', amount: product.price, updatedAt: 'Өнөөдөр' }, ...current])
    setNewProduct({ name: '', category: '', price: '', stock: '', image: '' })
  }

  if (isLoading || !data) return <LoadingState />

  return (
    <>
      <PageHeader
        eyebrow="Бараа материал"
        title="Бүтээгдэхүүн"
        description="Бүтээгдэхүүний нөөц, үнэ, ангилалыг удирдах."
        actions={
          <>
            <Button variant="secondary">
              <Upload className="size-4" /> Импорт
            </Button>
            <Button variant="secondary">
              <Download className="size-4" /> Экспорт
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="size-4" /> Бүтээгдэхүүн нэмэх
                </Button>
              </DialogTrigger>
              <DialogContent title="Бүтээгдэхүүн нэмэх">
                <h2 className="text-xl font-bold">Бүтээгдэхүүн нэмэх</h2>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Шинэ бүтээгдэхүүний мэдээллийг бөглөнө үү.
                </p>
                <form className="mt-6 space-y-4" onSubmit={(event) => { event.preventDefault(); addProduct() }}>
                  <div className="space-y-2">
                    <Label>Бүтээгдэхүүний нэр</Label>
                    <Input required value={newProduct.name} onChange={(event) => setNewProduct((current) => ({ ...current, name: event.target.value }))} placeholder="Нэр оруулах" />
                  </div>
                  <div className="space-y-2">
                    <Label>Ангилал</Label>
                    <Input value={newProduct.category} onChange={(event) => setNewProduct((current) => ({ ...current, category: event.target.value }))} placeholder="Ангилал оруулах" />
                  </div>
                  <div className="space-y-2">
                    <Label>Үнэ</Label>
                    <Input type="number" value={newProduct.price} onChange={(event) => setNewProduct((current) => ({ ...current, price: event.target.value }))} placeholder="0.00" />
                  </div>
                  <div className="space-y-2"><Label>Нөөцийн тоо</Label><Input type="number" min="0" value={newProduct.stock} onChange={(event) => setNewProduct((current) => ({ ...current, stock: event.target.value }))} placeholder="0" /></div>
                  <div className="space-y-2"><Label>Зургийн URL</Label><Input type="url" value={newProduct.image.startsWith('data:') ? '' : newProduct.image} onChange={(event) => setNewProduct((current) => ({ ...current, image: event.target.value }))} placeholder="https://example.com/product.jpg" /></div>
                  <div className="relative flex items-center gap-3"><div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" /><span className="text-xs text-stone-400">эсвэл</span><div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" /></div>
                  <div className="space-y-2"><Label htmlFor="product-image">Folder-оос зураг сонгох</Label><Input id="product-image" type="file" accept="image/*" onChange={(event) => chooseImage(event.target.files?.[0])} />{imageError && <p className="text-xs text-rose-600">{imageError}</p>}</div>
                  {newProduct.image && <img src={newProduct.image} alt="Бүтээгдэхүүний preview" className="h-40 w-full rounded-2xl border border-stone-200 object-cover dark:border-stone-800" />}
                  <div className="flex justify-end gap-2">
                    <Button type="submit">Бүтээгдэхүүн нэмэх</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Нийт бүтээгдэхүүн', value: data.total.toString(), helper: 'Бүх идэвхтэй' },
          { label: 'Нийт үнэ', value: currency.format(684000), helper: 'Бараа материалын дүн' },
          { label: 'Анхаарал шаардлагатай', value: '7', helper: 'Нөөц дутуу' },
          { label: 'Гүйцэтгэл', value: '94.6%', helper: '+2.1% энэ сард' },
        ].map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-stone-400">
              {stat.label}
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight">{stat.value}</div>
            <div className="mt-2 text-xs text-stone-500">{stat.helper}</div>
          </Card>
        ))}
      </div>

      <Card>
        <SearchFilterBar
          value={search}
          onChange={setSearch}
          placeholder="Бүтээгдэхүүн хайх..."
        />
        <CardContent className="p-0">
          <DataTable columns={columns} data={filtered} />
          <Pagination
            page={page}
            total={data.total}
            pageSize={data.pageSize}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
      <Dialog open={Boolean(editing)} onOpenChange={(open) => { if (!open) setEditing(null) }}><DialogContent title="Бүтээгдэхүүн засах"><h2 className="text-xl font-bold">Бүтээгдэхүүн засах</h2><div className="mt-5 space-y-2"><Label>Бүтээгдэхүүний нэр</Label><Input key={editing?.id} defaultValue={editing?.name} onChange={(event) => editing && setEditedNames((current) => ({ ...current, [editing.id]: event.target.value }))} /></div><div className="mt-5 flex justify-end"><Button onClick={() => setEditing(null)}>Хадгалах</Button></div></DialogContent></Dialog>
    </>
  )
}
