import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'souk_cart'

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

/**
 * Cart is a map: { [storeSlug]: CartItem[] }
 * CartItem: { id, name, price, image_url, quantity }
 */
export function CartProvider({ children }) {
  const [cartByStore, setCartByStore] = useState(loadCart)

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartByStore))
  }, [cartByStore])

  const getCart = useCallback((slug) => cartByStore[slug] || [], [cartByStore])

  const cartCount = useCallback(
    (slug) => (cartByStore[slug] || []).reduce((n, i) => n + i.quantity, 0),
    [cartByStore]
  )

  const cartTotal = useCallback(
    (slug) =>
      (cartByStore[slug] || []).reduce((s, i) => s + i.price * i.quantity, 0),
    [cartByStore]
  )

  const addToCart = useCallback((slug, product, qty = 1) => {
    setCartByStore((prev) => {
      const items = [...(prev[slug] || [])]
      const idx = items.findIndex((i) => i.id === product.id)
      if (idx >= 0) {
        items[idx] = { ...items[idx], quantity: items[idx].quantity + qty }
      } else {
        items.push({ ...product, quantity: qty })
      }
      return { ...prev, [slug]: items }
    })
  }, [])

  const removeFromCart = useCallback((slug, productId) => {
    setCartByStore((prev) => ({
      ...prev,
      [slug]: (prev[slug] || []).filter((i) => i.id !== productId),
    }))
  }, [])

  const updateQty = useCallback((slug, productId, qty) => {
    if (qty <= 0) return
    setCartByStore((prev) => ({
      ...prev,
      [slug]: (prev[slug] || []).map((i) =>
        i.id === productId ? { ...i, quantity: qty } : i
      ),
    }))
  }, [])

  const clearCart = useCallback((slug) => {
    setCartByStore((prev) => ({ ...prev, [slug]: [] }))
  }, [])

  const totalCartCount = Object.values(cartByStore).reduce(
    (total, items) => total + items.reduce((n, i) => n + i.quantity, 0),
    0
  )

  return (
    <CartContext.Provider
      value={{ cartItems: cartByStore, totalCartCount, getCart, cartCount, cartTotal, addToCart, removeFromCart, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
