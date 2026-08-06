import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download, Plus } from 'lucide-react'
import { repositories } from '@/services/repositories'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SearchFilterBar } from '@/components/common/search-filter-bar'
import { DataTable } from '@/components/common/data-table'
import { Pagination } from '@/components/common/pagination'
import { StatusBadge } from '@/components/common/status-badge'
import { LoadingState } from '@/components/common/loading-state'
import { currency, formatDate } from '@/utils/format'
import type { ModuleRecord, TableColumn } from '@/types'
import { usePageTitle } from '@/hooks/use-page-title'

const columns: TableColumn<ModuleRecord>[] = [
  {
    key: 'id',
    header: 'Захиалга',
    render: (row) => (
      <span className="font-mono text-xs font-semibold text-brand-600">{row.id}</span>
    ),
  },
  {
    key: 'name',
    header: 'Нэр',
    render: (row) => (
      <div>
        <div className="font-semibold text-stone-900 dark:text-white">{row.name}</div>
        <div className="mt-1 text-xs text-stone-400">{row.detail}</div>
      </div>
    ),
  },
  { key: 'owner', header: 'Эзэмшигч' },
  {
    key: 'status',
    header: 'Төлөв',
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: 'amount',
    header: 'Дүн',
    render: (row) => <span className="font-semibold">{currency.format(row.amount)}</span>,
  },
  {
    key: 'updatedAt',
    header: 'Огноо',
    render: (row) => <span className="text-xs text-stone-400">{formatDate(row.updatedAt)}</span>,
  },
]

export default function AdminOrders() {
  usePageTitle('Захиалгын удирдлага')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page],
    queryFn: () => repositories.enterprise.list('purchase-orders', page, 8),
  })

  const filtered = useMemo(
    () =>
      (data?.data ?? []).filter((item) =>
        [item.id, item.name, item.owner, item.status]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [data, search],
  )

  if (isLoading || !data) return <LoadingState />

  return (
    <>
      <PageHeader
        eyebrow="Захиалга"
        title="Захиалгын удирдлага"
        description="Бүх захиалгыг хянах, баталгаажуулах, тээвэрлэлтийг удирдах."
        actions={
          <>
            <Button variant="secondary">
              <Download className="size-4" /> Экспорт
            </Button>
            <Button>
              <Plus className="size-4" /> Захиалга үүсгэх
            </Button>
          </>
        }
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Нийт захиалга', value: '8,492', helper: 'Энэ сард' },
          { label: 'Гүйцэтгэгдсэн', value: '6,214', helper: '73.2%' },
          { label: 'Хүлээгдэж буй', value: '622', helper: 'Анхаарал шаардлагатай' },
          { label: 'Дундаж үнэ', value: currency.format(12480), helper: 'Захиалга бүрт' },
        ].map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-stone-400">
              {stat.label}
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight">{stat.value}</div>
            <div className="mt-2 text-xs text-stone-500">{stat.helper}</div>
          </Card>
        ))}
      </div>

      <Card>
        <SearchFilterBar
          value={search}
          onChange={setSearch}
          placeholder="Захиалга хайх..."
        />
        <CardContent className="p-0">
          <DataTable columns={columns} data={filtered} />
          <Pagination
            page={page}
            total={data.total}
            pageSize={data.pageSize}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </>
  )
}
