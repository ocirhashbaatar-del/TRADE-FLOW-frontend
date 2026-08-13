import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Product, ProductVariant } from '@/types'
import { apiClient } from '@/api/client'
import { useAuth } from '@/contexts/auth-context'

export type CartItem = Product & { qty: number; productId?: string; variantId?: string; variant?: ProductVariant }

type ShoppingState = { cart: CartItem[]; savedProductIds: string[] }
type CartContextValue = {
  items: CartItem[]
  savedProductIds: string[]
  itemCount: number
  lastAdded: Product | null
  drawerOpen: boolean
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void
  updateQty: (id: string, delta: number) => void
  setItemQty: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  toggleSaved: (id: string) => void
  clearLastAdded: () => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const guestCartKey = 'tradeflow-cart-guest'
const guestSavedKey = 'tradeflow-saved-guest-v2'
const userCartKey = (userId: string) => `tradeflow-cart-user-${userId}`
const readGuest = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) ?? '') as T }
  catch { return fallback }
}
const mergeCartItems = (base: CartItem[], incoming: CartItem[]) => {
  const merged = new Map<string, CartItem>()
  const registerItem = (item: CartItem) => {
    const key = item.variant ? `${item.productId ?? item.id}:${item.variant.id}` : (item.productId ?? item.id)
    const existing = merged.get(key)
    if (existing) {
      merged.set(key, { ...existing, qty: existing.qty + item.qty, price: existing.price })
      return
    }
    merged.set(key, { ...item, id: key, productId: item.productId ?? item.id, variantId: item.variant?.id, variant: item.variant })
  }
  base.forEach(registerItem)
  incoming.forEach(registerItem)
  return Array.from(merged.values())
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [cartOwnerId, setCartOwnerId] = useState<string | null>(null)
  const [savedProductIds, setSavedProductIds] = useState<string[]>([])
  const [lastAdded, setLastAdded] = useState<Product | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    localStorage.removeItem('tradeflow-favorites')
    localStorage.removeItem('tradeflow-saved-guest')
  }, [])

  const loadUserState = useCallback(async () => {
    if (!user) return
    const { data } = await apiClient.get<ShoppingState>('/shopping')
    const localCart = readGuest<CartItem[]>(userCartKey(user.id), [])
    const mergedCart = mergeCartItems(data.cart, localCart)
    setItems(mergedCart)
    setSavedProductIds(data.savedProductIds)
    localStorage.setItem(userCartKey(user.id), JSON.stringify(mergedCart))
    localStorage.removeItem(guestCartKey)
  }, [user])

  useEffect(() => {
    if (authLoading) return
    setLastAdded(null)
    setDrawerOpen(false)
    if (user) {
      const userCart = readGuest<CartItem[]>(userCartKey(user.id), [])
      setItems(userCart)
      setCartOwnerId(user.id)
      setSavedProductIds([])
      void loadUserState().catch(() => undefined)
    } else {
      setItems([])
      setCartOwnerId('guest')
      setSavedProductIds([])
      localStorage.removeItem(guestCartKey)
      localStorage.removeItem(guestSavedKey)
    }
  }, [authLoading, loadUserState, user])

  useEffect(() => {
    if (!authLoading && !user && cartOwnerId === 'guest') localStorage.removeItem(guestCartKey)
  }, [authLoading, cartOwnerId, items, user])
  useEffect(() => {
    if (!authLoading && user && cartOwnerId === user.id) localStorage.setItem(userCartKey(user.id), JSON.stringify(items))
  }, [authLoading, cartOwnerId, items, user])
  useEffect(() => {
    if (!authLoading && !user) localStorage.setItem(guestSavedKey, JSON.stringify(savedProductIds))
  }, [authLoading, savedProductIds, user])

  const reportSyncError = (error: unknown) => console.error('Cart sync failed', error)
  const value = useMemo<CartContextValue>(() => ({
    items,
    savedProductIds,
    itemCount: items.reduce((total, item) => total + item.qty, 0),
    lastAdded,
    drawerOpen,
    addItem: (product, quantity = 1, variant) => {
      if (!user) return
      const available = variant?.stock ?? product.stock
      const safeQuantity = Math.max(1, Math.min(available, Math.floor(quantity)))
      const itemId = variant ? `${product.id}:${variant.id}` : product.id
      setItems((current) => {
        const existing = current.find((item) => item.id === itemId)
        return existing ? current.map((item) => item.id === itemId ? { ...item, qty: Math.min(available, item.qty + safeQuantity) } : item) : [...current, { ...product, id: itemId, productId: product.id, variantId: variant?.id, variant, price: variant?.price ?? product.price, stock: available, qty: safeQuantity }]
      })
      if (user) void apiClient.post(`/shopping/cart/${product.id}`, { quantity: safeQuantity, variantId: variant?.id }).catch(reportSyncError)
      setLastAdded(product)
      setDrawerOpen(true)
    },
    updateQty: (id, delta) => {
      const current = items.find((item) => item.id === id)
      if (!current) return
      const quantity = Math.max(1, Math.min(current.stock, current.qty + delta))
      setItems((rows) => rows.map((item) => item.id === id ? { ...item, qty: quantity } : item))
      if (user) void apiClient.patch(`/shopping/cart/${current.productId ?? id}`, { quantity, variantId: current.variantId }).catch(reportSyncError)
    },
    setItemQty: (id, requested) => {
      const current = items.find((item) => item.id === id)
      if (!current) return
      const quantity = Math.max(1, Math.min(current.stock, Math.floor(Number(requested) || 1)))
      setItems((rows) => rows.map((item) => item.id === id ? { ...item, qty: quantity } : item))
      if (user) void apiClient.patch(`/shopping/cart/${current.productId ?? id}`, { quantity, variantId: current.variantId }).catch(reportSyncError)
    },
    removeItem: (id) => {
      const current = items.find((item) => item.id === id)
      setItems((rows) => rows.filter((item) => item.id !== id))
      if (user && current) void apiClient.delete(`/shopping/cart/${current.productId ?? id}`, { params: { variantId: current.variantId } }).catch(reportSyncError)
    },
    clearCart: () => {
      setItems([]); setLastAdded(null); setDrawerOpen(false)
      if (user) void apiClient.delete('/shopping/cart').catch(reportSyncError)
    },
    toggleSaved: (id) => {
      const saved = savedProductIds.includes(id)
      setSavedProductIds((current) => saved ? current.filter((item) => item !== id) : [...current, id])
      if (user) void (saved ? apiClient.delete(`/shopping/saved/${id}`) : apiClient.put(`/shopping/saved/${id}`)).catch(reportSyncError)
    },
    clearLastAdded: () => setLastAdded(null),
    openCart: () => setDrawerOpen(true),
    closeCart: () => setDrawerOpen(false),
  }), [drawerOpen, items, lastAdded, savedProductIds, user])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error('useCart must be used within CartProvider')
  return value
}
