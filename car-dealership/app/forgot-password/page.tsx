"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

const forgotPasswordSchema = z.object({
  email: z.string().email('Debe ser un correo electrónico válido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();
  const { forgotPassword } = useAuth();
  
  // Redirigir si ya está autenticado
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthRedirect({
    redirectIfAuthenticated: true,
    redirectTo: '/dashboard'
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      await forgotPassword(data.email);
      
      setEmailSent(true);
      
      toast({
        title: 'Correo enviado',
        description: 'Hemos enviado un correo con las instrucciones para restablecer tu contraseña.',
      });
    } catch (error: any) {
      console.error('Error al solicitar restablecimiento de contraseña:', error);
      
      let errorMessage = 'Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo.';
      
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 p-8 pb-6">
          <CardTitle className="text-3xl font-bold text-center">
            {emailSent ? 'Revisa tu correo' : 'Restablecer Contraseña'}
          </CardTitle>
          <CardDescription className="text-center text-base">
            {emailSent 
              ? 'Hemos enviado un correo con las instrucciones para restablecer tu contraseña.'
              : 'Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.'}
          </CardDescription>
        </CardHeader>
        
        {!emailSent ? (
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
                    Enviando...
                  </>
                ) : (
                  'Enviar Instrucciones'
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
        ) : (
          <CardFooter className="flex flex-col space-y-4 p-8 pt-0">
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-md text-sm">
              Si el correo electrónico existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.
            </div>
            <Button 
              asChild
              variant="outline"
              className="w-full h-12 text-base font-medium"
            >
              <Link href="/login">
                Volver al inicio de sesión
              </Link>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
