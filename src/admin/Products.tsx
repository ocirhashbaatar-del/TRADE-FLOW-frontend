import { useMemo, useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, Boxes, Download, Hash, PackageCheck, Pencil, Plus, Search, Trash2, Upload } from 'lucide-react'
import { apiClient } from '@/api/client'
import { PageHeader } from '@/components/common/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/common/pagination'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingState } from '@/components/common/loading-state'
import { currency } from '@/utils/format'
import { usePageTitle } from '@/hooks/use-page-title'

type ManagedProduct = { id: string; sku: string | null; name: string; slug: string; categoryId: string; category: string; vendor: string; price: number; stock: number; image: string; description: string; featured: boolean; active: boolean; updatedAt: string }
type Category = { id: string; name: string; _count: { products: number } }
type ProductPage = { data: ManagedProduct[]; total: number; page: number; pageSize: number }
type FormState = { sku: string; name: string; categoryId: string; price: string; stock: string; image: string; description: string; featured: boolean; active: boolean }
const emptyForm: FormState = { sku: '', name: '', categoryId: '', price: '', stock: '', image: '', description: '', featured: false, active: true }
const slugify = (value: string) => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `product-${Date.now()}`

export default function AdminProducts() {
  usePageTitle('Барааны удирдлага')
  const client = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [form, setForm] = useState<FormState>(emptyForm)
  const [editing, setEditing] = useState<ManagedProduct | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [message, setMessage] = useState('')

  const products = useQuery({ queryKey: ['managed-products', page, appliedSearch], queryFn: async () => (await apiClient.get<ProductPage>('/products/manage', { params: { page, pageSize: 20, q: appliedSearch || undefined } })).data })
  const categories = useQuery({ queryKey: ['catalog', 'categories'], queryFn: async () => (await apiClient.get<Category[]>('/catalog/categories')).data })
  const refresh = async () => { await Promise.all([client.invalidateQueries({ queryKey: ['managed-products'] }), client.invalidateQueries({ queryKey: ['products'] })]) }
  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, sku: form.sku.trim().toUpperCase(), slug: editing?.slug ?? slugify(`${form.name}-${form.sku}`), price: Number(form.price), stock: Number(form.stock), description: form.description.trim() || `${form.name} бүтээгдэхүүн`, image: form.image.trim() || '/images/product-placeholder.svg', images: [], tags: [] }
      return editing ? apiClient.patch(`/products/${editing.id}`, payload) : apiClient.post('/products', payload)
    },
    onSuccess: async () => { setMessage(editing ? 'Барааны мэдээлэл шинэчлэгдлээ.' : 'Шинэ бараа амжилттай нэмэгдлээ.'); setDialogOpen(false); setEditing(null); setForm(emptyForm); await refresh() },
    onError: (error: any) => setMessage(error?.response?.data?.message ?? 'Бараа хадгалахад алдаа гарлаа.'),
  })
  const remove = useMutation({ mutationFn: async (id: string) => apiClient.delete(`/products/${id}`), onSuccess: refresh })
  const openCreate = () => { setEditing(null); setForm(emptyForm); setMessage(''); setDialogOpen(true) }
  const openEdit = (row: ManagedProduct) => { setEditing(row); setForm({ sku: row.sku ?? '', name: row.name, categoryId: row.categoryId, price: String(row.price), stock: String(row.stock), image: row.image, description: row.description, featured: row.featured, active: row.active }); setMessage(''); setDialogOpen(true) }
  const submit = (event: FormEvent) => { event.preventDefault(); setMessage(''); save.mutate() }
  const rows = products.data?.data ?? []
  const stats = useMemo(() => ({ total: products.data?.total ?? 0, active: rows.filter((row) => row.active).length, low: rows.filter((row) => row.active && row.stock <= 5).length, value: rows.reduce((sum, row) => sum + row.price * row.stock, 0) }), [products.data?.total, rows])
  const exportCsv = async () => { const response = await apiClient.get('/catalog/export.csv', { responseType: 'blob' }); const url = URL.createObjectURL(response.data as Blob), link = document.createElement('a'); link.href = url; link.download = 'tradeflow-products.csv'; link.click(); URL.revokeObjectURL(url) }

  if (products.isLoading || categories.isLoading) return <LoadingState />
  return <>
    <PageHeader eyebrow="Каталог ба нөөц" title="Барааны удирдлага" description="Барааны код, үнэ, үлдэгдэл болон ангиллыг нэг дороос удирдана. Барааны код зөвхөн ажилтны хэсэгт харагдана." actions={<><Button variant="secondary" onClick={() => void exportCsv()}><Download className="size-4" />CSV татах</Button><Button variant="secondary" onClick={() => window.location.assign('/admin/catalog')}><Upload className="size-4" />Импорт</Button><Button onClick={openCreate}><Plus className="size-4" />Бараа нэмэх</Button></>} />
    {message && <div className={`mb-5 rounded-2xl border p-4 text-sm font-semibold ${message.includes('алдаа') || message.includes('бүртгэлтэй') ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{message}</div>}
    <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">{[
      [Boxes, 'Нийт бараа', stats.total.toLocaleString(), 'Бүртгэлтэй SKU'],
      [PackageCheck, 'Идэвхтэй', stats.active.toLocaleString(), 'Энэ хуудасны'],
      [AlertTriangle, 'Бага үлдэгдэл', stats.low.toLocaleString(), '5 ба түүнээс доош'],
      [Hash, 'Нөөцийн үнэлгээ', currency.format(stats.value), 'Одоогийн хуудас'],
    ].map(([Icon, label, value, helper]) => { const C = Icon as typeof Boxes; return <Card key={String(label)} className="p-4 sm:p-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><C className="size-5" /></span><div className="min-w-0"><div className="truncate text-xs font-semibold text-slate-500">{String(label)}</div><div className="mt-1 text-xl font-bold sm:text-2xl">{String(value)}</div></div></div><div className="mt-3 text-xs text-slate-400">{String(helper)}</div></Card> })}</div>
    <Card className="overflow-hidden">
      <form onSubmit={(event) => { event.preventDefault(); setPage(1); setAppliedSearch(search.trim()) }} className="flex flex-col gap-3 border-b p-4 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Код эсвэл нэрээр хайх..." className="pl-10" /></div><Button type="submit" variant="secondary">Хайх</Button></form>
      <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-sm"><thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400"><tr><th className="p-4">Барааны код</th><th className="p-4">Бараа</th><th className="p-4">Ангилал</th><th className="p-4">Үнэ</th><th className="p-4">Үлдэгдэл</th><th className="p-4">Төлөв</th><th className="p-4 text-right">Үйлдэл</th></tr></thead><tbody className="divide-y">{rows.map((row) => <tr key={row.id} className="hover:bg-emerald-50/40"><td className="p-4"><span className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-mono text-xs font-bold text-slate-700">{row.sku ?? '—'}</span></td><td className="p-4"><div className="flex items-center gap-3"><img src={row.image} alt="" className="size-11 rounded-xl bg-slate-100 object-cover" /><div><div className="font-bold">{row.name}</div><div className="text-xs text-slate-400">{row.vendor}</div></div></div></td><td className="p-4">{row.category}</td><td className="p-4 font-semibold">{currency.format(row.price)}</td><td className="p-4"><span className={row.stock <= 5 ? 'font-bold text-rose-600' : 'font-semibold text-emerald-700'}>{row.stock}</span></td><td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${row.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{row.active ? 'Идэвхтэй' : 'Идэвхгүй'}</span></td><td className="p-4"><div className="flex justify-end gap-1"><Button size="sm" variant="ghost" onClick={() => openEdit(row)}><Pencil className="size-4" />Засах</Button><Button size="sm" variant="ghost" className="text-rose-600" disabled={remove.isPending} onClick={() => { if (confirm(`\"${row.name}\" барааг идэвхгүй болгох уу?`)) remove.mutate(row.id) }}><Trash2 className="size-4" />Идэвхгүй</Button></div></td></tr>)}</tbody></table>{rows.length === 0 && <div className="p-12 text-center text-slate-500">Бараа олдсонгүй.</div>}</div>
      <Pagination page={page} total={products.data?.total ?? 0} pageSize={products.data?.pageSize ?? 20} onPageChange={setPage} />
    </Card>
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent title={editing ? 'Бараа засах' : 'Бараа нэмэх'} className="max-w-2xl"><div className="pr-8"><h2 className="text-2xl font-bold">{editing ? 'Барааны мэдээлэл засах' : 'Шинэ бараа бүртгэх'}</h2><p className="mt-2 text-sm text-slate-500">SKU бол дотоод код тул customer дэлгүүрт харагдахгүй. Нөөцийн тоонд одоо бэлэн байгаа ширхэгийг оруулна.</p></div><form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Барааны код (SKU)"><Input required maxLength={64} value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })} placeholder="DRINK-001" className="font-mono uppercase" /></Field><Field label="Барааны нэр"><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field><Field label="Ангилал"><select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="h-10 w-full rounded-xl border bg-transparent px-3"><option value="">Ангилал сонгох</option>{categories.data?.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></Field><Field label="Борлуулах үнэ"><Input required min="1" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></Field><Field label={editing ? 'Одоогийн нөөцийн тоо' : 'Эхний нөөцийн тоо'}><Input required min="0" step="1" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Жишээ: 50" /></Field><Field label="Зургийн URL"><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." /></Field><div className="sm:col-span-2"><Field label="Тайлбар"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-24 w-full rounded-xl border bg-transparent p-3 text-sm" /></Field></div><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />Онцлох бараа</label><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />Идэвхтэй</label><div className="flex justify-end gap-2 sm:col-span-2"><Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>Болих</Button><Button type="submit" loading={save.isPending}>{editing ? 'Хадгалах' : 'Бараа нэмэх'}</Button></div></form></DialogContent></Dialog>
  </>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label>{label}</Label>{children}</div> }
