import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import Spinner from '@/components/Spinner';
import Alert from '@/components/Alert';
import { useRouter } from 'next/router';

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

interface CarListProps {
  className?: string;
}

const CarList = ({ className = '' }: CarListProps) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get('/api/carros/');
        setCars(response.data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar los carros';
        setError(errorMessage);
        console.error('Error fetching cars:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Spinner size="large" className="mx-auto" />
        <p className="mt-4 text-gray-600">Cargando carros...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center py-8">
      <Alert message={error} type="error" />
    </div>
  );

  if (cars.length === 0) return (
    <div className="text-center py-8">
      <p className="text-gray-600">No se encontraron carros</p>
    </div>
  );

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-100 ${className}`}>
      <div className="w-full max-w-7xl px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Lista de Carros</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`Ver detalles del carro ${car.marca} ${car.modelo}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{car.marca} {car.modelo}</h2>
                    <p className="text-gray-600 mb-2">Año: {car.año}</p>
                    <p className="text-gray-600 mb-2">Precio: ${car.precio.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/cars/${car.id}`}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                    >
                      Detalles
                    </Link>
                    <Link
                      href={`/cars/edit/${car.id}`}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                    >
                      Editar
                    </Link>
                  </div>
                </div>
                <div className="mb-4">
                  {car.imagen_principal ? (
                    <div className="relative h-48 mb-4">
                      <Image
                        src={`${car.imagen_principal}`}
                        alt={`${car.marca} ${car.modelo}`}
                        fill
                        className="object-cover rounded-lg"
                        onError={(e: React.ChangeEvent<HTMLImageElement>) => {
                          const img = e.target as HTMLImageElement;
                          img.src = '/images/default_car.png';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-48 mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Sin imagen</span>
                    </div>
                  )}
                </div>
                <div>
                  {car.kilometraje !== undefined && (
                    <p className="text-gray-600 mb-2">
                      Kilometraje: {car.kilometraje} km
                    </p>
                  )}
                  {car.transmision && (
                    <p className="text-gray-600 mb-2">
                      Transmisión: {car.transmision}
                    </p>
                  )}
                  {car.combustible && (
                    <p className="text-gray-600 mb-2">
                      Combustible: {car.combustible}
                    </p>
                  )}
                  {car.estado && (
                    <p className="text-gray-600 mb-2">
                      Estado: {car.estado}
                    </p>
                  )}
                  {car.descripcion && (
                    <p className="text-gray-600 mb-4">
                      Descripción: {car.descripcion}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarList;
