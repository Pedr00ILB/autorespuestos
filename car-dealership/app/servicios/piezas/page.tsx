'use client';

import React from 'react';
import Image from 'next/image';
import { useCart, type CartItemType } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart } from 'lucide-react';

// — Datos de ejemplo para piezas —
const piezas = [
  {
    id: '1',
    nombre: 'Filtro de Aceite Premium',
    categoria: 'Filtros',
    compatibilidad: 'Toyota, Honda, Nissan',
    precio: 12.99,
    descuento: true,
    precioAnterior: 15.99,
    imagen: '/placeholder.svg?height=200&width=200',
    stock: 45,
  },
  {
    id: '2',
    nombre: 'Pastillas de Freno Delanteras',
    categoria: 'Frenos',
    compatibilidad: 'Ford, Chevrolet',
    precio: 39.99,
    descuento: false,
    precioAnterior: null,
    imagen: '/placeholder.svg?height=200&width=200',
    stock: 28,
  },
  {
    id: '3',
    nombre: 'Batería de Alto Rendimiento',
    categoria: 'Eléctrico',
    compatibilidad: 'Universal',
    precio: 89.99,
    descuento: true,
    precioAnterior: 109.99,
    imagen: '/placeholder.svg?height=200&width=200',
    stock: 15,
  },
  {
    id: '4',
    nombre: 'Kit de Distribución Completo',
    categoria: 'Motor',
    compatibilidad: 'Volkswagen, Audi',
    precio: 129.99,
    descuento: false,
    precioAnterior: null,
    imagen: '/placeholder.svg?height=200&width=200',
    stock: 8,
  },
  {
    id: '5',
    nombre: 'Amortiguadores Traseros (Par)',
    categoria: 'Suspensión',
    compatibilidad: 'Toyota, Honda',
    precio: 79.99,
    descuento: true,
    precioAnterior: 94.99,
    imagen: '/placeholder.svg?height=200&width=200',
    stock: 12,
  },
  {
    id: '6',
    nombre: 'Alternador Remanufacturado',
    categoria: 'Eléctrico',
    compatibilidad: 'Ford, Chevrolet',
    precio: 149.99,
    descuento: false,
    precioAnterior: null,
    imagen: '/placeholder.svg?height=200&width=200',
    stock: 6,
  },
  {
    id: '7',
    nombre: 'Bomba de Agua',
    categoria: 'Refrigeración',
    compatibilidad: 'Múltiples marcas',
    precio: 34.99,
    descuento: false,
    precioAnterior: null,
    imagen: '/placeholder.svg?height=200&width=200',
    stock: 22,
  },
  {
    id: '8',
    nombre: 'Aceite Sintético 5W-30 (5L)',
    categoria: 'Lubricantes',
    compatibilidad: 'Universal',
    precio: 45.99,
    descuento: true,
    precioAnterior: 52.99,
    imagen: '/placeholder.svg?height=200&width=200',
    stock: 50,
  },
];

// Categorías de piezas
const categorias = [
  'Todas',
  'Filtros',
  'Frenos',
  'Eléctrico',
  'Motor',
  'Suspensión',
  'Refrigeración',
  'Lubricantes',
];

function AddToCartBtn({ pieza }: { pieza: (typeof piezas)[0] }) {
  const { addItem } = useCart();
  const handleAdd = () => {
    const item: CartItemType = {
      id: pieza.id,
      name: pieza.nombre,
      price: pieza.precio,
      image: pieza.imagen,
      type: 'part',
      quantity: 1,
    };
    addItem(item);
  };
  return (
    <Button onClick={handleAdd} className='w-full'>
      <ShoppingCart className='mr-2 h-4 w-4' />
      Añadir al Carrito
    </Button>
  );
}

export default function PiezasPage() {
  return (
    <div className='container mx-auto py-10 px-4'>
      {/* Header y descripción */}
      <div className='flex flex-col md:flex-row items-center gap-6 mb-10'>
        <div className='flex-1'>
          <h1 className='text-3xl font-bold mb-4'>
            Venta de Piezas y Repuestos
          </h1>
          <p className='text-gray-600 mb-6'>
            En AutoRepuestos encontrarás una amplia variedad de piezas y
            repuestos originales y alternativos para todas las marcas y modelos.
            Garantizamos la calidad de todos nuestros productos con los mejores
            precios del mercado.
          </p>
        </div>
      </div>

      {/* Catálogo por categorías */}
      <Tabs defaultValue='Todas' className='mb-6'>
        <TabsList className='flex flex-wrap h-auto'>
          {categorias.map((cat) => (
            <TabsTrigger key={cat} value={cat} className='mb-1'>
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        {categorias.map((cat) => (
          <TabsContent key={cat} value={cat} className='mt-6'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {piezas
                .filter((p) => cat === 'Todas' || p.categoria === cat)
                .map((pieza) => (
                  <Card key={pieza.id} className='overflow-hidden'>
                    <div className='relative h-48 w-full'>
                      <Image
                        src={pieza.imagen}
                        alt={pieza.nombre}
                        fill
                        className='object-contain p-4'
                      />
                      {pieza.descuento && (
                        <Badge className='absolute top-2 right-2 bg-red-600'>
                          Oferta
                        </Badge>
                      )}
                    </div>
                    <CardContent className='p-4'>
                      <h3 className='font-medium line-clamp-2 h-12'>
                        {pieza.nombre}
                      </h3>
                      <p className='text-sm text-gray-500 mb-1'>
                        {pieza.categoria}
                      </p>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='font-bold text-lg'>
                          ${pieza.precio.toFixed(2)}
                        </span>
                        {pieza.descuento && (
                          <span className='text-sm text-gray-500 line-through'>
                            ${pieza.precioAnterior?.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className='text-xs text-gray-500 mb-4'>
                        {pieza.stock > 20
                          ? 'En stock'
                          : pieza.stock > 5
                          ? 'Stock limitado'
                          : 'Últimas unidades'}
                      </p>
                    </CardContent>
                    <CardFooter className='p-4 pt-0'>
                      <AddToCartBtn pieza={pieza} />
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
