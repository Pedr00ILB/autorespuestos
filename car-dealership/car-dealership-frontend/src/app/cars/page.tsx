import CarList from '@/components/cars/CarList';
import Link from 'next/link';

export default function CarsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-8">
      <div className="w-full max-w-7xl px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-center">Catálogo de Carros</h1>
          <Link
            href="/cars/new"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg focus:outline-none focus:shadow-outline"
          >
            Agregar Nuevo Carro
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <CarList />
        </div>
      </div>
    </div>
  );
}
