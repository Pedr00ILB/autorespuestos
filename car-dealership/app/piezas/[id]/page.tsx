import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, CheckCircle, AlertCircle } from 'lucide-react';
import AddToCartSection from './add-to-cart-section';

// Datos de ejemplo para piezas (en producción, estos datos vendrían de una API o base de datos)
const piezas = [
  {
    id: '1',
    nombre: 'Filtro de Aceite Premium',
    categoria: 'Filtros',
    compatibilidad: 'Toyota, Honda, Nissan',
    precio: 12.99,
    descuento: true,
    precioAnterior: 15.99,
    imagen: '/placeholder.svg?height=400&width=400',
    stock: 45,
    descripcion: 'Filtro de aceite de alta calidad diseñado para maximizar el rendimiento del motor y prolongar su vida útil. Este filtro captura partículas microscópicas y contaminantes para mantener tu motor funcionando de manera óptima.',
    especificaciones: {
      marca: 'FilterPro',
      modelo: 'FP-2023',
      material: 'Metal y papel de filtro sintético',
      dimensiones: '7.5 x 7.5 x 10 cm',
      peso: '0.3 kg',
      garantia: '1 año'
    }
  },
  {
    id: '2',
    nombre: 'Pastillas de Freno Delanteras',
    categoria: 'Frenos',
    compatibilidad: 'Ford, Chevrolet',
    precio: 39.99,
    descuento: false,
    precioAnterior: null,
    imagen: '/placeholder.svg?height=400&width=400',
    stock: 28,
    descripcion: 'Juego de pastillas de freno delanteras de alta calidad que ofrecen un rendimiento de frenado superior y una vida útil prolongada. Diseñadas para minimizar el ruido y el polvo de freno.',
    especificaciones: {
      marca: 'BrakeMaster',
      modelo: 'BM-F150',
      material: 'Cerámica semimetálica',
      dimensiones: '12 x 5 x 2 cm',
      peso: '0.8 kg',
      garantia: '2 años'
    }
  },
  {
    id: '3',
    nombre: 'Batería de Alto Rendimiento',
    categoria: 'Eléctrico',
    compatibilidad: 'Universal',
    precio: 89.99,
    descuento: true,
    precioAnterior: 109.99,
    imagen: '/placeholder.svg?height=400&width=400',
    stock: 15,
    descripcion: 'Batería de alta capacidad y larga duración diseñada para ofrecer un arranque fiable incluso en condiciones extremas. Con tecnología de absorción de vibraciones y resistencia a temperaturas extremas.',
    especificaciones: {
      marca: 'PowerMax',
      modelo: 'PM-600',
      capacidad: '60Ah',
      voltaje: '12V',
      dimensiones: '24 x 17 x 18 cm',
      peso: '14 kg',
      garantia: '3 años'
    }
  },
];

// Esta función genera todos los posibles valores para el parámetro dinámico [id]
// Next.js la usará para pregenerar todas las rutas posibles durante el build
export function generateStaticParams() {
  return piezas.map((pieza) => ({
    id: pieza.id,
  }));
}

export default function PiezaDetallesPage({
  params,
}: {
  params: { id: string }
}) {
  // En este punto, params ya no es una promesa porque Next.js garantiza
  // que las rutas generadas por generateStaticParams reciben params como un objeto simple
  const id = params.id;
  
  // Buscar la pieza por ID
  const pieza = piezas.find((p) => p.id === id);
  
  // Si la pieza no existe, mostrar la página 404
  if (!pieza) {
    notFound();
  }
  
  // Determinar el estado del stock
  const stockStatus = pieza.stock > 20 
    ? { label: 'En stock', color: 'text-green-600', icon: <CheckCircle className="h-5 w-5 mr-1" /> }
    : pieza.stock > 5
    ? { label: 'Stock limitado', color: 'text-amber-600', icon: <AlertCircle className="h-5 w-5 mr-1" /> }
    : { label: 'Últimas unidades', color: 'text-red-600', icon: <AlertCircle className="h-5 w-5 mr-1" /> };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Imagen de la pieza */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="relative aspect-square">
            <Image
              src={pieza.imagen}
              alt={pieza.nombre}
              fill
              className="object-contain"
            />
            {pieza.descuento && (
              <Badge className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1">
                Oferta
              </Badge>
            )}
          </div>
        </div>

        {/* Detalles de la pieza */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{pieza.nombre}</CardTitle>
            <p className="text-gray-500">{pieza.categoria}</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Precio */}
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">${pieza.precio.toFixed(2)}</span>
              {pieza.descuento && (
                <span className="text-lg text-gray-500 line-through">
                  ${pieza.precioAnterior?.toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Compatibilidad */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Compatibilidad</h3>
              <p className="text-gray-600">{pieza.compatibilidad}</p>
            </div>
            
            {/* Disponibilidad */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Disponibilidad</h3>
              <div className={`flex items-center ${stockStatus.color}`}>
                {stockStatus.icon}
                <span>{stockStatus.label}</span>
              </div>
              <div className="flex items-center text-gray-600 mt-2">
                <Truck className="h-5 w-5 mr-1" />
                <span>Entrega en 24-48 horas</span>
              </div>
            </div>
            
            {/* Botón de añadir al carrito (componente cliente) */}
            <AddToCartSection 
              id={pieza.id} 
              nombre={pieza.nombre} 
              precio={pieza.precio} 
              imagen={pieza.imagen} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Descripción y especificaciones */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Descripción */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Descripción</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">{pieza.descripcion}</p>
          </CardContent>
        </Card>

        {/* Especificaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Especificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {pieza.especificaciones && Object.entries(pieza.especificaciones).map(([key, value]) => (
                <li key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-600 capitalize">{key}:</span>
                  <span className="font-medium">{value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
