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
    // No hacer nada mientras se está cargando
    if (isLoading) return;

    // Redirigir si la página requiere autenticación y el usuario no está autenticado
    if (requireAuth && !isAuthenticated) {
      // Guardar la ruta actual para redirigir después del login
      const currentPath = window.location.pathname;
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      router.push(redirectUrl);
      return;
    }

    // Redirigir si el usuario está autenticado pero la página es solo para invitados
    if (redirectIfAuthenticated && isAuthenticated) {
      const redirectPath = new URLSearchParams(window.location.search).get('redirect') || '/';
      router.push(redirectPath);
      return;
    }

    // Verificar si se requiere ser administrador
    if (requireAuth && requireAdmin && isAuthenticated && !user?.es_admin) {
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
