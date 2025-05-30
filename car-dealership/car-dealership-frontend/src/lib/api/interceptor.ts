import { refreshToken } from './auth';

/**
 * Intercepta las peticiones fetch para manejar automáticamente la autenticación
 */
const api = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  // Configuración por defecto
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Importante para manejar cookies
  };

  // Combinar opciones
  const requestOptions: RequestInit = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Realizar la petición
  let response = await fetch(url, requestOptions);

  // Si el token ha expirado, intentar refrescarlo
  if (response.status === 401) {
    try {
      const { access } = await refreshToken();
      
      // Agregar el nuevo token a la cabecera
      if (requestOptions.headers) {
        (requestOptions.headers as Record<string, string>)['Authorization'] = `Bearer ${access}`;
      }
      
      // Reintentar la petición con el nuevo token
      response = await fetch(url, requestOptions);
    } catch (error) {
      // Si hay un error al refrescar, redirigir al login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw error;
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Error en la petición');
  }

  // Manejar respuesta vacía (como en DELETE)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
};

export default api;
