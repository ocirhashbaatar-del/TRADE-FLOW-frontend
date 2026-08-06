import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Crown, Globe2, Palette } from 'lucide-react'
import { FormEvent } from 'react'
import { apiClient } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/common/page-header'
import { useAuth } from '@/contexts/auth-context'
import { usePageTitle } from '@/hooks/use-page-title'

type Tenant = { id: string; name: string; slug: string; domain?: string; logo?: string; primaryColor: string; subscription: string; active: boolean }
export default function PlatformAdmin() {
  usePageTitle('Tenant branding ба Super Admin')
  const { user } = useAuth(), client = useQueryClient()
  const tenant = useQuery({ queryKey: ['admin', 'tenant'], queryFn: async () => (await apiClient.get<Tenant>('/admin/tenant')).data })
  const tenants = useQuery({ queryKey: ['platform', 'tenants'], enabled: Boolean(user?.platformAdmin), queryFn: async () => (await apiClient.get<Tenant[]>('/admin/platform/tenants')).data })
  const saveBrand = useMutation({ mutationFn: async (body: unknown) => apiClient.patch('/admin/tenant', body), onSuccess: async () => client.invalidateQueries({ queryKey: ['admin', 'tenant'] }) })
  const createTenant = useMutation({ mutationFn: async (body: unknown) => apiClient.post('/admin/platform/tenants', body), onSuccess: async () => client.invalidateQueries({ queryKey: ['platform', 'tenants'] }) })
  const branding = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data=new FormData(event.currentTarget); saveBrand.mutate({ name:data.get('name'), domain:data.get('domain') || null, logo:data.get('logo') || null, primaryColor:data.get('primaryColor') }) }
  const create = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data=new FormData(event.currentTarget); createTenant.mutate({ name:data.get('name'), slug:data.get('slug'), domain:data.get('domain') || undefined, primaryColor:data.get('primaryColor') }); event.currentTarget.reset() }
  return <><PageHeader eyebrow="MT-2 / FR-10" title="Tenant branding ба Super Admin" description="Custom domain, logo, үндсэн өнгө болон platform tenant удирдлага." /><div className="grid gap-6 xl:grid-cols-2"><Card className="p-6"><h2 className="flex items-center gap-2 text-xl font-bold"><Palette className="size-5 text-emerald-600" />Одоогийн tenant branding</h2>{tenant.data && <form onSubmit={branding} className="mt-5 space-y-3"><Input name="name" required defaultValue={tenant.data.name} /><Input name="domain" defaultValue={tenant.data.domain} placeholder="brand.mn" /><Input name="logo" defaultValue={tenant.data.logo} placeholder="Logo URL" /><label className="flex items-center gap-3 text-sm">Үндсэн өнгө<input name="primaryColor" type="color" defaultValue={tenant.data.primaryColor} /></label><div className="rounded-2xl p-5 text-white" style={{ backgroundColor: tenant.data.primaryColor }}>{tenant.data.name} branding preview</div><Button className="w-full" loading={saveBrand.isPending}>Branding хадгалах</Button></form>}</Card>{user?.platformAdmin ? <Card className="p-6"><h2 className="flex items-center gap-2 text-xl font-bold"><Crown className="size-5 text-amber-500" />Шинэ tenant үүсгэх</h2><form onSubmit={create} className="mt-5 space-y-3"><Input name="name" required placeholder="Байгууллагын нэр" /><Input name="slug" required pattern="[a-z0-9-]+" placeholder="tenant-slug" /><Input name="domain" placeholder="custom-domain.mn" /><input name="primaryColor" type="color" defaultValue="#059669" /><Button className="w-full" loading={createTenant.isPending}>Tenant үүсгэх</Button></form></Card> : <Card className="grid place-items-center p-8 text-slate-500">Platform Super Admin эрхгүй.</Card>}</div>{user?.platformAdmin && <Card className="mt-6 overflow-hidden"><div className="flex items-center gap-2 border-b p-5 font-bold"><Globe2 className="size-5" />Бүх tenant</div><div className="divide-y">{tenants.data?.map((row) => <div key={row.id} className="flex items-center justify-between p-4"><div><div className="font-bold">{row.name}</div><div className="text-xs text-slate-500">{row.slug} · {row.domain || 'domain-гүй'}</div></div><div>{row.subscription} · {row.active ? 'Идэвхтэй' : 'Идэвхгүй'}</div></div>)}</div></Card>}</>
}
