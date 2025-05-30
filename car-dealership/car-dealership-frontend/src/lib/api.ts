import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _skipAuth?: boolean;
  }
}

// Configuración base de Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para enviar cookies en cada petición
});

// Obtener el token CSRF para protección contra CSRF
const getCSRFToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='));
  return cookie ? cookie.split('=')[1] : null;
};

// Interceptor para añadir el token CSRF a las peticiones
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // No interceptar peticiones de autenticación o cuando se solicita omitir autenticación
    if (config.url?.includes('/auth/') || config._skipAuth) {
      return config;
    }

    // Añadir token CSRF para protección contra CSRF
    const csrfToken = getCSRFToken();
    if (csrfToken && config.headers) {
      config.headers['X-CSRFToken'] = csrfToken;
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
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Intentar renovar el token de acceso usando el refresh token
        // El backend manejará la lógica con las cookies httpOnly
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh/`,
          {},
          { withCredentials: true }
        );
        
        // Reintentar la petición original
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Error al renovar la sesión:', refreshError);
        // Redirigir al login si no se pudo renovar la sesión
        if (typeof window !== 'undefined') {
          window.location.href = '/login?session_expired=1';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
