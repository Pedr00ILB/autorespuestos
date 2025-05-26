import { NextResponse } from 'next/server';
import { accessories } from '@/lib/data';

interface Accesorio {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const accesorio = accessories.find(a => a.id === id);
  
  if (!accesorio) {
    return NextResponse.json(
      { error: 'Accesorio no encontrado' },
      { status: 404 }
    );
  }

  return NextResponse.json(accesorio);
}