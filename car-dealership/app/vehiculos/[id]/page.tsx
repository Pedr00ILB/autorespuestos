import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import CarCarousel from '@/components/CarCarousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BuyNowButton from '@/components/buy-now-button';

interface VehicleDetails {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number | null;
  fuel: string;
  priceMLC: number;
  priceCUP: number | null;
  images: string[];
  description: string;
  specifications: {
    engine: string;
    transmission: string;
    color: string;
    seats: number;
    features: string[];
  };
}

export default async function VehicleDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    // Construye la URL absoluta para fetch en el server
    const host = (await headers()).get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const apiUrl = `${protocol}://${host}/api/vehicles/${params.id}`;
    const response = await fetch(apiUrl, { cache: 'no-store' });

    if (!response.ok) {
      notFound();
    }

    const vehicle: VehicleDetails = await response.json();

    if (!vehicle) {
      notFound();
    }

    return (
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vehicle Images Carousel */}
          <div className="lg:col-span-2">
            <CarCarousel images={vehicle.images} />
          </div>

          {/* Vehicle Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {vehicle.brand} {vehicle.model} {vehicle.year}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Price */}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Precio:</span>
                    <span className="text-2xl font-bold text-red-600">
                      ${vehicle.priceMLC.toLocaleString()} MLC
                    </span>
                  </div>

                  {/* Specifications */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Especificaciones</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Motor:</p>
                        <p className="font-medium">{vehicle.specifications.engine}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Transmisión:</p>
                        <p className="font-medium">{vehicle.specifications.transmission}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Color:</p>
                        <p className="font-medium">{vehicle.specifications.color}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Asientos:</p>
                        <p className="font-medium">{vehicle.specifications.seats}</p>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Características</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {vehicle.specifications.features.map((feature, index) => (
                        <li key={index} className="text-gray-600">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Buy Now Button */}
                  <div className="mt-8">
                    <BuyNowButton
                      id={vehicle.id}
                      name={`${vehicle.brand} ${vehicle.model}`}
                      price={vehicle.priceMLC}
                      image={vehicle.images[0]}
                      type="car"
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Description */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">{vehicle.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in VehicleDetailsPage:', error);
    notFound();
  }
}
