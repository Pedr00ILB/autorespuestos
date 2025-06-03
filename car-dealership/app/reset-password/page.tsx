"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

const resetPasswordSchema = z.object({
  new_password1: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  new_password2: z.string(),
}).refine(
  (data) => data.new_password1 === data.new_password2,
  {
    message: 'Las contraseñas no coinciden',
    path: ['new_password2'],
  }
);

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const uid = searchParams?.get('uid') || '';
  const token = searchParams?.get('token') || '';
  
  // Verificar que los parámetros necesarios estén presentes
  const isValidLink = !!(uid && token);
  
  // Redirigir si ya está autenticado
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthRedirect({
    redirectIfAuthenticated: true,
    redirectTo: '/dashboard'
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      new_password1: '',
      new_password2: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!isValidLink) return;
    
    try {
      setIsLoading(true);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/password/reset/confirm/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          token,
          new_password1: data.new_password1,
          new_password2: data.new_password2,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al restablecer la contraseña');
      }
      
      setIsSuccess(true);
      
      toast({
        title: 'Contraseña restablecida',
        description: 'Tu contraseña ha sido actualizada correctamente.',
      });
    } catch (error: any) {
      console.error('Error al restablecer la contraseña:', error);
      
      let errorMessage = 'Ocurrió un error al restablecer la contraseña. Por favor, inténtalo de nuevo.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
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

  if (!isValidLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1 p-8 pb-6">
            <CardTitle className="text-3xl font-bold text-center text-red-600">
              Enlace Inválido
            </CardTitle>
            <CardDescription className="text-center text-base">
              El enlace de restablecimiento de contraseña no es válido o ha expirado.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-4 p-8 pt-0">
            <Button 
              asChild
              className="w-full h-12 text-base font-medium"
            >
              <Link href="/forgot-password">
                Solicitar nuevo enlace
              </Link>
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link 
                href="/login" 
                className="font-medium text-primary hover:underline"
              >
                Volver al inicio de sesión
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1 p-8 pb-6">
            <CardTitle className="text-3xl font-bold text-center text-green-600">
              ¡Contraseña Actualizada!
            </CardTitle>
            <CardDescription className="text-center text-base">
              Tu contraseña ha sido actualizada correctamente. Ahora puedes iniciar sesión con tu nueva contraseña.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-4 p-8 pt-0">
            <Button 
              asChild
              className="w-full h-12 text-base font-medium"
            >
              <Link href="/login">
                Iniciar Sesión
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 p-8 pb-6">
          <CardTitle className="text-3xl font-bold text-center">
            Restablecer Contraseña
          </CardTitle>
          <CardDescription className="text-center text-base">
            Ingresa tu nueva contraseña
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 px-8 pb-6">
            <div className="space-y-2">
              <Label htmlFor="new_password1" className="text-base">Nueva Contraseña</Label>
              <Input
                id="new_password1"
                type="password"
                placeholder="••••••••"
                className={`h-12 text-base ${errors.new_password1 ? 'border-red-500' : ''}`}
                {...register('new_password1')}
                disabled={isLoading}
              />
              {errors.new_password1 && (
                <p className="text-sm text-red-500">{errors.new_password1.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_password2" className="text-base">Confirmar Nueva Contraseña</Label>
              <Input
                id="new_password2"
                type="password"
                placeholder="••••••••"
                className={`h-12 text-base ${errors.new_password2 ? 'border-red-500' : ''}`}
                {...register('new_password2')}
                disabled={isLoading}
              />
              {errors.new_password2 && (
                <p className="text-sm text-red-500">{errors.new_password2.message}</p>
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
                  Actualizando...
                </>
              ) : (
                'Restablecer Contraseña'
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link 
                href="/login" 
                className="font-medium text-primary hover:underline"
              >
                Volver al inicio de sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
