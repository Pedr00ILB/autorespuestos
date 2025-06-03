'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AuthService from './auth-service';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  es_admin: boolean;
  date_joined: string;
}

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const authenticated = await checkAuth();
        if (authenticated) {
          const userData = AuthService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await AuthService.login({ email, password });
      const userData = AuthService.getCurrentUser();
      setUser(userData);
      
      // Redirigir al dashboard o a la página anterior
      const redirectTo = localStorage.getItem('redirectTo') || '/';
      router.push(redirectTo);
      localStorage.removeItem('redirectTo');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      // Formatear los datos para que coincidan con lo que espera el backend
      const formattedUserData = {
        username: userData.email.split('@')[0], // Generar nombre de usuario a partir del email
        email: userData.email,
        password: userData.password,
        password2: userData.password, // Para confirmación en el backend
        first_name: userData.first_name,
        last_name: userData.last_name,
        telefono: userData.telefono,
        fecha_nacimiento: userData.fecha_nacimiento,
      };

      // Llamar al servicio de autenticación con los datos formateados
      const data = await AuthService.register(formattedUserData);
      
      // Después de registrar, iniciar sesión automáticamente
      await login(userData.email, userData.password);
      
      return data;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Mejorar los mensajes de error para el usuario
      let errorMessage = 'Error al registrar el usuario';
      if (error.response) {
        // Manejar errores de validación del backend
        const errorData = await error.response.json();
        if (errorData.errors) {
          errorMessage = Object.values(errorData.errors)
            .flat()
            .join('\n');
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      return await AuthService.isAuthenticated();
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  };

  // Protección de rutas
  useEffect(() => {
    const checkAuthentication = async () => {
      if (isLoading || !pathname) return;

      const publicPaths = ['/login', '/register', '/'];
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
  }, [pathname, isLoading, router]);

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al actualizar el perfil');
      }

      const updatedUser = await response.json();
      setUser(prev => ({
        ...prev,
        ...updatedUser,
        // Asegurarse de que los campos opcionales se mantengan
        first_name: updatedUser.first_name || prev?.first_name,
        last_name: updatedUser.last_name || prev?.last_name,
        email: updatedUser.email || prev?.email,
        telefono: updatedUser.telefono || prev?.telefono,
        fecha_nacimiento: updatedUser.fecha_nacimiento || prev?.fecha_nacimiento,
        es_admin: updatedUser.es_admin || prev?.es_admin || false,
        date_joined: updatedUser.date_joined || prev?.date_joined
      }));

      // Actualizar el usuario en localStorage
      const storedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
      localStorage.setItem('userData', JSON.stringify({
        ...storedUserData,
        ...updatedUser
      }));
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
