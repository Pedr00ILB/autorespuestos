'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cars } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Car,
  ChevronLeft,
  Fuel,
  Gauge,
} from 'lucide-react';
import CarSteeringAllWheels from '@/components/Car';
import { Canvas } from '@react-three/fiber';
import { Stage } from '@react-three/drei';
import AddToCartButton from '@/components/add-to-cart-button';
import BuyNowButton from '@/components/buy-now-button';

interface CarDetailPageProps {
  params: {
    id: string;
  };
}

export default function CarDetailPage({ params }: CarDetailPageProps) {
  const car = cars.find((c) => c.id === params.id);
  const mouseX = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth) * 2 - 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!car) {
    notFound();
  }

  // Características adicionales del carro (datos ficticios)
  const memoizedFeatures = useMemo(() => [
    { name: 'Transmisión', value: 'Automática' },
    { name: 'Motor', value: '2.0L Turbo' },
    { name: 'Potencia', value: '180 HP' },
    { name: 'Tracción', value: 'Delantera' },
    { name: 'Puertas', value: '4' },
    { name: 'Asientos', value: '5' },
    { name: 'Color exterior', value: 'Plata metálico' },
    { name: 'Color interior', value: 'Negro' },
  ], []);

  return (
    <div className='container mx-auto px-4 py-8'>
      <Link
        href='/comprar'
        className='inline-flex items-center text-sm mb-6 hover:text-primary'
      >
        <ChevronLeft className='mr-1 h-4 w-4' />
        Volver al catálogo
      </Link>

      <div className='grid md:grid-cols-2 gap-8'>
        {/* Imagen principal y galería */}
        <div className='space-y-4'>
          <div className='relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden border'>
            <Image
              src={car.image || '/placeholder.svg?height=80&width=120&text=Foto'}
              alt={`${car.brand} ${car.model}`}
              fill
              className='object-cover'
              loading="lazy"
            />
            {car.isNew && (
              <Badge className='absolute top-4 right-4 bg-red-600'>Nuevo</Badge>
            )}
          </div>

          <div className='relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden border'>
            <Canvas>
              <Stage intensity={0.5} environment="city">
                <CarSteeringAllWheels mouseX={mouseX} />
              </Stage>
            </Canvas>
          </div>

          <div className='grid grid-cols-4 gap-2'>
            {/* Imágenes en miniatura (usando la misma imagen para demostración) */}
            {[1, 2, 3, 4].map((i) => (
              <div
                key={`thumbnail-${i}`}
                className='relative h-20 rounded-md overflow-hidden border cursor-pointer hover:opacity-80'
              >
                <Image
                  src={
                    car.image ||
                    `/placeholder.svg?height=80&width=120&text=Foto ${i}`
                  }
                  alt={`${car.brand} ${car.model} - Vista ${i}`}
                  fill
                  className='object-cover'
                />
              </div>
            ))}
          </div>
        </div>

        {/* Información del vehículo */}
        <div className='space-y-6'>
          <div>
            <h1 className='text-3xl font-bold'>
              {car.brand} {car.model}
            </h1>
            <p className='text-xl text-gray-500'>Año {car.year}</p>
          </div>

          <div className='flex items-center justify-between'>
            <p className='text-3xl font-bold'>${car.price.toLocaleString()}</p>
            <MemoizedBadge isNew={car.isNew} />
          </div>

          <div className='grid grid-cols-2 gap-4 py-4 border-y'>
            <div className='flex items-center gap-2'>
              <Gauge className='h-5 w-5 text-gray-500' />
              <div>
                <p className='text-sm text-gray-500'>Kilometraje</p>
                <p className='font-medium'>{car.mileage.toLocaleString()} km</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Fuel className='h-5 w-5 text-gray-500' />
              <div>
                <p className='text-sm text-gray-500'>Combustible</p>
                <p className='font-medium'>{car.fuel}</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Calendar className='h-5 w-5 text-gray-500' />
              <div>
                <p className='text-sm text-gray-500'>Año</p>
                <p className='font-medium'>{car.year}</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Car className='h-5 w-5 text-gray-500' />
              <div>
                <p className='text-sm text-gray-500'>Transmisión</p>
                <p className='font-medium'>Automática</p>
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <BuyNowButton
              id={car.id}
              name={`${car.brand} ${car.model}`}
              price={car.price}
              image={car.image}
              type='car'
              className='w-full'
            />
            <div className='grid grid-cols-2 gap-4'>
              <AddToCartButton
                id={car.id}
                name={`${car.brand} ${car.model}`}
                price={car.price}
                image={car.image}
                type='car'
                variant='outline'
                className='w-full'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs con información adicional */}
      <Tabs defaultValue='description' className='mt-12'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='description' className='flex items-center gap-2'>
            <Info className='h-4 w-4' />
            Descripción
          </TabsTrigger>
          <TabsTrigger value='features' className='flex items-center gap-2'>
            <Settings className='h-4 w-4' />
            Características
          </TabsTrigger>
          <TabsTrigger value='warranty' className='flex items-center gap-2'>
            <Shield className='h-4 w-4' />
            Garantía
          </TabsTrigger>
        </TabsList>
        <TabsContent value='description' className='p-4 border rounded-md mt-2'>
          <h3 className='text-lg font-medium mb-2'>Acerca de este vehículo</h3>
          <p className='text-gray-600'>
            El {car.brand} {car.model} {car.year} es un vehículo excepcional que
            combina elegancia, rendimiento y tecnología de vanguardia. Con su
            motor potente y eficiente, este automóvil ofrece una experiencia de
            conducción suave y emocionante.
          </p>
          <p className='text-gray-600 mt-4'>
            El interior espacioso y lujoso está equipado con las últimas
            características de comodidad y entretenimiento, incluyendo un
            sistema de infoentretenimiento de última generación, asientos de
            cuero premium y un amplio espacio para pasajeros y carga.
          </p>
          <p className='text-gray-600 mt-4'>
            Este vehículo también cuenta con tecnologías avanzadas de seguridad,
            como frenado automático de emergencia, alerta de colisión frontal,
            monitoreo de punto ciego y asistencia de mantenimiento de carril,
            para proporcionar tranquilidad en cada viaje.
          </p>
        </TabsContent>
        <TabsContent value='features' className='p-4 border rounded-md mt-2'>
          <h3 className='text-lg font-medium mb-4'>
            Especificaciones técnicas
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {features.map((feature, index) => (
              <div key={index} className='flex justify-between py-2 border-b'>
                <span className='text-gray-600'>{feature.name}</span>
                <span className='font-medium'>{feature.value}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value='warranty' className='p-4 border rounded-md mt-2'>
          <h3 className='text-lg font-medium mb-2'>Información de garantía</h3>
          <p className='text-gray-600'>
            Este vehículo cuenta con una garantía completa de 3 años o 60,000
            kilómetros, lo que ocurra primero. La garantía cubre:
          </p>
          <ul className='list-disc pl-5 mt-2 space-y-1 text-gray-600'>
            <li>Motor y transmisión</li>
            <li>Sistema eléctrico</li>
            <li>Aire acondicionado y calefacción</li>
            <li>Componentes de seguridad</li>
            <li>Asistencia en carretera 24/7</li>
          </ul>
          <p className='mt-4 text-gray-600'>
            Además, ofrecemos la opción de extender la garantía hasta 5 años o
            100,000 kilómetros para mayor tranquilidad.
          </p>
        </TabsContent>
      </Tabs>

      {/* Vehículos similares */}
      <div className='mt-16'>
        <h2 className='text-2xl font-bold mb-6'>Vehículos similares</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {cars
            .filter((c) => c.id !== car.id)
            .slice(0, 4)
            .map((similarCar) => (
              <div
                key={similarCar.id}
                className='border rounded-lg overflow-hidden'
              >
                <div className='relative h-40 w-full'>
                  <Image
                    src={
                      similarCar.image ||
                      '/placeholder.svg?height=160&width=240'
                    }
                    alt={`${similarCar.brand} ${similarCar.model}`}
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='p-4'>
                  <h3 className='font-medium'>
                    {similarCar.brand} {similarCar.model}
                  </h3>
                  <p className='text-gray-500'>{similarCar.year}</p>
                  <p className='font-bold mt-1'>
                    ${similarCar.price.toLocaleString()}
                  </p>
                  <div className='flex gap-2 mt-2'>
                    <Link href={`/carro/${similarCar.id}`} className='flex-1'>
                      <Button variant='outline' className='w-full'>
                        Ver detalles
                      </Button>
                    </Link>
                    <AddToCartButton
                      id={similarCar.id}
                      name={`${similarCar.brand} ${similarCar.model}`}
                      price={similarCar.price}
                      image={similarCar.image}
                      type='car'
                      className='flex-1'
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
