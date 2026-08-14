import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Copy, RefreshCw, Search, Trash2, UserPlus } from 'lucide-react'
import { type FormEvent, useMemo, useState } from 'react'
import { apiClient } from '@/api/client'
import { PageHeader } from '@/components/common/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import { usePageTitle } from '@/hooks/use-page-title'

type UserRow = { id: string; name: string; email: string; role: string; emailVerified: boolean; createdAt: string }
type Invite = { id: string; name: string; email: string; role: string; expiresAt: string; acceptedAt?: string; inviteUrl?: string }
const roles = ['ADMIN', 'MANAGER', 'EMPLOYEE', 'VENDOR', 'TRANSPORTER', 'ACCOUNTANT']
const errorMessage = (error: unknown) => axios.isAxiosError(error) ? String(error.response?.data?.message ?? error.message) : 'Үйлдэл амжилтгүй боллоо.'

export default function AdminUsers() {
  usePageTitle('Ажилтан ба урилга')
  const { user } = useAuth()
  const client = useQueryClient()
  const [open, setOpen] = useState(false)
  const [lastUrl, setLastUrl] = useState('')
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState('')

  const users = useQuery({ queryKey: ['admin', 'users'], queryFn: async () => (await apiClient.get<UserRow[]>('/admin/users')).data })
  const invites = useQuery({ queryKey: ['admin', 'invitations'], queryFn: async () => (await apiClient.get<Invite[]>('/admin/invitations')).data })
  const invite = useMutation({
    mutationFn: async (body: unknown) => (await apiClient.post<Invite>('/admin/invitations', body)).data,
    onSuccess: async (data) => { setLastUrl(data.inviteUrl ?? ''); setNotice('Урилга амжилттай үүслээ.'); setOpen(false); await client.invalidateQueries({ queryKey: ['admin', 'invitations'] }) },
  })
  const changeRole = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => apiClient.patch(`/admin/users/${id}`, { role }),
    onSuccess: async () => { setNotice('Хэрэглэгчийн role хадгалагдлаа.'); await client.invalidateQueries({ queryKey: ['admin', 'users'] }) },
  })
  const revoke = useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/admin/invitations/${id}`),
    onSuccess: async () => { setNotice('Урилгыг цуцаллаа.'); await client.invalidateQueries({ queryKey: ['admin', 'invitations'] }) },
  })
  const filteredUsers = useMemo(() => (users.data ?? []).filter((row) => `${row.name} ${row.email} ${row.role}`.toLowerCase().includes(search.toLowerCase())), [search, users.data])
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setNotice(''); const data = new FormData(event.currentTarget); invite.mutate({ name: data.get('name'), email: data.get('email'), role: data.get('role') }) }
  const failed = users.error ?? invites.error ?? invite.error ?? changeRole.error ?? revoke.error

  return <div className="space-y-5">
    <PageHeader eyebrow="FR-1.1" title="Ажилтан ба урилга" description="Tenant-ийн ажилтнуудыг урих, хайх, role солих болон хүлээгдэж буй урилгыг удирдана." actions={<Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button><UserPlus className="size-4" />Ажилтан урих</Button></DialogTrigger><DialogContent title="Ажилтан урих"><h2 className="text-xl font-bold">Шинэ ажилтан урих</h2><form onSubmit={submit} className="mt-5 space-y-3"><Input name="name" required minLength={2} placeholder="Нэр" /><Input name="email" required type="email" placeholder="email@company.mn" /><select name="role" className="h-10 w-full rounded-xl border bg-transparent px-3">{roles.map((role) => <option key={role}>{role}</option>)}</select>{invite.isError && <p className="text-sm text-red-600">{errorMessage(invite.error)}</p>}<Button className="w-full" loading={invite.isPending} disabled={invite.isPending}>Урилга илгээх</Button></form></DialogContent></Dialog>} />
    {notice && <Card className="border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</Card>}
    {failed && !invite.isError && <Card className="border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage(failed)} <Button size="sm" variant="secondary" className="ml-3" onClick={() => void Promise.all([users.refetch(), invites.refetch()])}><RefreshCw className="size-4" />Дахин оролдох</Button></Card>}
    {lastUrl && <Card className="flex items-center gap-3 border-emerald-200 bg-emerald-50 p-4"><div className="min-w-0 flex-1 truncate text-sm text-emerald-800">Урилгын холбоос: {lastUrl}</div><Button size="sm" variant="secondary" onClick={() => void navigator.clipboard.writeText(lastUrl)}><Copy className="size-4" />Хуулах</Button></Card>}
    <Card className="overflow-hidden"><div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center"><div className="flex-1 font-bold">Tenant хэрэглэгчид ({users.data?.length ?? 0})</div><label className="relative"><Search className="absolute left-3 top-2.5 size-4 text-slate-400" /><Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Нэр, email, role хайх" /></label></div>
      {users.isLoading ? <div className="p-8 text-center text-slate-500">Уншиж байна...</div> : filteredUsers.length === 0 ? <div className="p-8 text-center text-slate-500">Хэрэглэгч олдсонгүй.</div> : <div className="divide-y">{filteredUsers.map((row) => <div key={row.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"><div className="flex-1"><div className="font-bold">{row.name}{row.id === user?.id && <span className="ml-2 text-xs font-normal text-brand-600">Та</span>}</div><div className="text-xs text-slate-500">{row.email} · {new Date(row.createdAt).toLocaleDateString('mn-MN')}</div></div><Badge variant={row.emailVerified ? 'green' : 'amber'}>{row.emailVerified ? 'Баталгаажсан' : 'Хүлээгдэж буй'}</Badge><select value={row.role} disabled={changeRole.isPending || row.id === user?.id} onChange={(event) => changeRole.mutate({ id: row.id, role: event.target.value })} className="h-9 rounded-xl border bg-transparent px-3 text-sm">{roles.concat('CUSTOMER').map((role) => <option key={role}>{role}</option>)}</select></div>)}</div>}
    </Card>
    <Card className="overflow-hidden"><div className="border-b p-5 font-bold">Илгээсэн урилгууд ({invites.data?.length ?? 0})</div>{invites.isLoading ? <div className="p-8 text-center text-slate-500">Уншиж байна...</div> : !invites.data?.length ? <div className="p-8 text-center text-slate-500">Урилга алга.</div> : <div className="divide-y">{invites.data.map((row) => { const expired = !row.acceptedAt && new Date(row.expiresAt) < new Date(); return <div key={row.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"><div className="flex-1"><div className="font-semibold">{row.name} · {row.email}</div><div className="text-xs text-slate-500">{row.role} · {new Date(row.expiresAt).toLocaleDateString('mn-MN')} хүртэл</div></div><Badge variant={row.acceptedAt ? 'green' : 'amber'}>{row.acceptedAt ? 'Зөвшөөрсөн' : expired ? 'Хугацаа дууссан' : 'Хүлээгдэж буй'}</Badge>{!row.acceptedAt && <Button size="sm" variant="destructive" disabled={revoke.isPending} onClick={() => { if (window.confirm('Энэ урилгыг цуцлах уу?')) revoke.mutate(row.id) }}><Trash2 className="size-4" />Цуцлах</Button>}</div> })}</div>}</Card>
  </div>
}
