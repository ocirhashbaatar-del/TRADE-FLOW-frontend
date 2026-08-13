const mntNumber = new Intl.NumberFormat('mn-MN', { maximumFractionDigits: 0 })

export const currency = {
  format: (value: number | bigint) => `${mntNumber.format(value)} ₮`,
}
export const compactNumber = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
export const formatDate = (value: string | Date) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
export const delay = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms))
