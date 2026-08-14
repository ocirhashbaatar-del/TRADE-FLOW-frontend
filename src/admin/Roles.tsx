import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { RefreshCw, ShieldCheck } from 'lucide-react'
import { apiClient } from '@/api/client'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePageTitle } from '@/hooks/use-page-title'

type Permission = { id: string; role: string; module: string; canRead: boolean; canCreate: boolean; canUpdate: boolean; canDelete: boolean }
type EditablePermission = Omit<Permission, 'id'>
const roles = ['MANAGER', 'EMPLOYEE', 'VENDOR', 'TRANSPORTER', 'ACCOUNTANT', 'CUSTOMER']
const modules = ['dashboard', 'catalog', 'pricing', 'procurement', 'inventory', 'orders', 'fulfillment', 'finance', 'reports', 'customers', 'users', 'settings']
const actions = [['canRead', 'Унших'], ['canCreate', 'Үүсгэх'], ['canUpdate', 'Засах'], ['canDelete', 'Устгах']] as const
const errorMessage = (error: unknown) => axios.isAxiosError(error) ? String(error.response?.data?.message ?? error.message) : 'Эрх хадгалахад алдаа гарлаа.'

export default function AdminRoles() {
  usePageTitle('RBAC эрхийн удирдлага')
  const client = useQueryClient()
  const query = useQuery({ queryKey: ['admin', 'permissions'], queryFn: async () => (await apiClient.get<Permission[]>('/admin/permissions')).data })
  const save = useMutation({ mutationFn: async (body: EditablePermission) => apiClient.put('/admin/permissions', body), onSuccess: async () => client.invalidateQueries({ queryKey: ['admin', 'permissions'] }) })
  const value = (role: string, module: string): EditablePermission => query.data?.find((row) => row.role === role && row.module === module) ?? { role, module, canRead: false, canCreate: false, canUpdate: false, canDelete: false }
  const toggle = (row: EditablePermission, field: typeof actions[number][0]) => {
    const next = { ...row, [field]: !row[field] }
    if (field === 'canRead' && row.canRead) Object.assign(next, { canCreate: false, canUpdate: false, canDelete: false })
    if (field !== 'canRead' && !row[field]) next.canRead = true
    save.mutate(next)
  }

  return <div className="space-y-4"><PageHeader eyebrow="FR-1.2" title="RBAC эрхийн удирдлага" description="Role бүрийн module тус бүр дээрх CRUD эрхийг тохируулна. Өөрчлөлт backend дээр шууд хэрэгжинэ." />
    {query.isError && <Card className="border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage(query.error)} <Button size="sm" variant="secondary" className="ml-3" onClick={() => void query.refetch()}><RefreshCw className="size-4" />Дахин оролдох</Button></Card>}
    {save.isError && <Card className="border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage(save.error)}</Card>}
    <Card className="overflow-auto">{query.isLoading ? <div className="p-10 text-center text-slate-500">Эрхийн тохиргоог уншиж байна...</div> : <table className="w-full min-w-[1100px] text-sm"><thead><tr className="border-b bg-slate-50 dark:bg-slate-900"><th className="sticky left-0 bg-slate-50 p-4 text-left dark:bg-slate-900">Role / Module</th>{modules.map((module) => <th key={module} className="p-3 text-center capitalize">{module}</th>)}</tr></thead><tbody>{roles.map((role) => <tr key={role} className="border-b align-top"><td className="sticky left-0 bg-white p-4 dark:bg-slate-950"><div className="flex items-center gap-2 font-bold"><ShieldCheck className="size-4 text-emerald-600" />{role}</div></td>{modules.map((module) => { const row = value(role, module); return <td key={module} className="p-2"><div className="grid grid-cols-2 gap-1">{actions.map(([field, label]) => <label key={field} title={label} className="flex cursor-pointer items-center gap-1 rounded-lg p-1 text-[10px] hover:bg-slate-50"><input type="checkbox" checked={row[field]} disabled={save.isPending} onChange={() => toggle(row, field)} className="accent-emerald-600" />{label.slice(0, 2)}</label>)}</div></td> })}</tr>)}</tbody></table>}</Card>
    <p className="text-xs text-slate-500">Ун = унших, Үү = үүсгэх, За = засах, Ус = устгах. Үүсгэх/засах/устгах эрх сонгоход унших эрх автоматаар нэмэгдэнэ. ADMIN эрх хамгаалагдсан.</p>
  </div>
}
