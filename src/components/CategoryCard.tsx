import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Category } from '@/types'

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      to={`/products?category=${encodeURIComponent(category.name)}`}
      className="group rounded-xl border border-stone-200 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-float dark:border-stone-800 dark:bg-stone-900"
    >
      <div className="text-2xl">{category.icon}</div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="font-semibold text-stone-900 dark:text-white">{category.name}</div>
          <div className="mt-1 text-xs text-stone-400">{category.count} бүтээгдэхүүн</div>
        </div>
        <ChevronRight className="size-4 text-stone-300 transition group-hover:translate-x-1 group-hover:text-brand-600" />
      </div>
    </Link>
  )
}

