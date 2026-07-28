import { eventBus, type RealtimeEvent } from './eventBus'

export interface RealtimeAdapter {
  connect(): Promise<void>
  disconnect(): Promise<void>
  subscribe(listener: (event: RealtimeEvent) => void): () => void
  emit(event: RealtimeEvent): void
}

/**
 * Frontend-only adapter used until Socket.IO exists.
 * A future Socket.IO adapter only needs to implement this contract; providers and pages stay unchanged.
 */
class MockRealtimeAdapter implements RealtimeAdapter {
  async connect() { return Promise.resolve() }
  async disconnect() { return Promise.resolve() }
  subscribe(listener: (event: RealtimeEvent) => void) { return eventBus.subscribe(listener) }
  emit(event: RealtimeEvent) { eventBus.emit(event) }
}

export const realtimeAdapter: RealtimeAdapter = new MockRealtimeAdapter()
