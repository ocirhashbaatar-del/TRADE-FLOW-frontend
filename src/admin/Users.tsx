import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Copy, UserPlus } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { apiClient } from '@/api/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/common/page-header'
import { usePageTitle } from '@/hooks/use-page-title'

type UserRow = { id: string; name: string; email: string; role: string; emailVerified: boolean; createdAt: string }
type Invite = { id: string; name: string; email: string; role: string; expiresAt: string; acceptedAt?: string; inviteUrl?: string }
const roles = ['ADMIN','MANAGER','EMPLOYEE','VENDOR','TRANSPORTER','ACCOUNTANT']

export default function AdminUsers() {
  usePageTitle('Ажилтан ба урилга')
  const client = useQueryClient(), [open, setOpen] = useState(false), [lastUrl, setLastUrl] = useState('')
  const users = useQuery({ queryKey: ['admin', 'users'], queryFn: async () => (await apiClient.get<UserRow[]>('/admin/users')).data })
  const invites = useQuery({ queryKey: ['admin', 'invitations'], queryFn: async () => (await apiClient.get<Invite[]>('/admin/invitations')).data })
  const invite = useMutation({ mutationFn: async (body: unknown) => (await apiClient.post<Invite>('/admin/invitations', body)).data, onSuccess: async (data) => { setLastUrl(data.inviteUrl ?? ''); setOpen(false); await client.invalidateQueries({ queryKey: ['admin', 'invitations'] }) } })
  const changeRole = useMutation({ mutationFn: async ({ id, role }: { id: string; role: string }) => apiClient.patch(`/admin/users/${id}`, { role }), onSuccess: async () => client.invalidateQueries({ queryKey: ['admin', 'users'] }) })
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); invite.mutate({ name: data.get('name'), email: data.get('email'), role: data.get('role') }) }
  return <><PageHeader eyebrow="FR-1.1" title="Ажилтан ба урилга" description="Ажилтныг email урилгаар tenant-д бүртгэж, role-ийг бодитоор удирдана." actions={<Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button><UserPlus className="size-4" />Ажилтан урих</Button></DialogTrigger><DialogContent title="Ажилтан урих"><h2 className="text-xl font-bold">Шинэ ажилтан урих</h2><form onSubmit={submit} className="mt-5 space-y-3"><Input name="name" required placeholder="Нэр" /><Input name="email" required type="email" placeholder="email@company.mn" /><select name="role" className="h-10 w-full rounded-xl border bg-transparent px-3">{roles.map((role) => <option key={role}>{role}</option>)}</select><Button className="w-full" loading={invite.isPending}>Урилга илгээх</Button></form></DialogContent></Dialog>} />{lastUrl && <Card className="mb-5 flex items-center gap-3 border-emerald-200 bg-emerald-50 p-4"><div className="min-w-0 flex-1 truncate text-sm text-emerald-800">Урилгын холбоос: {lastUrl}</div><Button size="sm" variant="secondary" onClick={() => void navigator.clipboard.writeText(lastUrl)}><Copy className="size-4" />Хуулах</Button></Card>}<Card className="overflow-hidden"><div className="border-b p-5 font-bold">Tenant хэрэглэгчид</div><div className="divide-y">{users.data?.map((row) => <div key={row.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"><div className="flex-1"><div className="font-bold">{row.name}</div><div className="text-xs text-slate-500">{row.email}</div></div><Badge variant={row.emailVerified ? 'green' : 'amber'}>{row.emailVerified ? 'Баталгаажсан' : 'Хүлээгдэж буй'}</Badge><select value={row.role} onChange={(event) => changeRole.mutate({ id: row.id, role: event.target.value })} className="h-9 rounded-xl border bg-transparent px-3 text-sm">{roles.concat('CUSTOMER').map((role) => <option key={role}>{role}</option>)}</select></div>)}</div></Card><Card className="mt-5 overflow-hidden"><div className="border-b p-5 font-bold">Илгээсэн урилгууд</div><div className="divide-y">{invites.data?.map((row) => <div key={row.id} className="flex items-center justify-between p-4"><div><div className="font-semibold">{row.name} · {row.email}</div><div className="text-xs text-slate-500">{row.role} · {new Date(row.expiresAt).toLocaleDateString('mn-MN')}</div></div><Badge variant={row.acceptedAt ? 'green' : 'amber'}>{row.acceptedAt ? 'Зөвшөөрсөн' : 'Хүлээгдэж буй'}</Badge></div>)}</div></Card></>
}
