"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Esquema de validación con Zod
const registerSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellidos: z.string().min(2, 'Los apellidos son requeridos'),
  email: z.string().email('Ingresa un correo electrónico válido'),
  telefono: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: authRegister } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: '',
      apellidos: '',
      email: '',
      telefono: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      
      // Formatear la fecha de nacimiento para el backend
      const fechaNacimiento = new Date('1990-01-01').toISOString().split('T')[0];
      
      // Llamar a la función de registro del contexto de autenticación
      await authRegister({
        email: data.email,
        password: data.password,
        nombre: data.nombre,
        apellidos: data.apellidos,
        telefono: data.telefono,
        fecha_nacimiento: fechaNacimiento,
      });
      
      toast({
        title: '¡Registro exitoso!',
        description: 'Tu cuenta ha sido creada correctamente. Redirigiendo...',
      });
      
      // Redirigir al dashboard después de 1.5 segundos
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      
      let errorMessage = 'Ocurrió un error al registrar tu cuenta. Por favor, inténtalo de nuevo.';
      
      if (error instanceof Error) {
        if (error.message.includes('email already exists')) {
          errorMessage = 'Este correo electrónico ya está registrado.';
        }
      }
      
      toast({
        variant: 'destructive',
        title: 'Error en el registro',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12 bg-gradient-to-b from-gray-50 to-gray-100">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Crear una cuenta</CardTitle>
          <CardDescription className="text-gray-600">
            Ingresa tus datos para registrarte en nuestra plataforma
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="px-8 py-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-gray-700">Nombre</Label>
                <Input
                  id="nombre"
                  placeholder="Juan"
                  className={`${errors.nombre ? 'border-red-500' : ''}`}
                  {...register('nombre')}
                  disabled={isLoading}
                />
                {errors.nombre && (
                  <p className="text-sm text-red-500 mt-1">{errors.nombre.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos" className="text-gray-700">Apellidos</Label>
                <Input
                  id="apellidos"
                  placeholder="Pérez García"
                  className={`${errors.apellidos ? 'border-red-500' : ''}`}
                  {...register('apellidos')}
                  disabled={isLoading}
                />
                {errors.apellidos && (
                  <p className="text-sm text-red-500 mt-1">{errors.apellidos.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                className={`${errors.email ? 'border-red-500' : ''}`}
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-gray-700">Teléfono</Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="+1234567890"
                className={`${errors.telefono ? 'border-red-500' : ''}`}
                {...register('telefono')}
                disabled={isLoading}
              />
              {errors.telefono && (
                <p className="text-sm text-red-500 mt-1">{errors.telefono.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
              <Input
                id="password"
                type="password"
                className={`${errors.password ? 'border-red-500' : ''}`}
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700">
                Confirmar Contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                className={`${errors.confirmPassword ? 'border-red-500' : ''}`}
                {...register('confirmPassword')}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox 
                id="terms" 
                onCheckedChange={(checked) => 
                  register('terms').onChange({ target: { value: checked, name: 'terms' } })
                }
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="terms" className="text-sm font-medium text-gray-700">
                  Acepto los{' '}
                  <Link 
                    href="/terminos" 
                    className="text-primary hover:underline"
                    target="_blank"
                  >
                    términos y condiciones
                  </Link>
                </Label>
                {errors.terms && (
                  <p className="text-sm text-red-500">{errors.terms.message}</p>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col px-8 pb-8 pt-2 space-y-4">
            <Button 
              type="submit" 
              className="w-full h-11 text-base bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                'Registrarse'
              )}
            </Button>
            
            <p className="text-sm text-center text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                href="/login" 
                className="font-medium text-primary hover:underline"
              >
                Iniciar Sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
