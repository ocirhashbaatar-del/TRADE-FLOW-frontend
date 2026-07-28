import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'
export const Sheet = DialogPrimitive.Root
export const SheetTrigger = DialogPrimitive.Trigger
export function SheetContent({ children, side = 'right', className, title = 'Panel' }: { children: React.ReactNode; side?: 'left' | 'right'; className?: string; title?: string }) { return <DialogPrimitive.Portal><DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm"/><DialogPrimitive.Content className={cn('fixed inset-y-0 z-50 w-[88vw] max-w-md border-slate-200 bg-white p-5 shadow-float dark:border-slate-800 dark:bg-slate-900', side === 'right' ? 'right-0 border-l' : 'left-0 border-r', className)}><DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>{children}<DialogPrimitive.Close className="focus-ring absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="size-4" aria-hidden="true"/><span className="sr-only">Close panel</span></DialogPrimitive.Close></DialogPrimitive.Content></DialogPrimitive.Portal> }
