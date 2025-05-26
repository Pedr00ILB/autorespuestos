'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import BuyNowButton from '@/components/buy-now-button';
import { Button } from '@/components/ui/button';

interface AccessoryProps {
  accessory: {
    id: string;
    name: string;
    price: number;
    images?: string[];
    image?: string;
    category: string;
    description?: string;
    isNew?: boolean;
    specifications?: {
      brand?: string;
      model?: string;
      material?: string;
      color?: string;
      weight?: string;
      dimensions?: string;
    };
  };
}

export default function AccessoryCard({ accessory }: AccessoryProps) {
  const getImageSrc = () => {
    if (accessory.images && accessory.images.length > 0) {
      return accessory.images[0];
    }
    return accessory.image || '/placeholder.svg?height=160&width=240';
  };

  return (
    <Card className="group h-full">
      <Link href={`/accesorios/${accessory.id}`}>
        <CardHeader className="p-0">
          <div className="relative aspect-square">
            <Image
              src={getImageSrc()}
              alt={accessory.name}
              fill
              className="object-cover"
            />
            {accessory.isNew && (
              <Badge className="absolute top-2 right-2 bg-red-600">Nuevo</Badge>
            )}
          </div>
        </CardHeader>
      </Link>

      <CardContent className="h-[200px]">
        <div className="space-y-2 h-full flex flex-col justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{accessory.name}</h3>
            <p className="text-gray-500">Categoría: {accessory.category}</p>
            {accessory.description && (
              <p className="mt-2 text-sm line-clamp-2">{accessory.description}</p>
            )}
            {accessory.specifications && (
              <div className="mt-2">
                {accessory.specifications.brand && (
                  <p className="text-gray-500">Marca: {accessory.specifications.brand}</p>
                )}
                {accessory.specifications.model && (
                  <p className="text-gray-500">Modelo: {accessory.specifications.model}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4">
        <div className="flex flex-col justify-between h-full">
          {/* Precio */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">${accessory.price.toLocaleString()} MLC</span>
          </div>

          {/* Botones */}
          <div className="flex gap-2 mt-auto">
            <Link href={`/accesorios/${accessory.id}`} className="flex-1">
              <Button 
                variant="outline" 
                className="w-full h-10"
              >
                Ver detalles
              </Button>
            </Link>
            <BuyNowButton
              id={accessory.id}
              name={accessory.name}
              price={accessory.price}
              image={getImageSrc()}
              type='accessory'
              className="flex-1 h-10"
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
