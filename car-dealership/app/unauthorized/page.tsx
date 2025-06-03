"use client";

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader className="text-center space-y-4 p-8 pb-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Acceso no autorizado
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-6">
          <div className="space-y-4 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              No tienes los permisos necesarios para acceder a esta página. 
              Por favor, contacta con un administrador si crees que esto es un error.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 px-8 pb-8 pt-0">
          <Button 
            onClick={() => router.back()}
            variant="outline"
            className="w-full"
          >
            Volver atrás
          </Button>
          <Button 
            onClick={() => router.push('/')}
            className="w-full"
          >
            Ir al inicio
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
