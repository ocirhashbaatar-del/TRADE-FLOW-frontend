import { useEffect, useState } from 'react'
import { Building2, CheckCircle2, LockKeyhole, Palette, Save, User as UserIcon } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { useTheme } from '@/contexts/theme-context'
import { usePageTitle } from '@/hooks/use-page-title'
import { apiClient } from '@/api/client'

const tabs = [
  { id: 'profile', label: 'Хувийн мэдээлэл', icon: UserIcon },
  { id: 'security', label: 'Нууц үг', icon: LockKeyhole },
  { id: 'appearance', label: 'Харагдах байдал', icon: Palette },
] as const

export default function ProfilePage() {
  usePageTitle('Профайл тохиргоо')
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('profile')
  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [company, setCompany] = useState(user?.tenant ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { setName(user?.name ?? ''); setPhone(user?.phone ?? ''); setCompany(user?.tenant ?? '') }, [user])
  const notify = (text: string) => { setMessage(text); setError(''); window.setTimeout(() => setMessage(''), 3000) }
  const fail = (value: unknown) => setError((value as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Хадгалахад алдаа гарлаа.')

  const saveProfile = async () => {
    setSaving(true); setError('')
    try {
      await apiClient.patch('/auth/me', { name, phone: phone || null, ...(user?.role === 'Admin' ? { company } : {}) })
      window.dispatchEvent(new Event('tradeflow-auth-changed'))
      notify('Мэдээлэл амжилттай хадгалагдлаа.')
    } catch (reason) { fail(reason) } finally { setSaving(false) }
  }
  const changePassword = async () => {
    setError('')
    if (newPassword.length < 8) return setError('Шинэ нууц үг хамгийн багадаа 8 тэмдэгт байна.')
    if (newPassword !== confirmPassword) return setError('Шинэ нууц үг таарахгүй байна.')
    setSaving(true)
    try { await apiClient.patch('/auth/me/password', { currentPassword, newPassword }); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); notify('Нууц үг амжилттай солигдлоо.') }
    catch (reason) { fail(reason) } finally { setSaving(false) }
  }

  return <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-6">
    <PageHeader eyebrow="Миний бүртгэл" title="Профайл тохиргоо" description="Хувийн мэдээлэл, нууц үг болон харагдах байдлаа удирдана." />
    <div className="grid gap-5 lg:grid-cols-[230px_1fr]">
      <Card className="h-fit p-2">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setTab(id); setError(''); setMessage('') }} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${tab === id ? 'bg-orange-50 text-orange-700 dark:bg-orange-400/10 dark:text-orange-300' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'}`}><Icon className="size-4" />{label}</button>)}</Card>
      <Card><CardHeader><CardTitle>{tabs.find(item => item.id === tab)?.label}</CardTitle></CardHeader><CardContent>
        {message && <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700"><CheckCircle2 className="size-4" />{message}</div>}
        {error && <div className="mb-5 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-600">{error}</div>}
        {tab === 'profile' && <div className="max-w-2xl space-y-5">
          <div className="grid gap-5 sm:grid-cols-2"><Field label="Нэр"><Input value={name} onChange={e => setName(e.target.value)} /></Field><Field label="Имэйл"><Input value={user?.email ?? ''} disabled /></Field><Field label="Утас"><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Утасны дугаар" /></Field><Field label="Role"><Input value={user?.role ?? 'Customer'} disabled /></Field></div>
          <Field label="Байгууллагын нэр"><div className="relative"><Building2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input value={company} onChange={e => setCompany(e.target.value)} disabled={user?.role !== 'Admin'} className="pl-10" /></div>{user?.role !== 'Admin' && <p className="mt-2 text-xs text-slate-400">Байгууллагын нэрийг зөвхөн админ өөрчилнө.</p>}</Field>
          <div className="flex justify-end"><Button onClick={saveProfile} loading={saving}><Save className="size-4" /> Хадгалах</Button></div>
        </div>}
        {tab === 'security' && <div className="max-w-xl space-y-5"><Field label="Одоогийн нууц үг"><Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} /></Field><Field label="Шинэ нууц үг"><Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} /></Field><Field label="Шинэ нууц үг давтах"><Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} /></Field><div className="flex justify-end"><Button onClick={changePassword} loading={saving}>Нууц үг солих</Button></div></div>}
        {tab === 'appearance' && <div className="grid max-w-2xl gap-3 sm:grid-cols-3">{(['light', 'dark', 'system'] as const).map(value => <button key={value} onClick={() => setTheme(value)} className={`rounded-2xl border p-4 text-left ${theme === value ? 'border-orange-400 bg-orange-50 dark:bg-orange-400/10' : 'border-slate-200 dark:border-white/10'}`}><div className={`h-24 rounded-xl border ${value === 'dark' ? 'bg-slate-950' : value === 'light' ? 'bg-white' : 'bg-gradient-to-r from-white to-slate-950'}`} /><div className="mt-3 text-sm font-bold">{value === 'light' ? 'Гэрэлтэй' : value === 'dark' ? 'Харанхуй' : 'Систем'}</div></button>)}</div>}
      </CardContent></Card>
    </div>
  </div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label>{label}</Label>{children}</div> }
