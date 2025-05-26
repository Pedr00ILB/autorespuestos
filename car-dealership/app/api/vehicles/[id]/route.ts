import { NextResponse } from 'next/server';

// Importar los tipos y la base de datos de vehículos desde la API principal
// En una aplicación real, esta sería una base de datos compartida
import { vehicles } from '../route';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
  }

  const vehicle = vehicles[id];
  if (!vehicle) {
    return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });
  }

  return NextResponse.json(vehicle);
}

// También implementamos PUT y DELETE para operaciones específicas por ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    if (!id || !vehicles[id]) {
      return NextResponse.json(
        { error: 'Vehículo no encontrado' },
        { status: 404 }
      );
    }
    
    const updatedData = await request.json();
    
    // Actualizar el vehículo
    vehicles[id] = { ...vehicles[id], ...updatedData, id };
    
    return NextResponse.json(vehicles[id]);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el vehículo' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  
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
