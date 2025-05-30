'use client';

import { createContext, useContext, ReactNode, useMemo, useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import type { User, AuthError as AuthErrorType } from './types';
import { AuthLoader } from '@/components/ui/AuthLoader';
import AuthError from '@/components/ui/AuthError';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/lib/config/routes';

type AuthContextType = ReturnType<typeof useAuth> & {
  error: AuthErrorType | null;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<AuthErrorType | null>(null);
  
  const auth = useAuth({
    onError: (error) => {
      setError(error);
      
      // Redirigir a la página de login si no está autenticado
      if (error.status === 401) {
        const isPublicRoute = [ROUTES.LOGIN, ROUTES.REGISTER].includes(pathname || '');
        if (!isPublicRoute) {
          const from = pathname && pathname !== ROUTES.LOGIN ? `?from=${encodeURIComponent(pathname)}` : '';
          router.push(`${ROUTES.LOGIN}${from}`);
        }
      }
    },
    onLoginSuccess: () => {
      // Manejar inicio de sesión exitoso
      const from = searchParams?.get('from');
      if (from) {
        router.push(decodeURIComponent(from));
      } else {
        router.push(ROUTES.DASHBOARD);
      }
    },
  });

  // Limpiar errores cuando cambia la ruta
  useEffect(() => {
    setError(null);
  }, [pathname]);

  // Manejar errores de autenticación desde la URL
  useEffect(() => {
    if (!searchParams) return;
    
    const errorParam = searchParams.get('error');
    const fromParam = searchParams.get('from');
    const sessionExpired = searchParams.get('session_expired');
    
    if (errorParam === 'session_expired' || sessionExpired) {
      setError({
        message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        status: 401,
      });
    } else if (errorParam === 'access_denied') {
      setError({
        message: 'No tienes permiso para acceder a esta página.',
        status: 403,
      });
    } else if (errorParam === 'auth_required' && fromParam) {
      setError({
        message: 'Por favor inicia sesión para acceder a esta página.',
        status: 401,
      });
    }
    
    // Marcar como inicializado después de procesar los parámetros de la URL
    setInitialized(true);
  }, [searchParams]);
  
  const clearError = () => setError(null);

  const value = useMemo(() => ({
    ...auth,
    error,
    clearError,
  }), [auth, error]);

  // Mostrar loader mientras se inicializa
  if (!initialized) {
    return (
      <AuthLoader 
        message="Estamos preparando todo para ti..."
        fullScreen={true}
      />
    );
  }

  // Si hay un error de autenticación, mostrarlo
  if (error) {
    return (
      <AuthError 
        error={error}
        onRetry={() => {
          setError(null);
          // Forzar una recarga limpia de la página para reiniciar el estado
          window.location.href = window.location.pathname;
        }}
      />
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
