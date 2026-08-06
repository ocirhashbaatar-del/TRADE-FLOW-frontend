import { useQuery } from '@tanstack/react-query'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowRight, Plus, Radio, RefreshCw } from 'lucide-react'
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

const orderColumns: TableColumn<Order>[] = [
  {
    key: 'id',
    header: 'Захиалга',
    render: (row) => (
      <Link to={`/orders/${row.id}`} className="font-semibold text-brand-600 hover:text-brand-700">
        {row.id}
      </Link>
    ),
  },
  {
    key: 'customer',
    header: 'Харилцагч',
    render: (row) => (
      <div>
        <div className="font-medium text-stone-900 dark:text-white">{row.customer}</div>
        <div className="text-xs text-stone-400">{row.items} бүтээгдэхүүн</div>
      </div>
    ),
  },
  { key: 'vendor', header: 'Нийлүүлэгч' },
  {
    key: 'status',
    header: 'Төлөв',
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: 'total',
    header: 'Дүн',
    render: (row) => <span className="font-semibold">{currency.format(row.total)}</span>,
  },
]

export default function AdminDashboard() {
  usePageTitle('Админ хянах самбар')
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => repositories.dashboard.getSnapshot(),
  })
  const { connected, lastEvent } = useRealtime()

  if (isLoading) return <LoadingState />

  const dashboard = {
    metrics: Array.isArray(data?.metrics) ? data.metrics : [],
    recentOrders: Array.isArray(data?.recentOrders) ? data.recentOrders : [],
    activities: Array.isArray(data?.activities) ? data.activities : [],
    salesSeries: Array.isArray(data?.salesSeries) ? data.salesSeries : [],
  }

  return (
    <>
      <PageHeader
        eyebrow="Хяналтын төв"
        title="Админ хянах самбар"
        description="Орлого, гүйцэтгэл, бараа материал болон шуурхай үйл ажиллагааг хянах."
        actions={
          <>
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
              <Radio className="size-3.5 animate-pulse" />
              {connected ? 'Шуурхай мэдээ' : 'Офлайн'}
            </div>
            <Button variant="secondary" onClick={() => void refetch()}>
              <RefreshCw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} />
              Сэргээх
            </Button>
            <Button>
              <Plus className="size-4" /> Захиалга үүсгэх
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {dashboard.metrics.map((metric, index) => (
          <MetricCard key={metric.id} metric={metric} index={index} />
        ))}
      </div>

      <div className="mt-5">
        <ChartCard
          title="Орлого ба захиалгын хэмжээ"
          description="Сүүлийн 6 сарын гүйцэтгэл"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard.salesSeries} margin={{ left: -10, right: 12, top: 10 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 14,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 12px 30px rgba(15,23,42,.1)',
                  }}
                  formatter={(value) => currency.format(Number(value))}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fill="url(#revenueFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_.85fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Сүүлийн захиалгууд</CardTitle>
              <p className="mt-1 text-sm text-stone-500">Хамгийн сүүлийн захиалгууд</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/orders">
                Бүгдийг харах <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable columns={orderColumns} data={dashboard.recentOrders.slice(0, 5)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-start justify-between">
            <div>
              <CardTitle>Шуурхай үйл ажиллагаа</CardTitle>
              <p className="mt-1 text-sm text-stone-500">Шуурхай мэдээний харагдац</p>
            </div>
            <Badge variant="green">Холбогдсон</Badge>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-brand-100 bg-brand-50 p-4 dark:border-brand-900 dark:bg-brand-950/30">
              <div className="text-sm font-semibold text-brand-800 dark:text-brand-200">
                Сүүлийн үйл явдал
              </div>
              <div className="mt-3 text-sm text-stone-700 dark:text-stone-200">
                {lastEvent ? lastEvent.type : 'Дараагийн үйл явдлыг хүлээж байна...'}
              </div>
              <div className="mt-1 text-xs text-stone-400">
                {lastEvent?.timestamp
                  ? new Date(lastEvent.timestamp).toLocaleTimeString()
                  : 'Үйл явдлын автобус эхэлсэн'}
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {dashboard.activities.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div
                    className={`mt-1 size-2.5 shrink-0 rounded-full ${
                      activity.tone === 'green'
                        ? 'bg-emerald-500'
                        : activity.tone === 'amber'
                          ? 'bg-amber-500'
                          : activity.tone === 'violet'
                            ? 'bg-violet-500'
                            : 'bg-blue-500'
                    }`}
                  />
                  <div>
                    <div className="text-sm font-medium text-stone-900 dark:text-white">
                      {activity.title}
                    </div>
                    <div className="mt-1 text-xs leading-5 text-stone-500">
                      {activity.description}
                    </div>
                    <div className="mt-1 text-[11px] text-stone-400">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
