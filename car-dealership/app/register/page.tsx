"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { Loader2 } from 'lucide-react';
import { TermsLinks } from '@/components/legal/terms-links';

// Esquema de validación con Zod
const registerSchema = z.object({
  first_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  last_name: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  email: z.string().email('Debe ser un correo electrónico válido'),
  telefono: z.string().min(9, 'El teléfono debe tener al menos 9 dígitos'),
  fecha_nacimiento: z.string().refine(
    (value) => {
      const date = new Date(value);
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 120); // Edad máxima: 120 años
      
      return date <= today && date >= minDate;
    }, 
    { message: 'Debes tener al menos 18 años y no más de 120' }
  ),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string()
}).refine(
  (data) => data.password === data.confirmPassword, 
  {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  }
);

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { register: registerUser } = useAuth();
  const { toast } = useToast();
  
  // Redirigir si ya está autenticado
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthRedirect({
    redirectIfAuthenticated: true,
    redirectTo: '/dashboard'
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      telefono: '',
      fecha_nacimiento: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (!acceptTerms) {
      toast({
        title: "Términos y condiciones",
        description: "Debes aceptar los términos y condiciones para continuar",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Extraer confirmPassword ya que no lo necesitamos para el registro
      const { confirmPassword, ...userData } = data;
      
      await registerUser(userData);
      
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente. Redirigiendo...",
      });
      
      // La redirección se manejará automáticamente con el hook useAuthRedirect
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorTitle = 'Error';
      let errorMessage = 'Error al registrar el usuario. Por favor, inténtalo de nuevo.';
      
      // Manejar errores de validación del backend
      if (error.details) {
        // Si hay errores de validación específicos por campo
        if (typeof error.details === 'object') {
          const fieldErrors = Object.entries(error.details)
            .map(([field, messages]) => {
              // Mapear nombres de campos a etiquetas más amigables
              const fieldLabels: Record<string, string> = {
                username: 'Nombre de usuario',
                email: 'Correo electrónico',
                password: 'Contraseña',
                first_name: 'Nombre',
                last_name: 'Apellidos',
                telefono: 'Teléfono',
                fecha_nacimiento: 'Fecha de nacimiento'
              };
              
              const label = fieldLabels[field] || field;
              const message = Array.isArray(messages) ? messages.join(' ') : String(messages);
              return `• ${label}: ${message}`;
            })
            .join('\n');
          
          errorTitle = 'Error de validación';
          errorMessage = `Por favor, corrige los siguientes errores:\n${fieldErrors}`;
        } else if (typeof error.details === 'string') {
          errorMessage = error.details;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
        duration: 10000, // Mostrar por más tiempo para que el usuario pueda leer los errores
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
            Crear Cuenta
          </CardTitle>
          <CardDescription className="text-center text-base">
            Completa el formulario para crear tu cuenta
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 px-8 pb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-base">Nombre</Label>
                <Input 
                  id="first_name" 
                  placeholder="Tu nombre" 
                  className={`h-12 text-base ${errors.first_name ? 'border-red-500' : ''}`}
                  {...register('first_name')}
                  disabled={isLoading}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500">{errors.first_name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-base">Apellidos</Label>
                <Input 
                  id="last_name" 
                  placeholder="Tus apellidos" 
                  className={`h-12 text-base ${errors.last_name ? 'border-red-500' : ''}`}
                  {...register('last_name')}
                  disabled={isLoading}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500">{errors.last_name.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">Correo Electrónico</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="ejemplo@correo.com" 
                className={`h-12 text-base ${errors.email ? 'border-red-500' : ''}`}
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-base">Teléfono</Label>
              <Input 
                id="telefono" 
                type="tel" 
                placeholder="+34 123 456 789" 
                className={`h-12 text-base ${errors.telefono ? 'border-red-500' : ''}`}
                {...register('telefono')}
                disabled={isLoading}
              />
              {errors.telefono && (
                <p className="text-sm text-red-500">{errors.telefono.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fecha_nacimiento" className="text-base">Fecha de Nacimiento</Label>
              <Input 
                id="fecha_nacimiento" 
                type="date" 
                className={`h-12 text-base ${errors.fecha_nacimiento ? 'border-red-500' : ''}`}
                {...register('fecha_nacimiento')}
                disabled={isLoading}
              />
              {errors.fecha_nacimiento && (
                <p className="text-sm text-red-500">{errors.fecha_nacimiento.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">Contraseña</Label>
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
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-base">Confirmar Contraseña</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="••••••••"
                className={`h-12 text-base ${errors.confirmPassword ? 'border-red-500' : ''}`}
                {...register('confirmPassword')}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                className="mt-1"
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Acepto los términos y condiciones
                </label>
                <TermsLinks className="block mt-1" showAnd={false} />
                {!acceptTerms && (
                  <p className="text-sm text-destructive">
                    Debes aceptar los términos para continuar
                  </p>
                )}
              </div>
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
                  Creando cuenta...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                href="/login" 
                className="font-medium text-primary hover:underline"
              >
                Inicia Sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
