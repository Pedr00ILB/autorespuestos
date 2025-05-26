'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import CarCarousel from '@/components/CarCarousel';
import { useCart, type CartItemType } from '@/lib/cart-context';
import { toast } from '@/components/ui/use-toast';

interface Accesorio {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description: string;
}

export default function AccesorioDetails() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { addItem } = useCart();
  const [accesorio, setAccesorio] = useState<Accesorio | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Extraer el ID del pathname
  const id = pathname.split('/').pop();

  useEffect(() => {
    const fetchAccesorio = async () => {
      try {
        const response = await fetch(`/api/accesorios/${id}`);
        if (!response.ok) throw new Error('Error al cargar el accesorio');
        const data = await response.json();
        setAccesorio(data);
        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError('Error al cargar el accesorio');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAccesorio();
    }
  }, [id]);

  // Función para añadir al carrito
  const handleAddToCart = () => {
    if (accesorio) {
      const cartItem: CartItemType = {
        id: accesorio.id,
        name: accesorio.name,
        price: accesorio.price,
        image: accesorio.images[0] || '/placeholder.svg',
        quantity: 1,
        type: 'accessory'
      };
      
      addItem(cartItem);
      toast({
        title: "Añadido al carrito",
        description: `${accesorio.name} ha sido añadido a tu carrito.`,
        duration: 3000,
      });
    }
  };

  // Función para compra directa
  const handleBuyNow = () => {
    if (accesorio) {
      const cartItem: CartItemType = {
        id: accesorio.id,
        name: accesorio.name,
        price: accesorio.price,
        image: accesorio.images[0] || '/placeholder.svg',
        quantity: 1,
        type: 'accessory'
      };
      
      addItem(cartItem);
      router.push('/checkout');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Link href="/accesorios" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mt-4">
            <ArrowLeft className="w-4 h-4" />
            Volver a la lista de accesorios
          </Link>
        </div>
      </div>
    );
  }

  if (!accesorio) {
    return <div className="flex items-center justify-center min-h-screen">Accesorio no encontrado</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sección de Imágenes */}
        <div className="flex-1">
          <CarCarousel images={accesorio.images} />
        </div>

        {/* Información del Accesorio */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{accesorio.name}</h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Descripción</h2>
            <p className="text-gray-600 leading-relaxed">{accesorio.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Precio</h2>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold">${accesorio.price} MLC</span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Categoría</h2>
            <div className="text-gray-600">{accesorio.category}</div>
          </div>

          <div className="flex gap-4">
            <Button size="lg" className="w-full" onClick={handleAddToCart}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Agregar al carrito
            </Button>
            <Button variant="outline" size="lg" className="w-full" onClick={handleBuyNow}>
              Comprar ahora
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Link href="/accesorios" className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
          <ArrowLeft className="w-4 h-4" />
          Volver a la lista de accesorios
        </Link>
      </div>
    </div>
  );
}
