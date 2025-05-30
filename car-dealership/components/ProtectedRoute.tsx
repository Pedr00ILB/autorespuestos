'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRoles?: string[];
};

export default function ProtectedRoute({ 
  children, 
  requiredRoles = [] 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Redirigir al login si no está autenticado
      router.push('/login');
    } else if (!loading && user && requiredRoles.length > 0) {
      // Verificar roles si se especifican
      const hasRequiredRole = requiredRoles.some(role => {
        if (role === 'admin') return user.is_staff;
        if (role === 'staff') return user.is_staff;
        return true;
      });

      if (!hasRequiredRole) {
        // Redirigir a una página de acceso denegado o al dashboard
        router.push('/unauthorized');
      }
    }
  }, [user, loading, router, requiredRoles]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Verificar roles después de cargar
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => {
      if (role === 'admin') return user.is_staff;
      if (role === 'staff') return user.is_staff;
      return true;
    });

    if (!hasRequiredRole) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Acceso denegado</h1>
            <p className="mt-2">No tienes permiso para acceder a esta página.</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
