'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';

interface BuyNowButtonProps {
  id: string;
  name: string;
  price: number;
  image: string;
  type: 'car' | 'accessory' | 'part';
  className?: string;
}

export default function BuyNowButton({
  id,
  name,
  price,
  image,
  type,
  className,
}: BuyNowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem, clearCart } = useCart();
  const router = useRouter();

  const handleBuyNow = () => {
    setIsLoading(true);

    // Limpiar el carrito y añadir solo este producto
    clearCart();
    addItem({ id, name, price, image, type });

    // Simular un pequeño retraso antes de redirigir al checkout
    setTimeout(() => {
      setIsLoading(false);
      router.push('/checkout');
    }, 500);
  };

  return (
    <Button onClick={handleBuyNow} disabled={isLoading} className={className}>
      {isLoading ? 'Procesando...' : 'Comprar Ahora'}
    </Button>
  );
}
