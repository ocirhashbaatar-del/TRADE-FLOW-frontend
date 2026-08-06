import { Bell, Building2, CheckCircle2, Palette, Save, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePageTitle } from '@/hooks/use-page-title'
import { useTheme } from '@/contexts/theme-context'

type Settings = {
  company: string
  email: string
  phone: string
  address: string
  currency: string
  orderNotifications: boolean
  sellerNotifications: boolean
  lowStockNotifications: boolean
}

const defaults: Settings = { company: 'TradeFlow Global', email: 'admin@tradeflow.mn', phone: '+976 7000-1234', address: 'Сүхбаатар дүүрэг, Улаанбаатар', currency: 'MNT', orderNotifications: true, sellerNotifications: true, lowStockNotifications: true }

export default function AdminSettings() {
  usePageTitle('Админ тохиргоо')
  const { theme, setTheme } = useTheme()
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState<Settings>(() => {
    try { return { ...defaults, ...JSON.parse(localStorage.getItem('tradeflow-admin-settings') ?? '{}') as Partial<Settings> } }
    catch { return defaults }
  })

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => { setSaved(false); setSettings((current) => ({ ...current, [key]: value })) }
  const save = () => { localStorage.setItem('tradeflow-admin-settings', JSON.stringify(settings)); setSaved(true) }

  return <>
    <PageHeader eyebrow="Систем" title="Тохиргоо" description="Байгууллагын мэдээлэл, мэдэгдэл болон системийн харагдацыг удирдана." actions={<Button onClick={save}><Save className="size-4" />Хадгалах</Button>} />
    {saved && <div className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300"><CheckCircle2 className="size-4" />Тохиргоо амжилттай хадгалагдлаа.</div>}
    <div className="grid gap-5 xl:grid-cols-2">
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="size-5 text-brand-600" />Байгууллагын мэдээлэл</CardTitle></CardHeader><CardContent className="grid gap-5 sm:grid-cols-2">
        <Field label="Байгууллагын нэр"><Input value={settings.company} onChange={(event) => update('company', event.target.value)} /></Field>
        <Field label="Имэйл"><Input type="email" value={settings.email} onChange={(event) => update('email', event.target.value)} /></Field>
        <Field label="Утас"><Input value={settings.phone} onChange={(event) => update('phone', event.target.value)} /></Field>
        <Field label="Үндсэн валют"><select value={settings.currency} onChange={(event) => update('currency', event.target.value)} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"><option value="MNT">MNT — Монгол төгрөг</option><option value="USD">USD — US Dollar</option></select></Field>
        <div className="sm:col-span-2"><Field label="Хаяг"><Input value={settings.address} onChange={(event) => update('address', event.target.value)} /></Field></div>
      </CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Bell className="size-5 text-brand-600" />Мэдэгдлийн тохиргоо</CardTitle></CardHeader><CardContent className="space-y-3">
        <Toggle label="Шинэ захиалгын мэдэгдэл" description="Шинэ захиалга ирэхэд админд мэдэгдэнэ." checked={settings.orderNotifications} onChange={(value) => update('orderNotifications', value)} />
        <Toggle label="Хэрэглэгчийн эрхийн өөрчлөлт" description="Админ хэрэглэгчид role олгоход мэдэгдэнэ." checked={settings.sellerNotifications} onChange={(value) => update('sellerNotifications', value)} />
        <Toggle label="Нөөц багассан мэдэгдэл" description="Барааны үлдэгдэл босгоос доош ороход мэдэгдэнэ." checked={settings.lowStockNotifications} onChange={(value) => update('lowStockNotifications', value)} />
      </CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Palette className="size-5 text-brand-600" />Харагдац</CardTitle></CardHeader><CardContent><div className="grid grid-cols-3 gap-3">{(['light', 'dark', 'system'] as const).map((value) => <button key={value} type="button" onClick={() => setTheme(value)} className={`rounded-2xl border p-4 text-left transition ${theme === value ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30' : 'border-stone-200 dark:border-stone-800'}`}><div className={`h-16 rounded-xl ${value === 'dark' ? 'bg-slate-950' : value === 'light' ? 'border bg-white' : 'bg-gradient-to-r from-white to-slate-950'}`} /><div className="mt-3 text-sm font-semibold">{value === 'light' ? 'Гэрэлтэй' : value === 'dark' ? 'Харанхуй' : 'Систем'}</div></button>)}</div></CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="size-5 text-brand-600" />Аюулгүй байдал</CardTitle></CardHeader><CardContent><div className="rounded-2xl bg-stone-50 p-5 dark:bg-stone-950/40"><div className="font-semibold">Админы хамгаалалт</div><p className="mt-2 text-sm leading-6 text-stone-500">Role болон эрхийн тохиргоог тусдаа удирдлагын хэсгээс өөрчилнө.</p><Button variant="secondary" className="mt-4" onClick={() => window.location.assign('/admin/roles')}><ShieldCheck className="size-4" />Role тохируулах</Button></div></CardContent></Card>
    </div>
  </>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label>{label}</Label>{children}</div> }
function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-stone-200 p-4 dark:border-stone-800"><div><div className="font-semibold">{label}</div><div className="mt-1 text-xs text-stone-500">{description}</div></div><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-5 accent-emerald-600" /></label> }
