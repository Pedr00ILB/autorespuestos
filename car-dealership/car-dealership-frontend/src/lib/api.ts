import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _skipAuth?: boolean;
  }
}
import { useRouter } from 'next/navigation';

// Interfaz para el payload del token JWT
interface JwtPayload {
  exp: number;
  user_id?: number;
  username?: string;
  email?: string;
  is_staff?: boolean;
  [key: string]: any;
}

// Configuración base de Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * Decodifica un token JWT sin usar librerías externas
 */
const parseJwt = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
};

/**
 * Verifica si el token ha expirado
 */
const isTokenExpired = (token: string): boolean => {
  const decoded = parseJwt(token);
  if (!decoded?.exp) return true;
  
  // El campo 'exp' está en segundos, Date.now() devuelve milisegundos
  return decoded.exp < Date.now() / 1000;
};

/**
 * Intenta renovar el token de acceso usando el token de refresco
 */
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      console.error('No se encontró token de refresco');
      return null;
    }

    try {
      const response = await axios.post<{ access: string }>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/token/refresh/`,
        { refresh: refreshToken },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.access) {
        localStorage.setItem('token', response.data.access);
        console.log('Token renovado exitosamente');
        return response.data.access;
      }
      return null;
    } catch (error) {
      console.error('Error al renovar el token:', error);
      throw error; // Propagar el error para manejarlo en el interceptor
    }
  } catch (error) {
    console.error('Error al renovar el token:', error);
    // Limpiar tokens y redirigir al login
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
    return null;
  }
};

// Interceptor para añadir el token de acceso a las peticiones
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // No interceptar peticiones de autenticación o cuando se solicita omitir autenticación
    if (config.url?.includes('/auth/') || config._skipAuth) {
      return config;
    }

    let token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refresh_token');

    // Si no hay token, continuar sin él
    if (!token || !refreshToken) {
      return config;
    }

    // Verificar si el token ha expirado
    if (isTokenExpired(token)) {
      try {
        // Intentar renovar el token
        const newToken = await refreshAccessToken();
        if (newToken) {
          token = newToken;
        } else {
          // Si no se pudo renovar, redirigir al login
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(new Error('No se pudo renovar la sesión'));
        }
      } catch (error) {
        console.error('Error al renovar el token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    // Añadir el token al header de autorización
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si el error es 401 y no es una petición de autenticación y no se ha reintentado
    if (
      error.response?.status === 401 &&
      originalRequest.url && 
      !originalRequest.url.includes('/auth/') &&
      !originalRequest._retry &&
      localStorage.getItem('refresh_token') // Solo intentar renovar si hay refresh token
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Actualizar el header de autorización
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          // Reintentar la petición original
          return api(originalRequest);
        }
      } catch (error) {
        console.error('Error al renovar el token:', error);
      }

      // Si no se pudo renovar el token, limpiar y redirigir
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      // Usar window.location en lugar de router para asegurar que se recargue la página
      if (typeof window !== 'undefined') {
        window.location.href = '/login?session_expired=1';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
