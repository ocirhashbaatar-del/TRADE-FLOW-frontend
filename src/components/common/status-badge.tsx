import { Badge } from '@/components/ui/badge'
import type { Status } from '@/types'
export function StatusBadge({ status }: { status: Status }) { const variant = status === 'Completed' || status === 'Active' ? 'green' : status === 'Pending' || status === 'Low stock' ? 'amber' : status === 'Delayed' || status === 'Cancelled' ? 'red' : status === 'Processing' ? 'blue' : 'default'; return <Badge variant={variant}>{status}</Badge> }
