import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthProvider';

interface UseAuthRedirectOptions {
  /**
   * Si es true, redirige al usuario a la página de login si no está autenticado
   * @default true
   */
  requireAuth?: boolean;
  
  /**
   * Si es true, redirige al usuario fuera de la página si está autenticado
   * Útil para páginas de login/registro
   * @default false
   */
  redirectIfAuthenticated?: boolean;
  
  /**
   * Ruta a la que redirigir si no está autenticado
   * @default '/login'
   */
  redirectTo?: string;
  
  /**
   * Si es true, requiere que el usuario sea administrador
   * @default false
   */
  requireAdmin?: boolean;
  
  /**
   * Ruta a la que redirigir si el usuario no es administrador
   * @default '/unauthorized'
   */
  adminRedirectTo?: string;
}

/**
 * Hook para manejar redirecciones basadas en el estado de autenticación
 * 
 * @example
 * // En un componente de página
 * useAuthRedirect({ requireAuth: true, requireAdmin: true });
 */
export function useAuthRedirect({
  requireAuth = true,
  redirectIfAuthenticated = false,
  redirectTo = '/login',
  requireAdmin = false,
  adminRedirectTo = '/unauthorized'
}: UseAuthRedirectOptions = {}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // No hacer nada mientras se está cargando o si estamos en el servidor
    if (isLoading || typeof window === 'undefined') return;

    // Solo proceder si tenemos un estado de autenticación definido
    if (isAuthenticated === undefined) return;

    // Evitar bucles de redirección
    const currentPath = window.location.pathname;
    
    // Redirigir si la página requiere autenticación y el usuario no está autenticado
    if (requireAuth && !isAuthenticated) {
      // No redirigir si ya estamos en la página de login
      if (currentPath === '/login' || currentPath === redirectTo) return;
      
      // Guardar la ruta actual para redirigir después del login
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      router.push(redirectUrl);
      return;
    }

    // Redirigir si el usuario está autenticado pero la página es solo para invitados
    if (redirectIfAuthenticated && isAuthenticated) {
      // No redirigir si ya estamos en la página de destino
      const redirectPath = new URLSearchParams(window.location.search).get('redirect') || '/';
      if (currentPath === redirectPath) return;
      
      router.push(redirectPath);
      return;
    }

    // Verificar si se requiere ser administrador
    if (requireAuth && requireAdmin && isAuthenticated && !user?.es_admin) {
      if (currentPath === adminRedirectTo) return;
      router.push(adminRedirectTo);
      return;
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectIfAuthenticated, redirectTo, requireAdmin, adminRedirectTo, router, user]);

  return {
    isAuthenticated,
    isLoading,
    user,
    isAdmin: user?.es_admin || false
  };
}
