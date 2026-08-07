import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ShieldCheck } from 'lucide-react'
import { apiClient } from '@/api/client'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/common/page-header'
import { usePageTitle } from '@/hooks/use-page-title'

type Permission = { id: string; role: string; module: string; canRead: boolean; canCreate: boolean; canUpdate: boolean; canDelete: boolean }
const roles = ['MANAGER','EMPLOYEE','VENDOR','TRANSPORTER','ACCOUNTANT']
const modules = ['dashboard','catalog','pricing','procurement','inventory','orders','fulfillment','finance','reports','customers','users','settings']
const actions = [['canRead','Унших'],['canCreate','Үүсгэх'],['canUpdate','Засах'],['canDelete','Устгах']] as const

export default function AdminRoles() {
  usePageTitle('RBAC эрхийн удирдлага')
  const client = useQueryClient()
  const query = useQuery({ queryKey: ['admin', 'permissions'], queryFn: async () => (await apiClient.get<Permission[]>('/admin/permissions')).data })
  const save = useMutation({ mutationFn: async (body: Omit<Permission, 'id'>) => apiClient.put('/admin/permissions', body), onSuccess: async () => client.invalidateQueries({ queryKey: ['admin', 'permissions'] }) })
  const value = (role: string, module: string): Omit<Permission, 'id'> => query.data?.find((row) => row.role === role && row.module === module) ?? { role, module, canRead: false, canCreate: false, canUpdate: false, canDelete: false }
  return <><PageHeader eyebrow="FR-1.2" title="Бодит RBAC permission editor" description="Энд хадгалсан CRUD эрх backend API дээр шууд хэрэгжинэ. ADMIN эрх үргэлж хамгаалагдана." /><Card className="overflow-auto"><table className="w-full min-w-[1100px] text-sm"><thead><tr className="border-b bg-slate-50"><th className="p-4 text-left">Role / Module</th>{modules.map((module) => <th key={module} className="p-3 text-center capitalize">{module}</th>)}</tr></thead><tbody>{roles.map((role) => <tr key={role} className="border-b align-top"><td className="p-4"><div className="flex items-center gap-2 font-bold"><ShieldCheck className="size-4 text-emerald-600" />{role}</div></td>{modules.map((module) => { const row = value(role, module); return <td key={module} className="p-2"><div className="grid grid-cols-2 gap-1">{actions.map(([field, label]) => <label key={field} title={label} className="flex cursor-pointer items-center gap-1 rounded-lg p-1 text-[10px] hover:bg-slate-50"><input type="checkbox" checked={row[field]} disabled={save.isPending} onChange={() => save.mutate({ ...row, [field]: !row[field] })} className="accent-emerald-600" />{label.slice(0, 2)}</label>)}</div></td> })}</tr>)}</tbody></table></Card><p className="mt-3 text-xs text-slate-500">Ун = унших, Үү = үүсгэх, За = засах, Ус = устгах. Өөрчлөлт бүр API-д автоматаар хадгалагдана.</p>{save.isError && <p className="mt-2 text-sm text-red-600">Эрх хадгалахад алдаа гарлаа. Дахин оролдоно уу.</p>}</>
}
