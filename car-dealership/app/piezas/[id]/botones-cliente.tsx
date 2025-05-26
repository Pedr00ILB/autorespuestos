'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart, type CartItemType } from '@/lib/cart-context';

interface PiezaDetalleBotonesProps {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
}

export default function PiezaDetalleBotones({ 
  id, 
  nombre, 
  precio, 
  imagen 
}: PiezaDetalleBotonesProps) {
  const { addItem } = useCart();
  
  // Función para añadir al carrito
  const handleAddToCart = () => {
    const item: CartItemType = {
      id,
      name: nombre,
      price: precio,
      image: imagen,
      type: 'part',
      quantity: 1,
    };
    addItem(item);
  };
  
  return (
    <Button onClick={handleAddToCart} size="lg" className="w-full">
      <ShoppingCart className="mr-2 h-5 w-5" />
      Añadir al Carrito
    </Button>
  );
}
