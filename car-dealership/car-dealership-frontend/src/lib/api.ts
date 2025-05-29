import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
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
    if (!refreshToken) return null;

    const response = await axios.post<{ access: string }>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/token/refresh/`,
      { refresh: refreshToken },
      { withCredentials: true }
    );

    if (response.data?.access) {
      localStorage.setItem('token', response.data.access);
      return response.data.access;
    }
    return null;
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
    // No interceptar peticiones de autenticación
    if (config.url?.includes('/auth/')) {
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
      !originalRequest.url?.includes('/auth/') &&
      !originalRequest._retry
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

      // Si no se pudo renovar el token, redirigir al login
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
