import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download, Plus, Upload } from 'lucide-react'
import { repositories } from '@/services/repositories'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SearchFilterBar } from '@/components/common/search-filter-bar'
import { DataTable } from '@/components/common/data-table'
import { Pagination } from '@/components/common/pagination'
import { StatusBadge } from '@/components/common/status-badge'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input, Textarea } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingState } from '@/components/common/loading-state'
import { currency, formatDate } from '@/utils/format'
import type { ModuleRecord, TableColumn } from '@/types'
import { usePageTitle } from '@/hooks/use-page-title'

export const moduleConfig = {
  inventory: { title: 'Inventory', eyebrow: 'Stock control', description: 'Manage SKU availability, reorder thresholds, valuation, and warehouse allocation.', create: 'Add inventory item', statLabel: 'Inventory value' },
  warehouses: { title: 'Warehouses', eyebrow: 'Facility network', description: 'Monitor capacity, transfers, teams, zones, and distribution center performance.', create: 'Add warehouse', statLabel: 'Network capacity' },
  suppliers: { title: 'Suppliers', eyebrow: 'Supplier management', description: 'Manage onboarding, compliance, contracts, performance, and sourcing relationships.', create: 'Invite supplier', statLabel: 'Supplier spend' },
  'purchase-orders': { title: 'Purchase orders', eyebrow: 'Procurement', description: 'Create, approve, issue, and track enterprise purchase orders across suppliers.', create: 'Create purchase order', statLabel: 'Committed spend' },
  finance: { title: 'Finance', eyebrow: 'Financial operations', description: 'Track receivables, vendor payouts, fees, reconciliations, and cash movement.', create: 'Create transaction', statLabel: 'Net cash flow' },
  customers: { title: 'Customers', eyebrow: 'Customer operations', description: 'Manage enterprise accounts, order activity, service health, and account ownership.', create: 'Add customer', statLabel: 'Customer revenue' },
  vendors: { title: 'Vendors', eyebrow: 'Marketplace operations', description: 'Control vendor verification, catalog quality, fulfillment, and marketplace payouts.', create: 'Invite vendor', statLabel: 'GMV managed' },
  shipping: { title: 'Shipping', eyebrow: 'Logistics', description: 'Plan shipments, carriers, documents, live tracking, and freight exceptions.', create: 'Create shipment', statLabel: 'Freight spend' },
  delivery: { title: 'Delivery', eyebrow: 'Last-mile operations', description: 'Track delivery commitments, routes, proof of delivery, and service performance.', create: 'Schedule delivery', statLabel: 'Delivered value' },
  returns: { title: 'Returns', eyebrow: 'Reverse logistics', description: 'Coordinate return authorizations, inspections, warehouse intake, and disposition.', create: 'Create return', statLabel: 'Return value' },
  refunds: { title: 'Refunds', eyebrow: 'Financial resolution', description: 'Review refund requests, approvals, payment status, and customer communication.', create: 'Create refund', statLabel: 'Refund volume' },
  reports: { title: 'Reports', eyebrow: 'Business intelligence', description: 'Generate, schedule, share, and export enterprise operational reports.', create: 'Create report', statLabel: 'Report coverage' },
  billing: { title: 'Billing', eyebrow: 'Subscription', description: 'Manage enterprise subscription, usage, invoices, payment methods, and plan controls.', create: 'Add payment method', statLabel: 'Monthly plan' },
} as const

type ModuleKey = keyof typeof moduleConfig
const columns: TableColumn<ModuleRecord>[] = [
  { key: 'id', header: 'ID', render: (row) => <span className="font-mono text-xs font-semibold text-brand-600">{row.id}</span> },
  { key: 'name', header: 'Record', render: (row) => <div><div className="font-semibold text-slate-900 dark:text-white">{row.name}</div><div className="mt-1 text-xs text-slate-400">{row.detail}</div></div> },
  { key: 'owner', header: 'Owner' },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status}/> },
  { key: 'amount', header: 'Amount', render: (row) => <span className="font-semibold">{currency.format(row.amount)}</span> },
  { key: 'updatedAt', header: 'Updated', render: (row) => formatDate(row.updatedAt) },
]

export default function EnterpriseModulePage({ module }: { module: ModuleKey }) {
  const config = moduleConfig[module]
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  usePageTitle(config.title)
  const { data, isLoading } = useQuery({ queryKey: ['enterprise', module, page], queryFn: () => repositories.enterprise.list(module, page, 8) })
  const filtered = useMemo(() => (data?.data ?? []).filter((item) => [item.id,item.name,item.owner,item.status].join(' ').toLowerCase().includes(search.toLowerCase())), [data, search])
  if (isLoading || !data) return <LoadingState/>
  const totalAmount = data.data.reduce((sum, item) => sum + item.amount, 0)
  return <>
    <PageHeader eyebrow={config.eyebrow} title={config.title} description={config.description} actions={<><Button variant="secondary"><Upload className="size-4"/>Import</Button><Button variant="secondary"><Download className="size-4"/>Export</Button><CreateRecordDialog label={config.create}/></>}/>
    <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[{label:'Total records',value:data.total.toString(),helper:'Across all active views'},{label:config.statLabel,value:currency.format(totalAmount*3),helper:'Mock period total'},{label:'Needs attention',value:'7',helper:'Pending or delayed'},{label:'Completion rate',value:'94.6%',helper:'+2.1% this period'}].map((stat)=><Card key={stat.label} className="p-5"><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{stat.label}</div><div className="mt-3 text-2xl font-bold tracking-tight">{stat.value}</div><div className="mt-2 text-xs text-slate-500">{stat.helper}</div></Card>)}
    </div>
    <Card><SearchFilterBar value={search} onChange={setSearch} placeholder={`Search ${config.title.toLowerCase()}...`}/><CardContent className="p-0"><DataTable columns={columns} data={filtered}/><Pagination page={page} total={data.total} pageSize={data.pageSize} onPageChange={setPage}/></CardContent></Card>
  </>
}

function CreateRecordDialog({ label }: { label: string }) { return <Dialog><DialogTrigger asChild><Button><Plus className="size-4"/>{label}</Button></DialogTrigger><DialogContent title={label}><h2 className="text-xl font-bold">{label}</h2><p className="mt-2 text-sm leading-6 text-slate-500">This reusable mock form is ready to connect to a repository mutation later.</p><form className="mt-6 space-y-4" onSubmit={(event)=>event.preventDefault()}><div className="space-y-2"><Label>Record name</Label><Input placeholder="Enter a name"/></div><div className="space-y-2"><Label>Owner</Label><Input placeholder="Assign an owner"/></div><div className="space-y-2"><Label>Notes</Label><Textarea placeholder="Add operational notes"/></div><div className="flex justify-end gap-2"><Button type="button" variant="secondary">Save draft</Button><Button type="submit">Create record</Button></div></form></DialogContent></Dialog> }
