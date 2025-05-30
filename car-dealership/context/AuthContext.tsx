'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/api';

type User = {
  id: number;
  email: string;
  nombre: string;
  is_staff?: boolean;
  is_active?: boolean;
  last_login?: string;
  date_joined?: string;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    nombre: string;
    apellidos: string;
    telefono: string;
    fecha_nacimiento: string;
  }) => Promise<void>;
  getToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  // Verificar si el usuario está autenticado al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      // Solo ejecutar en el cliente
      if (typeof window === 'undefined') return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          setUser(null);
          // No redirigir desde aquí para evitar hidratación
          return;
        }
        
        const userData = await auth.getProfile();
        setUser(userData);
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        setUser(null);
        localStorage.removeItem('access_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Efecto separado para manejar redirecciones
  useEffect(() => {
    // Solo ejecutar en el cliente después de la hidratación
    if (typeof window === 'undefined' || loading) return;
    
    // Si no hay usuario y no estamos en una ruta pública, redirigir a login
    if (!user && pathname && !['/login', '/register', '/', '/acerca'].includes(pathname)) {
      router.push('/login');
    }
    
    // Si hay usuario y está en login/register, redirigir a dashboard
    if (user && ['/login', '/register'].includes(pathname || '')) {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  // No necesitamos el segundo efecto separado, lo manejamos en el primero

  const login = async (email: string, password: string) => {
    try {
      const userData = await auth.login(email, password);
      setUser(userData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    nombre: string;
    apellidos: string;
    telefono: string;
    fecha_nacimiento: string;
  }) => {
    try {
      await auth.register(userData);
      // Después de registrar, hacer login automáticamente
      await login(userData.email, userData.password);
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  const getToken = async (): Promise<string | null> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/token/refresh/`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('No se pudo renovar el token');
      }
      
      const data = await response.json();
      return data.access || null;
    } catch (error) {
      console.error('Error al renovar el token:', error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    getToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
