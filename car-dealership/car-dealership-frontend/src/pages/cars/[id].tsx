import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

interface Car {
  id: number;
  marca: string;
  modelo: string;
  año: number;
  precio: number;
  kilometraje?: number;
  transmision?: string;
  combustible?: string;
  estado?: string;
  descripcion?: string;
  imagen_principal?: string | null;
}

export default function CarDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCar(id as string);
    }
  }, [id]);

  const fetchCar = async (id: string) => {
    try {
      const response = await api.get(`/api/carros/${id}/`);
      setCar(response.data);
    } catch (err) {
      setError('Error al cargar el carro');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Cargando...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!car) return <div className="text-center py-8">Carro no encontrado</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{car.marca} {car.modelo}</h1>
          <Link href="/cars" className="text-blue-500 hover:text-blue-700">
            Volver a la lista
          </Link>
        </div>

        {/* Sección de imagen */}
        <div className="mb-8">
          {car.imagen_principal ? (
            <div className="relative h-96 mb-4">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${car.imagen_principal}`}
                alt={`${car.marca} ${car.modelo}`}
                fill
                className="object-cover rounded-lg"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = '/images/default_car.png';
                }}
              />
            </div>
          ) : (
            <div className="h-96 mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Sin imagen</span>
            </div>
          )}
        </div>

        {/* Sección de detalles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Información Básica</h2>
            <div className="space-y-2">
              <p className="text-gray-600">Año: {car.año}</p>
              <p className="text-gray-600">Precio: ${car.precio.toFixed(2)}</p>
              
              {car.kilometraje !== undefined && (
                <p className="text-gray-600">
                  Kilometraje: {car.kilometraje} km
                </p>
              )}

              {car.transmision && (
                <p className="text-gray-600">
                  Transmisión: {car.transmision}
                </p>
              )}

              {car.combustible && (
                <p className="text-gray-600">
                  Combustible: {car.combustible}
                </p>
              )}

              {car.estado && (
                <p className="text-gray-600">
                  Estado: {car.estado}
                </p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Descripción</h2>
            <div className="text-gray-600">
              {car.descripcion || 'Sin descripción disponible'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
