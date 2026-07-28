export type RealtimeEvent = { type: 'order.updated' | 'inventory.updated' | 'shipment.updated' | 'wishlist.updated' | 'like.updated' | 'notification.created'; payload: Record<string, unknown>; timestamp: string }
type Listener = (event: RealtimeEvent) => void
class EventBus {
  private listeners = new Set<Listener>()
  emit(event: RealtimeEvent) { this.listeners.forEach((listener) => listener(event)) }
  subscribe(listener: Listener) { this.listeners.add(listener); return () => { this.listeners.delete(listener) } }
}
export const eventBus = new EventBus()
