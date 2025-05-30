// Configuración de la API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Configuración de rutas de autenticación
export const AUTH_ROUTES = {
  LOGIN: '/auth/token/',
  REFRESH: '/auth/token/refresh/',
  VERIFY: '/auth/token/verify/',
  REGISTER: '/auth/register/',
  LOGOUT: '/auth/logout/',
  ME: '/auth/me/',
};

// Tiempo de inactividad en milisegundos (30 minutos)
export const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

// Configuración de cookies
export const COOKIE_CONFIG = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  MAX_AGE: 30 * 24 * 60 * 60, // 30 días
  PATH: '/',
  SAME_SITE: 'lax' as const,
  SECURE: process.env.NODE_ENV === 'production',
};
