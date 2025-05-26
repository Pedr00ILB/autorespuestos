// app/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CarCard from '@/components/car-card';
import AccessoryCard from '@/components/accessory-card';
import ServiceCard from '@/components/service-card';
import { cars, accessories, services } from '@/lib/data';
import Hero from '@/components/Hero';
import Scene from '@/components/Scene';

export default function Home() {
  return (
    <main className='flex flex-col min-h-screen'>
      {/* Hero con video */}
      <Hero />

      {/* Featured Cars */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold mb-8 text-center'>
            Vehículos Destacados
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {cars.slice(0, 6).map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
          <div className='mt-10 text-center'>
            <Link href='/comprar'>
              <Button size='lg'>Ver todos los vehículos</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Accessories */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold mb-8 text-center'>
            Accesorios Populares
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {accessories.slice(0, 4).map((accessory) => (
              <AccessoryCard key={accessory.id} accessory={accessory} />
            ))}
          </div>
          <div className='mt-10 text-center'>
            <Link href='/accesorios'>
              <Button size='lg' variant='outline'>
                Ver todos los accesorios
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold mb-8 text-center'>
            Nuestros Servicios
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
