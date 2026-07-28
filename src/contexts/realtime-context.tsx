import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { RealtimeEvent } from '@/services/eventBus'
import { realtimeAdapter } from '@/services/realtimeAdapter'

interface RealtimeValue { connected: boolean; lastEvent: RealtimeEvent | null; events: RealtimeEvent[]; emitMock: (event: RealtimeEvent) => void }
const RealtimeContext = createContext<RealtimeValue | null>(null)
const mockEvents: RealtimeEvent[] = [
  { type: 'order.updated', payload: { orderId: 'TF-10492', status: 'Processing' }, timestamp: '' },
  { type: 'inventory.updated', payload: { sku: 'CCDL-200', stock: 8 }, timestamp: '' },
  { type: 'shipment.updated', payload: { shipmentId: 'SH-2098', status: 'Delayed' }, timestamp: '' },
]
export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<RealtimeEvent[]>([])
  const [connected] = useState(true)
  useEffect(() => { void realtimeAdapter.connect(); const unsubscribe = realtimeAdapter.subscribe((event) => setEvents((items) => [event, ...items].slice(0, 20))); return () => { unsubscribe(); void realtimeAdapter.disconnect() } }, [])
  useEffect(() => {
    const timer = window.setInterval(() => {
      const source = mockEvents[Math.floor(Math.random() * mockEvents.length)]
      realtimeAdapter.emit({ ...source, timestamp: new Date().toISOString() })
    }, 18000)
    return () => window.clearInterval(timer)
  }, [])
  const value = useMemo(() => ({ connected, lastEvent: events[0] ?? null, events, emitMock: (event: RealtimeEvent) => realtimeAdapter.emit(event) }), [connected, events])
  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>
}
export function useRealtime() { const value = useContext(RealtimeContext); if (!value) throw new Error('useRealtime must be used within RealtimeProvider'); return value }
