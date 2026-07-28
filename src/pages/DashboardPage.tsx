import { useQuery } from '@tanstack/react-query'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowRight, FilePlus2, MessageSquare, PackagePlus, Plus, Radio, RefreshCw, Send, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { repositories } from '@/services/repositories'
import { PageHeader } from '@/components/common/page-header'
import { MetricCard } from '@/components/common/metric-card'
import { ChartCard } from '@/components/common/chart-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/common/status-badge'
import { DataTable } from '@/components/common/data-table'
import { LoadingState } from '@/components/common/loading-state'
import { currency } from '@/utils/format'
import type { Order, TableColumn } from '@/types'
import { useRealtime } from '@/contexts/realtime-context'
import { usePageTitle } from '@/hooks/use-page-title'

const pieColors = ['#2563eb', '#f59e0b', '#8b5cf6', '#cbd5e1']
const orderColumns: TableColumn<Order>[] = [
  { key: 'id', header: 'Order', render: (row) => <Link to={`/orders/${row.id}`} className="font-semibold text-brand-600 hover:text-brand-700">{row.id}</Link> },
  { key: 'customer', header: 'Customer', render: (row) => <div><div className="font-medium text-slate-900 dark:text-white">{row.customer}</div><div className="text-xs text-slate-400">{row.items} items</div></div> },
  { key: 'vendor', header: 'Vendor' },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status}/> },
  { key: 'total', header: 'Total', render: (row) => <span className="font-semibold">{currency.format(row.total)}</span> },
]

export default function DashboardPage() {
  usePageTitle('Dashboard')
  const { data, isLoading, refetch, isFetching } = useQuery({ queryKey: ['dashboard'], queryFn: () => repositories.dashboard.getSnapshot() })
  const { connected, lastEvent } = useRealtime()
  if (isLoading) return <LoadingState />
  const dashboard = {
    metrics: Array.isArray(data?.metrics) ? data.metrics : [],
    recentOrders: Array.isArray(data?.recentOrders) ? data.recentOrders : [],
    notifications: Array.isArray(data?.notifications) ? data.notifications : [],
    activities: Array.isArray(data?.activities) ? data.activities : [],
    salesSeries: Array.isArray(data?.salesSeries) ? data.salesSeries : [],
    inventorySeries: Array.isArray(data?.inventorySeries) ? data.inventorySeries : [],
  }
  return <>
    <PageHeader eyebrow="Control center" title="Good afternoon, Alex" description="Monitor revenue, fulfillment, inventory, suppliers, and live marketplace operations from one workspace." actions={<><div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"><Radio className="size-3.5 animate-pulse"/>{connected ? 'Live data ready' : 'Offline'}</div><Button variant="secondary" onClick={() => void refetch()}><RefreshCw className={`size-4 ${isFetching ? 'animate-spin' : ''}`}/>Refresh</Button><Button><Plus className="size-4"/>Create order</Button></>}/>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">{dashboard.metrics.map((metric, index) => <MetricCard key={metric.id} metric={metric} index={index}/>)}</div>
    <div className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_.85fr]">
      <ChartCard title="Revenue and order volume" description="Monthly enterprise and marketplace performance"><div className="h-80"><ResponsiveContainer width="100%" height="100%"><AreaChart data={dashboard.salesSeries} margin={{ left: -10, right: 12, top: 10 }}><defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={.28}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0"/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }}/><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `$${value/1000}k`}/><Tooltip contentStyle={{ borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 12px 30px rgba(15,23,42,.1)' }} formatter={(value) => currency.format(Number(value))}/><Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fill="url(#revenueFill)"/></AreaChart></ResponsiveContainer></div></ChartCard>
      <ChartCard title="Inventory health" description="Current stock distribution"><div className="grid items-center gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2"><div className="h-52"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={dashboard.inventorySeries} dataKey="value" innerRadius={58} outerRadius={82} paddingAngle={3}>{dashboard.inventorySeries.map((entry,index) => <Cell key={entry.name} fill={pieColors[index]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div><div className="space-y-3">{dashboard.inventorySeries.map((item,index) => <div key={item.name} className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{backgroundColor:pieColors[index]}}/><span className="text-slate-500">{item.name}</span></div><span className="font-semibold">{item.value}%</span></div>)}</div></div></ChartCard>
    </div>
    <div className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_.85fr]">
      <Card><CardHeader className="flex-row items-center justify-between"><div><CardTitle>Recent orders</CardTitle><p className="mt-1 text-sm text-slate-500">Latest enterprise and marketplace orders</p></div><Button asChild variant="ghost" size="sm"><Link to="/purchase-orders">View all<ArrowRight className="size-4"/></Link></Button></CardHeader><CardContent className="p-0"><DataTable columns={orderColumns} data={dashboard.recentOrders.slice(0,5)}/></CardContent></Card>
      <Card><CardHeader className="flex-row items-start justify-between"><div><CardTitle>Live operations</CardTitle><p className="mt-1 text-sm text-slate-500">Socket-ready event preview</p></div><Badge variant="green">Connected</Badge></CardHeader><CardContent><div className="rounded-xl border border-brand-100 bg-brand-50 p-4 dark:border-brand-900 dark:bg-brand-950/30"><div className="flex items-center gap-2 text-sm font-semibold text-brand-800 dark:text-brand-200"><Sparkles className="size-4"/>Latest event</div><div className="mt-3 text-sm text-slate-700 dark:text-slate-200">{lastEvent ? lastEvent.type : 'Waiting for the next mock event...'}</div><div className="mt-1 text-xs text-slate-400">{lastEvent?.timestamp ? new Date(lastEvent.timestamp).toLocaleTimeString() : 'Event bus initialized'}</div></div><div className="mt-5 space-y-4">{dashboard.activities.map((activity) => <div key={activity.id} className="flex gap-3"><div className={`mt-1 size-2.5 shrink-0 rounded-full ${activity.tone === 'green' ? 'bg-emerald-500' : activity.tone === 'amber' ? 'bg-amber-500' : activity.tone === 'violet' ? 'bg-violet-500' : 'bg-blue-500'}`}/><div><div className="text-sm font-medium text-slate-900 dark:text-white">{activity.title}</div><div className="mt-1 text-xs leading-5 text-slate-500">{activity.description}</div><div className="mt-1 text-[11px] text-slate-400">{activity.time}</div></div></div>)}</div></CardContent></Card>
    </div>
    <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <Card className="p-5"><div className="flex items-center justify-between"><div className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30"><FilePlus2 className="size-5"/></div><Badge variant="amber">14 pending</Badge></div><div className="mt-4 font-semibold">Pending approvals</div><p className="mt-1 text-sm leading-6 text-slate-500">Purchase orders and supplier applications need review.</p><Button variant="ghost" className="mt-3 px-0 text-brand-600">Review queue<ArrowRight className="size-4"/></Button></Card>
      <Card className="p-5"><div className="flex items-center justify-between"><div className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30"><MessageSquare className="size-5"/></div><Badge variant="blue">7 unread</Badge></div><div className="mt-4 font-semibold">Customer messages</div><p className="mt-1 text-sm leading-6 text-slate-500">High-priority account and delivery conversations.</p><Button variant="ghost" className="mt-3 px-0 text-brand-600">Open inbox<ArrowRight className="size-4"/></Button></Card>
      <Card className="p-5"><div className="flex items-center justify-between"><div className="grid size-10 place-items-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/30"><PackagePlus className="size-5"/></div><Badge variant="violet">Quick action</Badge></div><div className="mt-4 font-semibold">Add inventory</div><p className="mt-1 text-sm leading-6 text-slate-500">Create a SKU, set reorder rules, and assign a warehouse.</p><Button variant="ghost" className="mt-3 px-0 text-brand-600">Add product<ArrowRight className="size-4"/></Button></Card>
      <Card className="p-5"><div className="flex items-center justify-between"><div className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30"><Send className="size-5"/></div><Badge variant="green">96.8% on time</Badge></div><div className="mt-4 font-semibold">Create shipment</div><p className="mt-1 text-sm leading-6 text-slate-500">Assign a carrier and prepare tracking notifications.</p><Button variant="ghost" className="mt-3 px-0 text-brand-600">New shipment<ArrowRight className="size-4"/></Button></Card>
    </div>
  </>
}
