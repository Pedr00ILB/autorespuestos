// components/CarCard.tsx
'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Fuel, Calendar, Gauge } from 'lucide-react';
import Link from 'next/link';
import BuyNowButton from '@/components/buy-now-button';
import { Button } from '@/components/ui/button';

interface CarCardProps {
  car: {
    id: string;
    brand: string;
    model: string;
    year: number;
    mileage: number | null;
    fuel: string;
    priceMLC: number;
    priceCUP: number | null;
    image: string;
    isNew: boolean;
  };
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <Card className='overflow-hidden'>
      <CardHeader className='p-0'>
        <div className='relative h-48 w-full'>
          <Image
            src={car.image || '/placeholder.svg?height=200&width=300'}
            alt={`${car.brand} ${car.model}`}
            fill
            className='object-cover'
          />
          {car.isNew && (
            <Badge className='absolute top-2 right-2 bg-red-600'>Nuevo</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className='p-4'>
        <div className='space-y-2'>
          <h3 className='text-lg font-semibold'>{car.brand} {car.model}</h3>
          <p className='text-gray-500'>Año: {car.year}</p>
          {car.mileage !== null && (
            <p className='text-gray-500'>Kilometraje: {car.mileage} km</p>
          )}
          <div className='flex items-center gap-2 text-gray-500'>
            <Fuel className='h-4 w-4' />
            <span>{car.fuel}</span>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4' />
              <span className='text-gray-500'>Año: {car.year}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Gauge className='h-4 w-4' />
              <span className='font-bold'>${car.priceMLC.toLocaleString()} MLC</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className='flex gap-2 p-4 pt-0'>
        <Link href={`/vehiculos/${car.id}`} className='flex-1'>
          <Button variant='outline' className='w-full'>Ver detalles</Button>
        </Link>
        <BuyNowButton
          id={car.id}
          name={`${car.brand} ${car.model}`}
          price={car.priceMLC}
          image={car.image}
          type='car'
          className='flex-1'
        />
      </CardFooter>
    </Card>
  );
}
