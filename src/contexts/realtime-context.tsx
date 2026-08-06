import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { RealtimeEvent } from '@/services/eventBus'
import { realtimeAdapter } from '@/services/realtimeAdapter'
import { useAuth } from '@/contexts/auth-context'

interface RealtimeValue { connected: boolean; lastEvent: RealtimeEvent | null; events: RealtimeEvent[] }
const RealtimeContext = createContext<RealtimeValue | null>(null)

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [events, setEvents] = useState<RealtimeEvent[]>([])
  const [connected, setConnected] = useState(false)

  useEffect(() => realtimeAdapter.subscribe((event) => {
    setEvents((items) => [event, ...items].slice(0, 50))
    const entityType = String(event.payload.entityType ?? '')
    if (event.type === 'order.updated') { void queryClient.invalidateQueries({ queryKey: ['deliveries'] }); void queryClient.invalidateQueries({ queryKey: ['orders'] }) }
    if (event.type === 'inventory.updated') { void queryClient.invalidateQueries({ queryKey: ['marketplace-catalog'] }); void queryClient.invalidateQueries({ queryKey: ['inventory'] }) }
    if (event.type === 'shipment.updated') void queryClient.invalidateQueries({ queryKey: ['deliveries'] })
    if (entityType) void queryClient.invalidateQueries({ predicate: (query) => query.queryKey.some((key) => String(key).toLowerCase().includes(entityType.toLowerCase())) })
    if (event.type === 'entity.updated') void queryClient.invalidateQueries()
  }), [queryClient])

  useEffect(() => {
    const token = localStorage.getItem('tradeflow-token')
    if (user && token) realtimeAdapter.connect(token, setConnected)
    else { realtimeAdapter.disconnect(); setConnected(false) }
    return () => realtimeAdapter.disconnect()
  }, [user])

  const value = useMemo(() => ({ connected, lastEvent: events[0] ?? null, events }), [connected, events])
  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>
}
export function useRealtime() { const value = useContext(RealtimeContext); if (!value) throw new Error('useRealtime must be used within RealtimeProvider'); return value }
