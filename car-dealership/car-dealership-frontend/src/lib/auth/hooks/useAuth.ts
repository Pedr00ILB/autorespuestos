import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { login, register, logout as apiLogout, getCurrentUser, verifyToken, refreshToken } from '../api';
import { handleError } from '../utils/errorHandler';
import { useInactivityTimer } from './useInactivityTimer';
import type { User, LoginData, RegisterData, AuthOptions, AuthCallback, AuthError } from '../types';

type UseAuthOptions = {
  onError?: (error: AuthError) => void;
  onLoginSuccess?: (user: User) => void;
  onLogout?: () => void;
};

type UseAuthReturn = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginData, options?: AuthOptions) => Promise<User | null>;
  register: (userData: RegisterData, options?: AuthOptions) => Promise<User | null>;
  logout: (options?: { redirectTo?: string }) => Promise<void>;
  refreshUser: () => Promise<User | null>;
  error: AuthError | null;
  clearError: () => void;
};

export const useAuth = (options: UseAuthOptions = {}): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const router = useRouter();
  
  const clearError = useCallback(() => setError(null), []);
  
  const handleAuthError = useCallback((error: unknown, defaultMessage = 'Error de autenticación') => {
    const authError: AuthError = {
      message: (error as Error)?.message || defaultMessage,
      status: (error as any)?.status || 500,
      code: (error as any)?.code,
      details: (error as any)?.details,
    };
    
    setError(authError);
    options.onError?.(authError);
    
    return authError;
  }, [options]);

  const loadUser = useCallback(async (): Promise<User | null> => {
    setIsLoading(true);
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setError(null);
      return userData;
    } catch (error) {
      setUser(null);
      handleAuthError(error, 'No se pudo cargar el usuario');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthError]);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      // Verificar si la sesión es válida
      // El backend manejará la autenticación mediante cookies
      await verifyToken();
      return await loadUser();
    } catch (error) {
      // Si hay un error, limpiar el usuario y manejar el error
      setUser(null);
      handleAuthError(error, 'La sesión ha expirado. Por favor, inicia sesión nuevamente.');
      return null;
    }
  }, [loadUser]);

  const loginUser = useCallback(async (
    credentials: LoginData, 
    authOptions: AuthOptions = {}
  ): Promise<User | null> => {
    setIsLoading(true);
    try {
      // El backend ahora maneja las cookies httpOnly
      const { user } = await login(credentials);
      setUser(user);
      setError(null);
      
      // Llamar al callback de éxito si existe
      authOptions.onSuccess?.({ user, tokens: {} });
      options.onLoginSuccess?.(user);
      
      return user;
    } catch (error) {
      const authError = handleAuthError(error, 'Error al iniciar sesión');
      authOptions.onError?.(authError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthError, options]);

  const registerUser = useCallback(async (userData: RegisterData, authOptions: AuthOptions = {}): Promise<User | null> => {
    try {
      setIsLoading(true);
      await register(userData);
      // Iniciar sesión automáticamente después del registro
      return await loginUser({
        email: userData.email,
        password: userData.password,
      }, authOptions);
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [loginUser]);

  const logoutUser = useCallback(async (options: { 
    redirectTo?: string;
    onLogout?: () => void 
  } = {}): Promise<void> => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setUser(null);
      setError(null);
      
      // Llamar al callback de logout si existe
      options.onLogout?.();
      
      // Redirigir a la página de login o a la ruta especificada
      const redirectTo = options.redirectTo || '/login';
      router.push(redirectTo);
    }
  }, [router]);

  // Inactivity timer
  useInactivityTimer({
    onLogout: logoutUser,
    timeout: 30 * 60 * 1000, // 30 minutos
  });

  useEffect(() => {
    const loadInitialUser = async () => {
      await loadUser();
    };
    
    loadInitialUser();
  }, [loadUser]);

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    refreshUser,
    error,
    clearError,
  }), [user, isLoading, loginUser, registerUser, logoutUser, refreshUser]);
};
