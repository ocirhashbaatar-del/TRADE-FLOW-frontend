import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
export function ChartCard({ title, description, children, action }: { title: string; description?: string; children: React.ReactNode; action?: React.ReactNode }) { return <Card><CardHeader className="flex-row items-start justify-between"><div><CardTitle>{title}</CardTitle>{description && <CardDescription>{description}</CardDescription>}</div>{action ?? <Button variant="ghost" size="icon"><MoreHorizontal className="size-4"/></Button>}</CardHeader><CardContent>{children}</CardContent></Card> }
