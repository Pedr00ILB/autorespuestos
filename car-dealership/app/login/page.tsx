"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

const loginSchema = z.object({
  email: z.string().email('Debe ser un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();
  
  // Redirigir si ya está autenticado
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthRedirect({
    redirectIfAuthenticated: true,
    redirectTo: '/dashboard'
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      
      toast({
        title: '¡Bienvenido!',
        description: 'Has iniciado sesión correctamente.',
      });
      
      // La redirección se manejará automáticamente con el hook useAuthRedirect
    } catch (error: any) {
      console.error('Error en el inicio de sesión:', error);
      toast({
        title: 'Error',
        description: error.message || 'Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loader mientras se verifica la autenticación
  if (isAuthLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 p-8 pb-6">
          <CardTitle className="text-3xl font-bold text-center">
            Iniciar Sesión
          </CardTitle>
          <CardDescription className="text-center text-base">
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 px-8 pb-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className={`h-12 text-base ${errors.email ? 'border-red-500' : ''}`}
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-base">Contraseña</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className={`h-12 text-base ${errors.password ? 'border-red-500' : ''}`}
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 p-8 pt-0">
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              ¿No tienes una cuenta?{' '}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Regístrate
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
