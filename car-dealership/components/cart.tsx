'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart, type CartItemType } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';

export default function Cart() {
  const {
    items,
    removeItem,
    updateQuantity,
    itemCount,
    total,
    isOpen,
    setIsOpen,
  } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulación de procesamiento de pago
    setTimeout(() => {
      setIsCheckingOut(false);
      // Aquí iría la redirección a la página de pago o confirmación
      window.location.href = '/checkout';
    }, 1500);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant='outline' size='icon' className='relative'>
          <ShoppingCart className='h-5 w-5' />
          {itemCount > 0 && (
            <Badge className='absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-600'>
              {itemCount}
            </Badge>
          )}
          <span className='sr-only'>Abrir carrito</span>
        </Button>
      </SheetTrigger>

      <SheetContent className='w-full sm:max-w-md flex flex-col'>
        <SheetHeader>
          <SheetTitle className='flex items-center gap-2'>
            <ShoppingCart className='h-5 w-5' />
            Carrito de Compras
            <Badge variant='outline' className='ml-2'>
              {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}
            </Badge>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className='flex-1 flex flex-col items-center justify-center gap-4 py-12'>
            <div className='relative w-24 h-24 text-gray-300'>
              <ShoppingCart className='w-full h-full' />
            </div>
            <div className='text-center'>
              <h3 className='font-medium text-lg mb-1'>
                Tu carrito está vacío
              </h3>
              <p className='text-gray-500 mb-4'>
                Añade productos para continuar con tu compra
              </p>
              <Button onClick={() => setIsOpen(false)}>
                Continuar Comprando
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className='flex-1 overflow-auto py-4'>
              <ul className='space-y-4'>
                {items.map((item, idx) => (
                  <CartItem key={`${item.id}-${idx}`} item={item} />
                ))}
              </ul>
            </div>

            <div className='border-t pt-4 space-y-4'>
              <div className='flex justify-between items-center font-medium'>
                <span>Subtotal</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <div className='flex justify-between items-center text-sm text-gray-500'>
                <span>Envío</span>
                <span>Calculado en el checkout</span>
              </div>
              <Separator />
              <div className='flex justify-between items-center font-bold text-lg'>
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>

              <div className='grid grid-cols-2 gap-2'>
                <Button variant='outline' onClick={() => setIsOpen(false)}>
                  Seguir Comprando
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className='bg-red-600 hover:bg-red-700'
                >
                  {isCheckingOut ? 'Procesando...' : 'Finalizar Compra'}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CartItem({ item }: { item: CartItemType }) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <li className='flex gap-4 py-2'>
      <div className='relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 border'>
        <Image
          src={item.image || '/placeholder.svg'}
          alt={item.name}
          fill
          className='object-cover'
        />
      </div>
      <div className='flex-1 min-w-0'>
        <h4 className='font-medium text-sm line-clamp-1'>{item.name}</h4>
        <p className='text-gray-500 text-sm'>
          ${item.price.toLocaleString()} x {item.quantity}
        </p>
        <div className='flex items-center gap-2 mt-2'>
          <div className='flex items-center border rounded-md'>
            <Button
              variant='ghost'
              size='icon'
              className='h-7 w-7 rounded-none'
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Minus className='h-3 w-3' />
              <span className='sr-only'>Disminuir cantidad</span>
            </Button>
            <span className='w-8 text-center text-sm'>{item.quantity}</span>
            <Button
              variant='ghost'
              size='icon'
              className='h-7 w-7 rounded-none'
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className='h-3 w-3' />
              <span className='sr-only'>Aumentar cantidad</span>
            </Button>
          </div>
          <Button
            variant='ghost'
            size='icon'
            className='h-7 w-7 text-gray-500 hover:text-red-600'
            onClick={() => removeItem(item.id)}
          >
            <Trash2 className='h-4 w-4' />
            <span className='sr-only'>Eliminar</span>
          </Button>
        </div>
      </div>
      <div className='font-medium'>
        ${(item.price * item.quantity).toLocaleString()}
      </div>
    </li>
  );
}
