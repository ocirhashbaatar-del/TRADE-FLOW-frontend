import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

function RouteFallback() {
  return <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="flex items-center gap-3 text-sm font-semibold text-slate-500"><span className="size-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600"/>TradeFlow ачаалж байна...</div></div>
}

export default function App() {
  return <Suspense fallback={<RouteFallback />}><RouterProvider router={router} /></Suspense>
}
