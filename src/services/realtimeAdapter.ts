import { io, type Socket } from 'socket.io-client'
import { eventBus, type RealtimeEvent } from './eventBus'

class SocketRealtimeAdapter {
  private socket: Socket | null = null

  connect(token: string, onConnectionChange?: (connected: boolean) => void) {
    this.disconnect()
    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/v1\/?$/, '') ?? 'http://localhost:4000'
    this.socket = io(baseUrl, { auth: { token }, transports: ['websocket', 'polling'], reconnection: true })
    this.socket.on('connect', () => onConnectionChange?.(true))
    this.socket.on('disconnect', () => onConnectionChange?.(false))
    this.socket.on('connect_error', () => onConnectionChange?.(false))
    this.socket.on('realtime:event', (event: RealtimeEvent) => eventBus.emit(event))
    this.socket.on('notification:new', (payload: Record<string, unknown>) => eventBus.emit({ type: 'notification.created', payload, timestamp: new Date().toISOString() }))
  }

  disconnect() { this.socket?.disconnect(); this.socket = null }
  subscribe(listener: (event: RealtimeEvent) => void) { return eventBus.subscribe(listener) }
}

export const realtimeAdapter = new SocketRealtimeAdapter()
