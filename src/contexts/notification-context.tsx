import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { notifications as initialNotifications } from '@/services/mockDatabase'
import type { NotificationItem } from '@/types'
import { useRealtime } from './realtime-context'
interface NotificationValue { notifications: NotificationItem[]; unread: number; markAllRead: () => void; markRead: (id: string) => void; clear: () => void }
const NotificationContext = createContext<NotificationValue | null>(null)
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const { lastEvent } = useRealtime()
  useEffect(() => {
    if (!lastEvent) return
    const entity = String(lastEvent.payload.entityType ?? '')
    const action = String(lastEvent.payload.action ?? '')
    const directTitle = typeof lastEvent.payload.title === 'string' ? lastEvent.payload.title : undefined
    const directDescription = typeof lastEvent.payload.description === 'string' ? lastEvent.payload.description : undefined
    const item: NotificationItem = { id: String(lastEvent.payload.id ?? crypto.randomUUID()), title: directTitle ?? `${entity || 'Систем'} · ${action || 'Шинэчлэгдлээ'}`, description: directDescription ?? `${entity || 'Мэдээлэл'} #${String(lastEvent.payload.entityId ?? '')} realtime шинэчлэгдлээ.`, time: 'Дөнгөж сая', read: false, type: lastEvent.type.startsWith('order') ? 'order' : lastEvent.type.startsWith('inventory') ? 'inventory' : lastEvent.type.startsWith('shipment') ? 'shipment' : 'system' }
    const timer = window.setTimeout(() => setNotifications((items) => [item, ...items].slice(0, 15)), 0)
    return () => window.clearTimeout(timer)
  }, [lastEvent])
  const value = useMemo(() => ({ notifications, unread: notifications.filter((item) => !item.read).length, markAllRead: () => setNotifications((items) => items.map((item) => ({ ...item, read: true }))), markRead: (id: string) => setNotifications((items) => items.map((item) => item.id === id ? { ...item, read: true } : item)), clear: () => setNotifications([]) }), [notifications])
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
export function useNotifications() { const value = useContext(NotificationContext); if (!value) throw new Error('useNotifications must be used within NotificationProvider'); return value }
