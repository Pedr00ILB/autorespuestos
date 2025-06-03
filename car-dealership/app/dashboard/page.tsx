"use client";

import { useAuth } from '@/lib/auth/AuthProvider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import UserManagement from './userManagent/page';
import EmployeeManagement from './EmployeeManagement/page';
import CarManagement from './carManagement/page';
import PartManagement from './partManagement/page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, User, Package, DollarSign, Users, ShoppingCart, Shield, Car, Wrench } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirigir si no está autenticado o no es admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push('/login');
    } else if (!isLoading && user && !user.es_admin) {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, isLoading, router, user]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Panel de Control
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Bienvenido/a, {user?.first_name || 'Administrador'}
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Resumen</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Usuarios</span>
          </TabsTrigger>
          <TabsTrigger value="employees" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Empleados</span>
          </TabsTrigger>
          <TabsTrigger value="cars" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            <span className="hidden sm:inline">Vehículos</span>
          </TabsTrigger>
          <TabsTrigger value="parts" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            <span className="hidden sm:inline">Piezas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Usuarios
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  +120 desde el mes pasado
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Ventas
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +12% desde el mes pasado
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Vehículos
                </CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+124</div>
                <p className="text-xs text-muted-foreground">
                  +24 desde el mes pasado
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Piezas
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+1,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% desde el mes pasado
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center justify-between border-b pb-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Nuevo {['usuario', 'vehículo', 'empleado', 'pedido', 'reseña'][item % 5]}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ID: {2000 + item}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Hace {item} hora{item !== 1 ? 's' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Gráfico de estadísticas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="employees">
          <EmployeeManagement />
        </TabsContent>
        
        <TabsContent value="cars">
          <CarManagement />
        </TabsContent>
        
        <TabsContent value="parts">
          <PartManagement />
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Button 
          variant="outline" 
          onClick={async () => {
            await logout();
            router.push('/login');
          }}
          className="mt-4"
        >
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
