import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Configuración base de la API
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // 15 segundos de timeout
  validateStatus: function (status) {
    // Considerar códigos de estado menores a 500 como exitosos
    return status < 500;
  }
});

// Configuración global de axios para manejar errores de red
axios.defaults.timeout = 15000;
axios.defaults.withCredentials = true;

// Interceptor para añadir el token de autenticación a las peticiones
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Solo intentar obtener el token si estamos en el cliente
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Solo intentar obtener el token CSRF si estamos en el navegador
      if (typeof document !== 'undefined') {
        const csrfToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('csrftoken='))
          ?.split('=')[1];
        
        if (csrfToken) {
          config.headers['X-CSRFToken'] = csrfToken;
        }
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error
type ErrorResponse = {
  status: number;
  data: {
    detail?: string;
    [key: string]: any;
  };
  message?: string;
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ErrorResponse>) => {
    // Si no hay respuesta del servidor
    if (!error.response) {
      console.error('Error de red:', error.message);
      return Promise.reject({
        status: 0,
        data: {
          detail: 'No se pudo conectar al servidor. Verifica tu conexión a internet.'
        }
      });
    }

    // Manejar errores 401 (No autorizado)
    if (error.response.status === 401) {
      // Solo limpiar el token si estamos en el cliente
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
      }
      // No redirigir aquí para evitar problemas de hidratación
    }

    const originalRequest = error.config as any;
    
    // Si el error es 401 y no es una solicitud de actualización de token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Intentar actualizar el token
        const response = await axios.post(
          'http://127.0.0.1:8000/api/auth/token/refresh/',
          {},
          { withCredentials: true }
        );
        
        const { access } = response.data;
        
        // Guardar el nuevo token
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', access);
        }
        
        // Reintentar la petición original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (error) {
        // Si hay un error al actualizar el token, redirigir al login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }
    
    // Para otros errores, rechazar la promesa con el error
    return Promise.reject(error);
  }
);

// Funciones de autenticación
export const auth = {
  // Iniciar sesión
  login: async (email: string, password: string) => {
    const response = await api.post('auth/token/', { email, password });
    
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      
      // Obtener el perfil del usuario
      const userResponse = await api.get('auth/me/');
      return userResponse.data;
    }
    
    return null;
  },
  
  // Cerrar sesión
  logout: async () => {
    try {
      await api.post('auth/logout/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('access_token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  },
  
  // Obtener el perfil del usuario autenticado
  getProfile: async () => {
    try {
      const response = await api.get('auth/me/');
      return response.data;
    } catch (error) {
      return null;
    }
  },
  
  // Registrar un nuevo usuario
  register: async (userData: {
    email: string;
    password: string;
    nombre: string;
    apellidos: string;
    telefono: string;
    fecha_nacimiento: string;
  }) => {
    const response = await api.post('auth/registro/', userData);
    
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      return response.data.user;
    }
    
    return null;
  },
};

// Obtener la lista de coches
export const fetchCars = async () => {
  try {
    const response = await api.get('carros/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los coches:', error);
    throw error;
  }
};

export default api;
