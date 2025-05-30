'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Lista de rutas públicas que no requieren autenticación
  const publicPaths = ['/login', '/register', '/', '/acerca', '/vehiculos'];
  
  // Verificar si la ruta actual es pública
  const isPublicPath = publicPaths.some(path => 
    pathname && (pathname === path || pathname.startsWith(`${path}/`))
  );

  useEffect(() => {
    // Solo ejecutar en el cliente después de la hidratación
    if (typeof window === 'undefined' || loading) return;
    
    // Redirigir a login si no hay usuario y la ruta no es pública
    if (!user && !isPublicPath) {
      router.push('/login');
      return;
    }
    
    // Redirigir a dashboard si hay usuario y está en login/register
    if (user && pathname && ['/login', '/register'].includes(pathname)) {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router, isPublicPath]);

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (loading && !isPublicPath) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
