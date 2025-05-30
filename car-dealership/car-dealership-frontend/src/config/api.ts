/**
 * Configuración de la API
 */

// URL base de la API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Headers por defecto
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

/**
 * Configuración de los endpoints de autenticación
 */
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/token/',
  REGISTER: '/auth/register/',
  REFRESH_TOKEN: '/auth/token/refresh/',
  VERIFY_TOKEN: '/auth/token/verify/',
  LOGOUT: '/auth/logout/',
  ME: '/auth/me/',
};

/**
 * Configuración de los endpoints de usuarios
 */
export const USER_ENDPOINTS = {
  PROFILE: '/users/profile/',
  UPDATE_PROFILE: '/users/profile/update/',
  CHANGE_PASSWORD: '/users/change-password/',
};

/**
 * Función para construir URLs de la API
 */
export const buildApiUrl = (endpoint: string): string => {
  // Si la URL ya es absoluta, devolverla tal cual
  if (endpoint.startsWith('http')) {
    return endpoint;
  }
  
  // Asegurarse de que el endpoint empiece con /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Construir la URL completa
  return `${API_BASE_URL}${normalizedEndpoint}`;
};
