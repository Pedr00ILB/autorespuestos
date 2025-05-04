"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart, Check } from "lucide-react"

interface AddToCartButtonProps {
  id: string
  name: string
  price: number
  image: string
  type: "car" | "accessory" | "part"
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
}

export default function AddToCartButton({
  id,
  name,
  price,
  image,
  type,
  className,
  variant = "default",
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({ id, name, price, image, type })
    setAdded(true)

    // Resetear el estado después de un tiempo
    setTimeout(() => {
      setAdded(false)
    }, 2000)
  }

  return (
    <Button onClick={handleAddToCart} variant={variant} className={className}>
      {added ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Añadido
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Añadir al Carrito
        </>
      )}
    </Button>
  )
}
