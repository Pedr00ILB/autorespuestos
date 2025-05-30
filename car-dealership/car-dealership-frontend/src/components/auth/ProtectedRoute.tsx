'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'cliente' | 'empleado' | 'admin';
}

export default function ProtectedRoute({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirigir al login si no está autenticado
      router.push('/login');
      return;
    }

    if (!isLoading && isAuthenticated && requiredRole) {
      // Verificar rol requerido si se especifica
      const hasRole = 
        (requiredRole === 'cliente' && user?.es_cliente) ||
        (requiredRole === 'empleado' && user?.es_empleado) ||
        (requiredRole === 'admin' && user?.es_admin);

      if (!hasRole) {
        // Redirigir a la página de inicio si no tiene el rol requerido
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, requiredRole, router, user]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Verificar rol después de cargar
  if (requiredRole) {
    const hasRole = 
      (requiredRole === 'cliente' && user?.es_cliente) ||
      (requiredRole === 'empleado' && user?.es_empleado) ||
      (requiredRole === 'admin' && user?.es_admin);

    if (!hasRole) {
      return null; // O un componente de acceso denegado
    }
  }

  return <>{children}</>;
}
