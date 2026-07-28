import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800', className)} {...props} /> }
