import { useMemo } from 'react'
import { useRealtime } from '@/contexts/realtime-context'
import type { RealtimeEvent } from '@/services/eventBus'

function useEventsByType(type: RealtimeEvent['type']) {
  const { events } = useRealtime()
  return useMemo(() => events.filter((event) => event.type === type), [events, type])
}

export const useLiveOrders = () => useEventsByType('order.updated')
export const useLiveInventory = () => useEventsByType('inventory.updated')
export const useLiveShipments = () => useEventsByType('shipment.updated')
export const useLiveWishlist = () => useEventsByType('wishlist.updated')
export const useLiveLikes = () => useEventsByType('like.updated')
