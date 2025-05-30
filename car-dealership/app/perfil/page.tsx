'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Lock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface UserProfile {
  id: number;
  email: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  fecha_nacimiento: string | null;
  fecha_registro: string;
  is_active: boolean;
  is_staff: boolean;
}

export default function ProfilePage() {
  const { user, loading, getToken } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    direccion: '',
    fecha_nacimiento: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar el perfil del usuario
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        const token = await getToken();
        if (!token) {
          throw new Error('No se pudo obtener el token de autenticación');
        }
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/perfil/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Error al cargar el perfil');
        }
        
        const data = await response.json();
        setProfile(data);
        setFormData({
          nombre: data.nombre || '',
          apellidos: data.apellidos || '',
          telefono: data.telefono || '',
          direccion: data.direccion || '',
          fecha_nacimiento: data.fecha_nacimiento || '',
        });
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
        toast({
          title: 'Error',
          description: 'No se pudo cargar el perfil del usuario',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [user, getToken, toast]);

  // Redirigir si no hay usuario autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar el error del campo cuando se modifica
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son obligatorios';
    }
    
    if (formData.telefono && !/^[0-9+\s-]{0,20}$/.test(formData.telefono)) {
      newErrors.telefono = 'Número de teléfono no válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/perfil/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar el perfil');
      }
      
      const data = await response.json();
      setProfile(data);
      setIsEditing(false);
      
      toast({
        title: '¡Perfil actualizado!',
        description: 'Tus datos se han actualizado correctamente.',
      });
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el perfil. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setFormData({
        nombre: profile.nombre || '',
        apellidos: profile.apellidos || '',
        telefono: profile.telefono || '',
        direccion: profile.direccion || '',
        fecha_nacimiento: profile.fecha_nacimiento || '',
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // Redirección manejada por el efecto
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Columna izquierda - Información del perfil */}
          <div className="md:w-1/3">
            <Card className="shadow-lg">
              <CardHeader className="border-b">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-12 w-12 text-primary" />
                    </div>
                    {profile?.is_staff && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                        Administrador
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-center">
                    {profile?.nombre} {profile?.apellidos}
                  </h2>
                  <p className="text-sm text-muted-foreground text-center">{profile?.email}</p>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Miembro desde</p>
                    <p className="text-sm font-medium">
                      {profile?.fecha_registro 
                        ? format(new Date(profile.fecha_registro), 'PPP', { locale: es })
                        : 'No disponible'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estado de la cuenta</p>
                    <p className="text-sm font-medium">
                      {profile?.is_active ? 'Activa' : 'Inactiva'}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-6">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/cambiar-contrasena">
                    Cambiar contraseña
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Columna derecha - Formulario de edición */}
          <div className="md:w-2/3">
            <Card className="shadow-lg">
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <CardTitle>Información personal</CardTitle>
                  {!isEditing ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar perfil
                    </Button>
                  ) : (
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancelar
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleSubmit}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Guardar cambios
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
                <CardDescription>
                  Actualiza tu información personal y de contacto.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre</Label>
                      {isEditing ? (
                        <div>
                          <Input
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            disabled={isSaving}
                            className={errors.nombre ? 'border-red-500' : ''}
                          />
                          {errors.nombre && (
                            <p className="text-sm text-red-500 mt-1 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {errors.nombre}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {profile?.nombre || 'No especificado'}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="apellidos">Apellidos</Label>
                      {isEditing ? (
                        <div>
                          <Input
                            id="apellidos"
                            name="apellidos"
                            value={formData.apellidos}
                            onChange={handleInputChange}
                            disabled={isSaving}
                            className={errors.apellidos ? 'border-red-500' : ''}
                          />
                          {errors.apellidos && (
                            <p className="text-sm text-red-500 mt-1 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {errors.apellidos}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {profile?.apellidos || 'No especificados'}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {profile?.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      {isEditing ? (
                        <div>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="telefono"
                              name="telefono"
                              type="tel"
                              value={formData.telefono}
                              onChange={handleInputChange}
                              disabled={isSaving}
                              className={`pl-10 ${errors.telefono ? 'border-red-500' : ''}`}
                            />
                          </div>
                          {errors.telefono && (
                            <p className="text-sm text-red-500 mt-1 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {errors.telefono}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {profile?.telefono || 'No especificado'}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="direccion">Dirección</Label>
                      {isEditing ? (
                        <div>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="direccion"
                              name="direccion"
                              value={formData.direccion}
                              onChange={handleInputChange}
                              disabled={isSaving}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">
                            {profile?.direccion || 'No especificada'}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
                      {isEditing ? (
                        <Input
                          id="fecha_nacimiento"
                          name="fecha_nacimiento"
                          type="date"
                          value={formData.fecha_nacimiento || ''}
                          onChange={handleInputChange}
                          disabled={isSaving}
                          max={new Date().toISOString().split('T')[0]}
                        />
                      ) : (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {profile?.fecha_nacimiento 
                              ? format(new Date(profile.fecha_nacimiento), 'PPP', { locale: es })
                              : 'No especificada'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {/* Sección de preferencias */}
            <Card className="mt-6 shadow-lg">
              <CardHeader className="border-b">
                <CardTitle>Preferencias</CardTitle>
                <CardDescription>
                  Configura tus preferencias de notificaciones y privacidad.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificaciones por correo electrónico</h4>
                      <p className="text-sm text-muted-foreground">
                        Recibe actualizaciones y promociones por correo electrónico.
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Gestionar
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Privacidad</h4>
                      <p className="text-sm text-muted-foreground">
                        Controla quién puede ver tu información personal.
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configurar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
