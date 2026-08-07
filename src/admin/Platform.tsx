import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FormEvent, useState } from 'react'
import { apiClient } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/common/page-header'
import { useAuth } from '@/contexts/auth-context'

type Tenant = { id: string; name: string; slug: string; domain?: string; domainVerifiedAt?: string; primaryColor: string; subscription: string; active: boolean }
type Health = { status: string; tenants: number; activeTenants: number; users: number; products: number; orders: number; uptimeSeconds: number; memoryMb: number; plans: Record<string, { users: number; products: number; warehouses: number }> }
type Usage = { tenant: Tenant; usage: { users: number; products: number; warehouses: number }; limits: { users: number; products: number; warehouses: number } }

export default function PlatformAdmin() {
  const { user } = useAuth(), client = useQueryClient(), [dns, setDns] = useState('')
  const enabled = Boolean(user?.platformAdmin)
  const tenants = useQuery({ queryKey: ['platform', 'tenants'], enabled, queryFn: async () => (await apiClient.get<Tenant[]>('/admin/platform/tenants')).data })
  const health = useQuery({ queryKey: ['platform', 'health'], enabled, refetchInterval: 30000, queryFn: async () => (await apiClient.get<Health>('/admin/platform/health')).data })
  const usage = useQuery({ queryKey: ['platform', 'usage'], enabled, queryFn: async () => (await apiClient.get<Usage[]>('/admin/platform/usage')).data })
  const create = useMutation({ mutationFn: async (body: unknown) => apiClient.post('/admin/platform/tenants', body), onSuccess: () => client.invalidateQueries({ queryKey: ['platform'] }) })
  const domain = useMutation({ mutationFn: async ({ id, action }: { id: string; action: 'request' | 'verify' }) => (await apiClient.post(`/admin/platform/tenants/${id}/domain/${action}`)).data, onSuccess: (data: any) => { if (data?.value) setDns(`${data.name} TXT ${data.value}`); client.invalidateQueries({ queryKey: ['platform'] }) } })
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); create.mutate({ name: data.get('name'), slug: data.get('slug'), domain: data.get('domain') || undefined, primaryColor: '#059669' }) }
  return <div className="space-y-6"><PageHeader eyebrow="Platform" title="Platform health, domain ба багц" description="Tenant usage, subscription limit болон DNS ownership verification." />
    {!enabled ? <Card className="p-8">Platform admin эрхгүй.</Card> : <>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">{[['Tenant', health.data?.tenants], ['Идэвхтэй', health.data?.activeTenants], ['User', health.data?.users], ['Product', health.data?.products], ['Order', health.data?.orders], ['Memory MB', health.data?.memoryMb]].map(([label, value]) => <Card key={String(label)} className="p-4"><div className="text-xs text-slate-500">{label}</div><div className="mt-1 text-2xl font-bold">{value ?? 0}</div></Card>)}</div>
      <Card className="p-5"><h2 className="font-bold">Tenant үүсгэх</h2><form onSubmit={submit} className="mt-3 grid gap-3 md:grid-cols-4"><Input name="name" required placeholder="Нэр" /><Input name="slug" required placeholder="slug" /><Input name="domain" placeholder="shop.example.mn" /><Button loading={create.isPending}>Үүсгэх</Button></form></Card>
      {dns && <Card className="border-amber-200 bg-amber-50 p-4 font-mono text-sm">DNS дээр нэмнэ: {dns}</Card>}
      <Card className="overflow-auto"><table className="w-full min-w-[900px] text-sm"><thead><tr className="border-b"><th className="p-3 text-left">Tenant</th><th>Plan</th><th>Users</th><th>Products</th><th>Warehouses</th><th>Domain</th><th>Action</th></tr></thead><tbody>{usage.data?.map((row) => <tr key={row.tenant.id} className="border-b"><td className="p-3 font-bold">{row.tenant.name}</td><td>{row.tenant.subscription}</td><td>{row.usage.users}/{row.limits.users}</td><td>{row.usage.products}/{row.limits.products}</td><td>{row.usage.warehouses}/{row.limits.warehouses}</td><td>{row.tenant.domain ?? '-'} · {row.tenant.domainVerifiedAt ? 'Verified' : 'Unverified'}</td><td className="space-x-2"><Button variant="secondary" onClick={() => domain.mutate({ id: row.tenant.id, action: 'request' })}>TXT авах</Button><Button onClick={() => domain.mutate({ id: row.tenant.id, action: 'verify' })}>Шалгах</Button></td></tr>)}</tbody></table></Card>
    </>}
  </div>
}
