import { LoginData, RegisterData, AuthResponse } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Realiza una petición de login
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include', // Importante para manejar cookies
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error en el inicio de sesión');
  }

  return response.json();
};

/**
 * Realiza el registro de un nuevo usuario
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.detail || 'Error en el registro. Por favor, intente nuevamente.'
    );
  }

  return response.json();
};

/**
 * Refresca el token de acceso
 */
export const refreshToken = async (): Promise<{ access: string }> => {
  const response = await fetch(`${API_URL}/auth/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al refrescar el token');
  }

  return response.json();
};

/**
 * Cierra la sesión del usuario
 */
export const logout = async (): Promise<void> => {
  try {
    await fetch(`${API_URL}/auth/logout/`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};
