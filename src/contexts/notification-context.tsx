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
    const item: NotificationItem = { id: crypto.randomUUID(), title: lastEvent.type.split('.').map((part) => part[0].toUpperCase() + part.slice(1)).join(' '), description: 'A live mock event was received by the real-time provider.', time: 'Just now', read: false, type: lastEvent.type.startsWith('order') ? 'order' : lastEvent.type.startsWith('inventory') ? 'inventory' : 'shipment' }
    setNotifications((items) => [item, ...items].slice(0, 15))
  }, [lastEvent])
  const value = useMemo(() => ({ notifications, unread: notifications.filter((item) => !item.read).length, markAllRead: () => setNotifications((items) => items.map((item) => ({ ...item, read: true }))), markRead: (id: string) => setNotifications((items) => items.map((item) => item.id === id ? { ...item, read: true } : item)), clear: () => setNotifications([]) }), [notifications])
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
export function useNotifications() { const value = useContext(NotificationContext); if (!value) throw new Error('useNotifications must be used within NotificationProvider'); return value }
