import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { TableColumn } from '@/types'

export function DataTable<T extends { id: string }>({ columns, data, emptyMessage = 'No records found.' }: { columns: TableColumn<T>[]; data: T[]; emptyMessage?: string }) {
  return <Table><TableHeader><TableRow>{columns.map((column) => <TableHead key={String(column.key)} className={column.className}>{column.header}</TableHead>)}<TableHead className="w-12"><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader><TableBody>{data.length ? data.map((row) => <TableRow key={row.id}>{columns.map((column) => <TableCell key={String(column.key)} className={column.className}>{column.render ? column.render(row) : String(row[column.key as keyof T] ?? '')}</TableCell>)}<TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={`Actions for ${row.id}`}><MoreHorizontal className="size-4"/></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>View details</DropdownMenuItem><DropdownMenuItem>Edit record</DropdownMenuItem><DropdownMenuItem>Export</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>) : <TableRow><TableCell colSpan={columns.length + 1} className="py-14 text-center text-slate-500">{emptyMessage}</TableCell></TableRow>}</TableBody></Table>
}
