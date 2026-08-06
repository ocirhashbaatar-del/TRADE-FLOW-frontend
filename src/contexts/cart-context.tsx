import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Product } from '@/types'
import { apiClient } from '@/api/client'
import { useAuth } from '@/contexts/auth-context'

export type CartItem = Product & { qty: number }

type ShoppingState = { cart: CartItem[]; savedProductIds: string[] }
type CartContextValue = {
  items: CartItem[]
  savedProductIds: string[]
  itemCount: number
  lastAdded: Product | null
  drawerOpen: boolean
  addItem: (product: Product, quantity?: number) => void
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
const readGuest = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) ?? '') as T }
  catch { return fallback }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
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
    setItems(data.cart)
    setSavedProductIds(data.savedProductIds)
  }, [user])

  useEffect(() => {
    if (authLoading) return
    setLastAdded(null)
    setDrawerOpen(false)
    if (user) {
      setItems([])
      setSavedProductIds([])
      void loadUserState().catch(() => { setItems([]); setSavedProductIds([]) })
    } else {
      setItems(readGuest<CartItem[]>(guestCartKey, []))
      setSavedProductIds(readGuest<string[]>(guestSavedKey, []))
    }
  }, [authLoading, loadUserState, user])

  useEffect(() => {
    if (!authLoading && !user) localStorage.setItem(guestCartKey, JSON.stringify(items))
  }, [authLoading, items, user])
  useEffect(() => {
    if (!authLoading && !user) localStorage.setItem(guestSavedKey, JSON.stringify(savedProductIds))
  }, [authLoading, savedProductIds, user])

  const recover = () => { if (user) void loadUserState() }
  const value = useMemo<CartContextValue>(() => ({
    items,
    savedProductIds,
    itemCount: items.reduce((total, item) => total + item.qty, 0),
    lastAdded,
    drawerOpen,
    addItem: (product, quantity = 1) => {
      const safeQuantity = Math.max(1, Math.min(product.stock, Math.floor(quantity)))
      setItems((current) => {
        const existing = current.find((item) => item.id === product.id)
        return existing ? current.map((item) => item.id === product.id ? { ...item, qty: Math.min(product.stock, item.qty + safeQuantity) } : item) : [...current, { ...product, qty: safeQuantity }]
      })
      if (user) void apiClient.post(`/shopping/cart/${product.id}`, { quantity: safeQuantity }).catch(recover)
      setLastAdded(product)
      setDrawerOpen(true)
    },
    updateQty: (id, delta) => {
      const current = items.find((item) => item.id === id)
      if (!current) return
      const quantity = Math.max(1, Math.min(current.stock, current.qty + delta))
      setItems((rows) => rows.map((item) => item.id === id ? { ...item, qty: quantity } : item))
      if (user) void apiClient.patch(`/shopping/cart/${id}`, { quantity }).catch(recover)
    },
    setItemQty: (id, requested) => {
      const current = items.find((item) => item.id === id)
      if (!current) return
      const quantity = Math.max(1, Math.min(current.stock, Math.floor(Number(requested) || 1)))
      setItems((rows) => rows.map((item) => item.id === id ? { ...item, qty: quantity } : item))
      if (user) void apiClient.patch(`/shopping/cart/${id}`, { quantity }).catch(recover)
    },
    removeItem: (id) => {
      setItems((current) => current.filter((item) => item.id !== id))
      if (user) void apiClient.delete(`/shopping/cart/${id}`).catch(recover)
    },
    clearCart: () => {
      setItems([]); setLastAdded(null); setDrawerOpen(false)
      if (user) void apiClient.delete('/shopping/cart').catch(recover)
    },
    toggleSaved: (id) => {
      const saved = savedProductIds.includes(id)
      setSavedProductIds((current) => saved ? current.filter((item) => item !== id) : [...current, id])
      if (user) void (saved ? apiClient.delete(`/shopping/saved/${id}`) : apiClient.put(`/shopping/saved/${id}`)).catch(recover)
    },
    clearLastAdded: () => setLastAdded(null),
    openCart: () => setDrawerOpen(true),
    closeCart: () => setDrawerOpen(false),
  }), [drawerOpen, items, lastAdded, savedProductIds, user, loadUserState])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error('useCart must be used within CartProvider')
  return value
}
