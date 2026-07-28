import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircle } from 'lucide-react'
import { cn } from '@/utils/cn'

const buttonVariants = cva('focus-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[.98]', {
  variants: {
    variant: {
      default: 'bg-brand-600 text-white shadow-sm hover:bg-brand-700 hover:shadow-md',
      secondary: 'border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
      ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
      outline: 'border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-300',
    },
    size: { sm: 'h-9 px-3', md: 'h-10 px-4', lg: 'h-12 px-5 text-base', icon: 'size-10 p-0' },
  },
  defaultVariants: { variant: 'default', size: 'md' },
})

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean; loading?: boolean }
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, loading, children, ...props }, ref) => {
  const styles = cn(buttonVariants({ variant, size }), className)

  // Radix Slot requires exactly one child. Rendering a conditional loader beside
  // a Link made every `asChild` button vulnerable to a runtime white screen.
  if (asChild) return <Slot className={styles} ref={ref} {...props}>{children}</Slot>

  return <button className={styles} ref={ref} {...props}>{loading && <LoaderCircle className="size-4 animate-spin" />}{children}</button>
})
Button.displayName = 'Button'
