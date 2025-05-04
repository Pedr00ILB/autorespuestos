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
import AddToCartButton from '@/components/add-to-cart-button';
import BuyNowButton from '@/components/buy-now-button';

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
        <div className='flex justify-between items-start mb-2'>
          <div>
            <h3 className='font-bold text-lg'>
              {car.brand} {car.model}
            </h3>
            <p className='text-gray-500'>{car.year}</p>
          </div>
          <div className='text-right'>
            <p className='font-bold text-lg'>
              ${car.priceMLC.toLocaleString()} MLC
            </p>
            {car.priceCUP !== null && (
              <p className='text-sm text-gray-500'>
                {car.priceCUP.toLocaleString()} CUP
              </p>
            )}
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2 mt-4'>
          <div className='flex items-center gap-1 text-sm text-gray-500'>
            <Gauge className='h-4 w-4' />
            <span>
              {car.mileage !== null
                ? `${car.mileage.toLocaleString()} km`
                : '—'}
            </span>
          </div>
          <div className='flex items-center gap-1 text-sm text-gray-500'>
            <Fuel className='h-4 w-4' />
            <span>{car.fuel}</span>
          </div>
          <div className='flex items-center gap-1 text-sm text-gray-500'>
            <Calendar className='h-4 w-4' />
            <span>{car.year}</span>
          </div>
          <div className='flex items-center gap-1 text-sm text-gray-500'>
            <Car className='h-4 w-4' />
            <span>Automático</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className='flex gap-2 p-4 pt-0'>
        <Link href={`/carro/${car.id}`} className='flex-1'>
          <AddToCartButton
            id={car.id}
            name={`${car.brand} ${car.model}`}
            price={car.priceMLC}
            image={car.image}
            type='car'
            variant='outline'
            className='w-full'
          />
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
