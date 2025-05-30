import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook personalizado para manejar la autenticación en componentes
 */
export const useAuthCheck = (requiredRole?: 'cliente' | 'empleado' | 'admin') => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const checkAuth = (): boolean => {
    if (isLoading) return false;
    
    if (!isAuthenticated) {
      router.push('/login');
      return false;
    }

    if (requiredRole) {
      const hasRole = 
        (requiredRole === 'cliente' && user?.es_cliente) ||
        (requiredRole === 'empleado' && user?.es_empleado) ||
        (requiredRole === 'admin' && user?.es_admin);

      if (!hasRole) {
        router.push('/');
        return false;
      }
    }

    return true;
  };

  return { checkAuth, user, isAuthenticated, isLoading };
};

/**
 * Función para verificar si el usuario tiene un rol específico
 */
export const hasRole = (
  user: { es_cliente: boolean; es_empleado: boolean; es_admin: boolean } | null,
  role: 'cliente' | 'empleado' | 'admin'
): boolean => {
  if (!user) return false;
  
  return (
    (role === 'cliente' && user.es_cliente) ||
    (role === 'empleado' && user.es_empleado) ||
    (role === 'admin' && user.es_admin)
  );
};
