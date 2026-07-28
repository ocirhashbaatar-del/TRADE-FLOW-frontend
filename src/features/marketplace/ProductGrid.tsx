import type { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { EmptyState } from '@/components/common/empty-state'
export function ProductGrid({ products }: { products: Product[] }) { if (!products.length) return <EmptyState title="No products found" description="Try a different search phrase, category, or filter."/>; return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map((product,index) => <ProductCard key={product.id} product={product} index={index}/>)}</div> }
