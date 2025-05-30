import { API_BASE_URL } from '../config';
import { handleError, AuthError } from './utils/errorHandler';
import type { LoginData, RegisterData, AuthResponse, User } from './types';

const getCSRFToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='));
  return cookie ? cookie.split('=')[1] : null;
};

const apiFetch = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  });

  // Añadir CSRF token si existe (importante para protección CSRF)
  const csrfToken = getCSRFToken();
  if (csrfToken) {
    headers.set('X-CSRFToken', csrfToken);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Importante para enviar cookies en cada petición
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new AuthError(
        data.detail || 'Error en la petición',
        response.status
      );
    }

    return data as T;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

/**
 * Inicia sesión con las credenciales proporcionadas
 * El backend debe establecer las cookies httpOnly para access_token y refresh_token
 */
export const login = (credentials: LoginData): Promise<AuthResponse> => 
  apiFetch('/auth/token/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

/**
 * Registra un nuevo usuario
 * El backend debe manejar la autenticación automática después del registro
 */
export const register = (userData: RegisterData): Promise<AuthResponse> =>
  apiFetch('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

/**
 * Refresca el token de acceso
 * El backend debe manejar la lógica de refresco con las cookies httpOnly
 */
export const refreshToken = (): Promise<{ access: string }> =>
  apiFetch('/auth/token/refresh/', {
    method: 'POST',
  });

/**
 * Cierra la sesión del usuario
 * El backend debe eliminar las cookies de autenticación
 */
export const logout = (): Promise<void> =>
  apiFetch('/auth/logout/', {
    method: 'POST',
  });

/**
 * Obtiene el usuario actual autenticado
 * La autenticación se maneja mediante cookies httpOnly
 */
export const getCurrentUser = (): Promise<User> =>
  apiFetch('/auth/me/');

/**
 * Verifica si el token actual es válido
 * La autenticación se maneja mediante cookies httpOnly
 */
export const verifyToken = (): Promise<{ user: User }> =>
  apiFetch('/auth/token/verify/');
