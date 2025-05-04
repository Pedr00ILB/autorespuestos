import { cars } from '@/lib/data';
import CarCard from '@/components/car-card';


export default function ComprarPage() {
  return (
    <div className='container mx-auto py-10 px-4'>
      <h1 className='text-3xl font-bold mb-6'>Catálogo de Vehículos</h1>

      {/* Filtros y búsqueda */}

      {/* Listado de vehículos */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
}
