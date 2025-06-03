'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authService, User } from './auth-service';

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  password: string;
  password2: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  const router = useRouter();
  const pathname = usePathname();

  // Cargar el usuario al iniciar
  const loadUser = useCallback(async () => {
    try {
      const currentUser = authService.getCurrentUser();
      const authenticated = authService.isAuthenticated();
      
      if (authenticated && currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        setIsAdmin(currentUser.es_admin === true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Efecto para cargar el usuario al montar el componente
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Iniciar sesión
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await authService.login({ email, password });
      await loadUser();
      
      // Redirigir al dashboard o a la página anterior
      const redirectTo = localStorage.getItem('redirectTo') || '/';
      router.push(redirectTo);
      localStorage.removeItem('redirectTo');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Registrar nuevo usuario
  const register = async (userData: RegisterData): Promise<void> => {
    try {
      console.log('Iniciando registro con datos:', userData);
      setIsLoading(true);
      
      // Validar que las contraseñas coincidan
      if (userData.password !== userData.password2) {
        throw new Error('Las contraseñas no coinciden');
      }
      
      // Llamar al servicio de autenticación
      await authService.register(userData);
      
      // Cargar los datos del usuario
      await loadUser();
      
      // Redirigir al dashboard después del registro exitoso
      router.push('/');
    } catch (error: any) {
      console.error('Error en AuthProvider.register:', {
        error,
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
        response: error?.response,
        details: error?.details
      });
      
      // Mensaje de error predeterminado
      let errorMessage = 'Error al registrar el usuario';
      
      // Si el error ya tiene un mensaje claro, usarlo directamente
      if (error?.message && error.message !== 'Error al registrar el usuario (400)') {
        errorMessage = error.message;
      }
      // Si hay una respuesta del servidor, intentar extraer detalles
      else if (error?.response) {
        try {
          // El error ya debería estar parseado en el servicio
          const errorData = error.details || {};
          console.error('Datos de error del servidor:', errorData);
          
          // Usar el mensaje del error si ya fue procesado
          if (error.message && error.message !== 'Error al registrar el usuario (400)') {
            errorMessage = error.message;
          }
          // Si hay errores de validación específicos
          else if (errorData.non_field_errors) {
            errorMessage = Array.isArray(errorData.non_field_errors) 
              ? errorData.non_field_errors.join('; ')
              : String(errorData.non_field_errors);
          }
          // Si hay errores de campos específicos
          else if (typeof errorData === 'object') {
            const fieldErrors = [];
            for (const [field, errors] of Object.entries(errorData)) {
              if (Array.isArray(errors)) {
                fieldErrors.push(`${field}: ${errors.join(', ')}`);
              } else if (typeof errors === 'string') {
                fieldErrors.push(errors);
              } else if (errors) {
                fieldErrors.push(JSON.stringify(errors));
              }
            }
            
            if (fieldErrors.length > 0) {
              errorMessage = `Error de validación: ${fieldErrors.join('; ')}`;
            }
          }
        } catch (parseError) {
          console.error('Error al analizar la respuesta de error:', parseError);
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      console.error('Mensaje de error final para el usuario:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar autenticación
  const checkAuth = async (): Promise<boolean> => {
    try {
      return authService.isAuthenticated();
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  };

  // Protección de rutas
  useEffect(() => {
    const checkAuthentication = async () => {
      if (isLoading || !pathname) return;

      const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/'];
      const isPublicPath = publicPaths.some(path => 
        pathname === path || pathname.startsWith(`${path}/`)
      );

      if (!isPublicPath) {
        const authenticated = await checkAuth();
        if (!authenticated) {
          localStorage.setItem('redirectTo', pathname);
          router.push('/login');
        }
      }
    };

    checkAuthentication();
  }, [pathname, isLoading, router, checkAuth]);

  // Solicitar restablecimiento de contraseña
  const forgotPassword = async (email: string) => {
    try {
      const response = await authService.fetchWithAuth('/forgot-password/', {
        method: 'POST',
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al solicitar restablecimiento de contraseña');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  // Actualizar perfil de usuario
  const updateProfile = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      const response = await authService.fetchWithAuth('/me/', {
        method: 'PATCH',
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el perfil');
      }

      const updatedUser = await response.json();
      setUser(prevUser => ({
        ...prevUser,
        ...updatedUser
      } as User));
      
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar el proveedor de autenticación
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      isAdmin,
      login,
      register,
      logout,
      checkAuth,
      updateProfile,
      forgotPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
