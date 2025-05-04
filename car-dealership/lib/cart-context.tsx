"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Tipos para los items del carrito
export type CartItemType = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  type: "car" | "accessory" | "part" // Para distinguir entre coches, accesorios y piezas
}

// Tipo para el contexto del carrito
type CartContextType = {
  items: CartItemType[]
  addItem: (item: Omit<CartItemType, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  total: number
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

// Crear el contexto
const CartContext = createContext<CartContextType | undefined>(undefined)

// Proveedor del contexto
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    setMounted(true)
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error)
        setItems([])
      }
    }
  }, [])

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, mounted])

  // Añadir item al carrito
  const addItem = (newItem: Omit<CartItemType, "quantity">) => {
    setItems((prevItems) => {
      // Verificar si el item ya existe en el carrito
      const existingItemIndex = prevItems.findIndex((item) => item.id === newItem.id && item.type === newItem.type)

      if (existingItemIndex >= 0) {
        // Si existe, incrementar la cantidad
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += 1
        return updatedItems
      } else {
        // Si no existe, añadirlo con cantidad 1
        return [...prevItems, { ...newItem, quantity: 1 }]
      }
    })
    // Abrir el carrito al añadir un item
    setIsOpen(true)
  }

  // Eliminar item del carrito
  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  // Actualizar cantidad de un item
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity: quantity } : item)))
  }

  // Limpiar carrito
  const clearCart = () => {
    setItems([])
  }

  // Calcular número total de items
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  // Calcular precio total
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        total,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Hook para usar el contexto
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
