import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga inicial
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Bienvenido a AutoRepuestos</h1>
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Bienvenido a AutoRepuestos</h1>

        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl text-gray-600 mb-8">
            Encuentra los mejores carros y repuestos para tu vehículo. Nuestra plataforma te ofrece una amplia gama de productos de calidad.
          </p>

          <div className="flex justify-center space-x-4 mb-12">
            <Link
              href="/cars"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Ver Catálogo
            </Link>
            <Link
              href="/about"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Más Información
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Carrousel de imágenes con manejo de errores */}
            {[1, 2, 3].map((index) => (
              <div key={index} className="relative h-64">
                <Image
                  src={`/images/home-${index}.jpg`}
                  alt={`Imagen ${index}`}
                  fill
                  className="object-cover rounded-lg"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = '/images/default_car.png';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
