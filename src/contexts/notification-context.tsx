import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type { NotificationItem } from '@/types'
import { useAuth } from './auth-context'
import { useRealtime } from './realtime-context'

interface NotificationValue { notifications: NotificationItem[]; unread: number; markAllRead: () => void; markRead: (id: string) => void; clear: () => void }
interface ApiNotification { id: string; title: string; description: string; type: string; read: boolean; createdAt: string }

const NotificationContext = createContext<NotificationValue | null>(null)
const toNotificationItem = (item: ApiNotification): NotificationItem => ({
  id: item.id,
  title: item.title,
  description: item.description,
  time: new Date(item.createdAt).toLocaleString('mn-MN'),
  read: item.read,
  type: item.type.toLowerCase() as NotificationItem['type'],
})

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const { lastEvent } = useRealtime()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) { setNotifications([]); return }
    let active = true
    void apiClient.get<ApiNotification[]>(endpoints.notifications).then(({ data }) => {
      if (active) setNotifications(data.map(toNotificationItem))
    }).catch(() => undefined)
    return () => { active = false }
  }, [user])

  useEffect(() => {
    if (!lastEvent) return
    const entity = String(lastEvent.payload.entityType ?? '')
    const action = String(lastEvent.payload.action ?? '')
    const directTitle = typeof lastEvent.payload.title === 'string' ? lastEvent.payload.title : undefined
    const directDescription = typeof lastEvent.payload.description === 'string' ? lastEvent.payload.description : undefined
    const rawType = String(lastEvent.payload.type ?? '')
    const item: NotificationItem = {
      id: String(lastEvent.payload.id ?? crypto.randomUUID()),
      title: directTitle ?? `${entity || 'Систем'} · ${action || 'Шинэчлэгдлээ'}`,
      description: directDescription ?? `${entity || 'Мэдээлэл'} #${String(lastEvent.payload.entityId ?? '')} realtime шинэчлэгдлээ.`,
      time: 'Дөнгөж сая',
      read: false,
      type: rawType
        ? rawType.toLowerCase() as NotificationItem['type']
        : lastEvent.type.startsWith('order') || lastEvent.type === 'notification.created' ? 'order'
          : lastEvent.type.startsWith('inventory') ? 'inventory'
            : lastEvent.type.startsWith('shipment') ? 'shipment' : 'system',
    }
    const timer = window.setTimeout(() => setNotifications((items) => items.some((existing) => existing.id === item.id) ? items : [item, ...items].slice(0, 50)), 0)
    return () => window.clearTimeout(timer)
  }, [lastEvent])

  const markAllRead = useCallback(() => {
    setNotifications((items) => items.map((item) => ({ ...item, read: true })))
    void apiClient.patch(`${endpoints.notifications}/read-all`).catch(() => undefined)
  }, [])
  const markRead = useCallback((id: string) => {
    setNotifications((items) => items.map((item) => item.id === id ? { ...item, read: true } : item))
    void apiClient.patch(`${endpoints.notifications}/${id}/read`).catch(() => undefined)
  }, [])
  const value = useMemo(() => ({ notifications, unread: notifications.filter((item) => !item.read).length, markAllRead, markRead, clear: () => setNotifications([]) }), [markAllRead, markRead, notifications])
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const value = useContext(NotificationContext)
  if (!value) throw new Error('useNotifications must be used within NotificationProvider')
  return value
}
