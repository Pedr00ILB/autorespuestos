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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <Link
              href="/cars"
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Volver al catálogo
            </Link>
            <h1 className="text-3xl font-bold text-center">{car.marca} {car.modelo} ({car.año})</h1>
          </div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">{car.marca} {car.modelo}</h1>
            <Link
              href="/cars"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Volver al Catálogo
            </Link>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">Información del Vehículo</h2>
                    <div className="space-y-4">
                      <p className="text-gray-600">Año: {car.año}</p>
                      <p className="text-gray-600">Precio: ${car.precio.toLocaleString()}</p>
                      {car.kilometraje && (
                        <p className="text-gray-600">Kilometraje: {car.kilometraje.toLocaleString()} km</p>
                      )}
                      {car.transmision && (
                        <p className="text-gray-600">Transmisión: {car.transmision}</p>
                      )}
                      {car.combustible && (
                        <p className="text-gray-600">Combustible: {car.combustible}</p>
                      )}
                      {car.estado && (
                        <p className="text-gray-600">Estado: {car.estado}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">Descripción</h2>
                    <div className="text-gray-600">
                      {car.descripcion || 'Sin descripción disponible'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
