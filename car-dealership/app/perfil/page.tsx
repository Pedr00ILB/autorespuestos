"use client";

import { useAuth } from '@/lib/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, User, Mail, Phone, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ProfilePage() {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        telefono: user.telefono || '',
        fecha_nacimiento: user.fecha_nacimiento || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateProfile(formData);
      toast({
        title: "¡Perfil actualizado!",
        description: "Tus datos se han actualizado correctamente.",
      });
    } catch (error: any) {
      console.error('Error al actualizar el perfil:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el perfil. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 py-12">
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center p-8 pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight">Mi Perfil</CardTitle>
          <CardDescription>
            Actualiza tu información personal y preferencias de cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-base">
                  Nombre
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="first_name"
                    placeholder="Tu nombre"
                    className="pl-10 h-12 text-base"
                    value={formData.first_name}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-base">
                  Apellidos
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="last_name"
                    placeholder="Tus apellidos"
                    className="pl-10 h-12 text-base"
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10 h-12 text-base"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefono" className="text-base">
                  Teléfono
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="+34 123 456 789"
                    className="pl-10 h-12 text-base"
                    value={formData.telefono}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fecha_nacimiento" className="text-base">
                  Fecha de Nacimiento
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="fecha_nacimiento"
                    type="date"
                    className="pl-10 h-12 text-base"
                    value={formData.fecha_nacimiento}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-base block">
                  Miembro desde
                </Label>
                <div className="h-12 flex items-center pl-2 text-sm text-gray-500 dark:text-gray-400">
                  {user.date_joined ? (
                    format(new Date(user.date_joined), "d 'de' MMMM 'de' yyyy", { locale: es })
                  ) : 'No disponible'}
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
