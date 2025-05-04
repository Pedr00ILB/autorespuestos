'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, CreditCard, Truck, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recalcular el total a partir de los items
  const computedTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Simulación de procesamiento de pago
    setTimeout(() => {
      setIsSubmitting(false);
      setIsComplete(true);
      clearCart();
    }, 2000);
  };

  if (isComplete) {
    return (
      <div className='container max-w-4xl mx-auto py-12 px-4'>
        <Card>
          <CardHeader className='text-center'>
            <div className='mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4'>
              <CheckCircle2 className='h-8 w-8 text-green-600' />
            </div>
            <CardTitle className='text-2xl'>¡Pedido Completado!</CardTitle>
            <CardDescription>
              Tu pedido ha sido procesado correctamente
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-6'>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-medium mb-2'>Detalles del Pedido</h3>
              <p className='text-sm text-gray-600'>
                Número de Pedido:{' '}
                <span className='font-medium'>
                  ORD-{Math.floor(Math.random() * 10000)}
                </span>
              </p>
              <p className='text-sm text-gray-600'>
                Fecha:{' '}
                <span className='font-medium'>
                  {new Date().toLocaleDateString()}
                </span>
              </p>
            </div>

            <div>
              <h3 className='font-medium mb-4'>Resumen de la Compra</h3>
              <ul className='space-y-2'>
                {items.map((item, index) => (
                  <li
                    key={`${item.id}-${index}`}
                    className='flex justify-between text-sm'
                  >
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span className='font-medium'>
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
              <Separator className='my-4' />
              <div className='flex justify-between font-bold'>
                <span>Total</span>
                <span>${computedTotal.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <h3 className='font-medium mb-2'>Información de Envío</h3>
              <p className='text-sm text-gray-600'>
                Tu pedido será enviado a la dirección proporcionada. Recibirás
                un correo electrónico con los detalles del envío y el número de
                seguimiento.
              </p>
              <div className='flex items-center gap-2 mt-2 text-sm text-gray-600'>
                <Truck className='h-4 w-4' />
                <span>Tiempo estimado de entrega: 3-5 días hábiles</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className='flex flex-col space-y-4'>
            <Button asChild className='w-full'>
              <Link href='/'>Volver a la Tienda</Link>
            </Button>
            <p className='text-center text-sm text-gray-500'>
              Si tienes alguna pregunta sobre tu pedido, no dudes en{' '}
              <Link
                href='/contacto'
                className='text-primary underline-offset-4 hover:underline'
              >
                contactarnos
              </Link>
              .
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className='container max-w-6xl mx-auto py-12 px-4'>
      <h1 className='text-3xl font-bold mb-8'>Finalizar Compra</h1>

      {error && (
        <Alert variant='destructive' className='mb-6'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className='grid md:grid-cols-3 gap-8'>
        {/* Formulario de Checkout */}
        <div className='md:col-span-2'>
          <form onSubmit={handleSubmit}>
            {/* Información de Contacto */}
            <div className='mb-6'>
              <Label htmlFor='firstName'>Nombre</Label>
              <Input id='firstName' placeholder='Juan' required />
            </div>
            {/* ...otros campos de contacto, envío y pago */}
            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
            </Button>
          </form>
        </div>

        {/* Resumen del Pedido */}
        <div>
          <Card className='sticky top-20'>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
              <CardDescription>
                {items.length} {items.length === 1 ? 'artículo' : 'artículos'}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='max-h-80 overflow-auto space-y-4'>
                {items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className='flex gap-4'>
                    <div className='relative h-16 w-16 rounded-md overflow-hidden border'>
                      <Image
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h4 className='font-medium text-sm line-clamp-1'>
                        {item.name}
                      </h4>
                      <p className='text-gray-500 text-sm'>
                        ${item.price.toLocaleString()} x {item.quantity}
                      </p>
                    </div>
                    <div className='font-medium'>
                      ${(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span>Subtotal</span>
                  <span>${computedTotal.toLocaleString()}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span>Impuestos (16%)</span>
                  <span>${(computedTotal * 0.16).toLocaleString()}</span>
                </div>
              </div>

              <Separator />

              <div className='flex justify-between font-bold'>
                <span>Total</span>
                <span>${(computedTotal * 1.16).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
