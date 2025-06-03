"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { Loader2 } from 'lucide-react';

interface RequireAuthProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  redirectTo?: string;
}

export function RequireAuth({ 
  children, 
  requiredRole = 'user',
  redirectTo = '/login'
}: RequireAuthProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Si no está autenticado, redirigir al login
        router.push(`${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`);
      } else if (requiredRole === 'admin' && !user?.es_admin) {
        // Si se requiere rol de admin pero el usuario no es admin
        router.push('/unauthorized');
      } else {
        // Usuario autenticado y con los permisos necesarios
        setIsAuthorized(true);
      }
    }
  }, [isAuthenticated, isLoading, requiredRole, router, redirectTo, user]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // O un componente de carga mientras se redirige
  }

  return <>{children}</>;
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: Omit<RequireAuthProps, 'children'> = {}
) {
  return function WithAuthWrapper(props: P) {
    return (
      <RequireAuth {...options}>
        <WrappedComponent {...props} />
      </RequireAuth>
    );
  };
}
