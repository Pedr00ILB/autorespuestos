'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchCars } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

interface Car {
  id: number;
  marca: string;
  modelo: string;
  año: number;
  precio: number;
  descripcion: string;
  imagen: string | null;
  disponible: boolean;
  created_at: string;
  updated_at: string;
}

export default function CarsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      // Si el usuario no está autenticado, redirigir al login
      router.push('/login');
      return;
    }

    // Cargar los coches si el usuario está autenticado
    if (user) {
      loadCars();
    }
  }, [user, authLoading, router]);

  const loadCars = async () => {
    try {
      setLoading(true);
      const data = await fetchCars();
      setCars(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar los coches:', err);
      setError('No se pudieron cargar los coches. Inténtalo de nuevo más tarde.');
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los coches. Inténtalo de nuevo más tarde.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="flex justify-between p-6 pt-0">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Catálogo de Coches</h1>
        <Button onClick={() => router.push('/dashboard')}>
          Volver al Dashboard
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="flex justify-between p-6 pt-0">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No hay coches disponibles</h2>
          <p className="text-muted-foreground">Intenta más tarde o contacta con el administrador.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Card key={car.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                {car.imagen ? (
                  <img
                    src={car.imagen}
                    alt={`${car.marca} ${car.modelo}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">Sin imagen</span>
                  </div>
                )}
                {!car.disponible && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    No disponible
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-xl">
                  {car.marca} {car.modelo}
                </CardTitle>
                <CardDescription className="text-lg font-semibold text-primary">
                  ${car.precio.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {car.descripcion || 'Sin descripción disponible.'}
                </p>
                <div className="mt-4 text-sm">
                  <p><span className="font-medium">Año:</span> {car.año}</p>
                  <p className={car.disponible ? 'text-green-600' : 'text-red-600'}>
                    <span className="font-medium">Estado:</span>{' '}
                    {car.disponible ? 'Disponible' : 'No disponible'}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push(`/car/${car.id}`)}>
                  Ver detalles
                </Button>
                <Button disabled={!car.disponible}>
                  Reservar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
