import { NextResponse } from 'next/server';

export interface Vehicle {
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

// En una aplicación real, esto sería una base de datos
export let vehicles: Record<string, Vehicle> = {
  '1': {
    id: '1',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2023,
    mileage: 10000,
    fuel: 'Gasolina',
    priceMLC: 25000,
    priceCUP: null,
    images: [
      '/vehicles/toyota-corolla-1.jpg',
      '/vehicles/toyota-corolla-2.jpg',
      '/vehicles/toyota-corolla-3.jpg'
    ],
    description: 'Toyota Corolla 2023 en excelente estado. Vehículo con mantenimiento al día y historial de servicio completo.',
    specifications: {
      engine: '1.8L 4 cilindros',
      transmission: 'Automática',
      color: 'Blanco',
      seats: 5,
      features: [
        'Aire acondicionado',
        'Dirección asistida',
        'Vidrios eléctricos',
        'Cierre centralizado',
        'Rines de aleación'
      ]
    }
  },
  '2': {
    id: '2',
    brand: 'Honda',
    model: 'Civic',
    year: 2022,
    mileage: 15000,
    fuel: 'Gasolina',
    priceMLC: 22000,
    priceCUP: null,
    images: [
      '/vehicles/honda-civic-1.jpg',
      '/vehicles/honda-civic-2.jpg',
      '/vehicles/honda-civic-3.jpg'
    ],
    description: 'Honda Civic 2022 en perfecto estado. Bajo kilometraje y excelente rendimiento de combustible.',
    specifications: {
      engine: '1.5L Turbo',
      transmission: 'Automática CVT',
      color: 'Gris',
      seats: 5,
      features: [
        'Aire acondicionado',
        'Cámara de retroceso',
        'Bluetooth',
        'Control de crucero',
        'Pantalla táctil'
      ]
    }
  }
};

// GET - Obtener todos los vehículos o un vehículo específico por ID
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const vehicle = vehicles[id];
    
    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehículo no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(vehicle);
  }
  
  // Si no se proporciona un ID, devolver todos los vehículos
  return NextResponse.json(vehicles);
}

// POST - Crear un nuevo vehículo
export async function POST(request: Request) {
  try {
    const newVehicle: Vehicle = await request.json();
    
    // Validación básica
    if (!newVehicle.brand || !newVehicle.model || !newVehicle.year || !newVehicle.priceMLC) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }
    
    // Asegurar que el ID es único
    const id = newVehicle.id || Date.now().toString();
    newVehicle.id = id;
    
    // Guardar el nuevo vehículo
    vehicles[id] = newVehicle;
    
    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json(
      { error: 'Error al crear el vehículo' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un vehículo existente
export async function PUT(request: Request) {
  try {
    const updatedVehicle: Vehicle = await request.json();
    const { id } = updatedVehicle;
    
    if (!id || !vehicles[id]) {
      return NextResponse.json(
        { error: 'Vehículo no encontrado' },
        { status: 404 }
      );
    }
    
    // Actualizar el vehículo
    vehicles[id] = { ...vehicles[id], ...updatedVehicle };
    
    return NextResponse.json(vehicles[id]);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el vehículo' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un vehículo
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id || !vehicles[id]) {
    return NextResponse.json(
      { error: 'Vehículo no encontrado' },
      { status: 404 }
    );
  }
  
  // Eliminar el vehículo
  const deletedVehicle = vehicles[id];
  delete vehicles[id];
  
  return NextResponse.json(
    { message: 'Vehículo eliminado correctamente', vehicle: deletedVehicle }
  );
}
