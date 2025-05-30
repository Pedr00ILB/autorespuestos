'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'cliente' | 'empleado' | 'admin';
  redirectTo?: string;
};

export const ProtectedRoute = ({
  children,
  requiredRole,
  redirectTo = '/login',
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      router.push(`${redirectTo}?from=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!isLoading && isAuthenticated && requiredRole) {
      // Check required role if specified
      const hasRole = 
        (requiredRole === 'cliente' && user?.es_cliente) ||
        (requiredRole === 'empleado' && user?.es_empleado) ||
        (requiredRole === 'admin' && user?.es_admin);

      if (!hasRole) {
        // Redirect to home if role is not sufficient
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, requiredRole, router, user, redirectTo]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};
