'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Panel de Control</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Tarjeta de bienvenida */}
        <Card>
          <CardHeader>
            <CardTitle>Bienvenido/a</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Hola, <span className="font-medium">{user?.first_name || 'Usuario'}</span>. 
              ¡Bienvenido al panel de administración de Car Dealership!
            </p>
          </CardContent>
        </Card>

        {/* Tarjeta de estadísticas */}
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Vehículos en stock</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ventas este mes</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tarjeta de acciones rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => router.push('/dashboard/vehicles/new')}
            >
              Agregar vehículo
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => router.push('/dashboard/sales')}
            >
              Ver ventas
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => router.push('/dashboard/customers')}
            >
              Ver clientes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
