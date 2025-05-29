import CarList from '../components/cars/CarList';
import { useRouter } from 'next/router';

export default function CarsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Catálogo de Carros</h1>
          <button
            onClick={() => router.push('/cars/new')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Agregar Nuevo Carro
          </button>
        </div>
        <CarList />
      </div>
    </div>
  );
}
