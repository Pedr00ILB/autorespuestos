// Usar la variable de entorno para la URL de la API
// NOTA: NEXT_PUBLIC_API_URL ya incluye /api al final
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const AUTH_URL = `${API_URL}/auth`;  // Ya no necesitamos /api aquí porque ya está incluido en API_URL

// Tipos de datos
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  telefono?: string;
  fecha_nacimiento?: string;
  es_admin: boolean;
  date_joined: string;
}

interface Tokens {
  access: string;
  refresh: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  telefono: string;
  fecha_nacimiento: string;
}

interface ErrorWithResponse extends Error {
  response?: Response;
  details?: any;
  [key: string]: any;
}

class AuthService {
  private static instance: AuthService;
  private refreshPromise: Promise<string> | null = null;
  private refreshSubscribers: ((token: string) => void)[] = [];

  private constructor() {
    this.setupInterceptors();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Getters para tokens
  public getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  }

  // Almacenar tokens
  private setTokens({ access, refresh }: Tokens): void {
    if (typeof window === 'undefined') return;
    if (access) localStorage.setItem('access_token', access);
    if (refresh) localStorage.setItem('refresh_token', refresh);
  }

  // Limpiar datos de autenticación
  public clearAuthData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  // Obtener usuario actual
  public getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  // Establecer usuario actual
  private setCurrentUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Iniciar sesión
  public async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await this.fetchWithAuth('/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al iniciar sesión');
      }

      const data = await response.json();
      this.setTokens({
        access: data.access,
        refresh: data.refresh,
      });
      
      // Obtener información del usuario
      const userResponse = await this.fetchWithAuth('/me/');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        this.setCurrentUser(userData);
        return userData;
      }

      throw new Error('No se pudo obtener la información del usuario');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Registrar nuevo usuario
  public async register(userData: RegisterData): Promise<User> {
    try {
      // Validar datos requeridos
      if (!userData.email || !userData.password || !userData.password2) {
        throw new Error('El correo electrónico y la contraseña son obligatorios');
      }

      if (userData.password !== userData.password2) {
        throw new Error('Las contraseñas no coinciden');
      }

      // Preparar los datos para el registro
      const registerData = {
        email: userData.email,
        password: userData.password,
        password2: userData.password2,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        telefono: userData.telefono || '',
        fecha_nacimiento: userData.fecha_nacimiento || null,
        username: userData.email.split('@')[0], // Generar nombre de usuario
        es_cliente: true,
      };

      console.log('[AuthService] Enviando datos de registro a:', `${AUTH_URL}/register/`);
      console.log('[AuthService] Datos de registro:', JSON.stringify(registerData, null, 2));
      
      // Usar fetchWithAuth para manejar la autenticación automáticamente
      const response = await this.fetchWithAuth('/register/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      console.log('[AuthService] Respuesta recibida - Estado:', response.status, response.statusText);
      
      // Intentar analizar la respuesta como JSON
      let data;
      try {
        const responseText = await response.text();
        data = responseText ? JSON.parse(responseText) : {};
        console.log('[AuthService] Datos de respuesta (JSON):', data);
      } catch (jsonError) {
        console.error('[AuthService] Error al analizar la respuesta JSON:', jsonError);
        throw new Error('La respuesta del servidor no es un JSON válido');
      }

      if (!response.ok) {
        console.error('[AuthService] Error en la respuesta del servidor:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          headers: Object.fromEntries(response.headers.entries()),
          data
        });
        
        let errorMessage = `Error al registrar el usuario (${response.status})`;
        
        // Procesar errores de validación
        if (response.status === 400 && data) {
          const errorMessages: string[] = [];
          
          // Procesar errores de campos específicos
          if (typeof data === 'object' && data !== null) {
            // Recorrer todos los campos con errores
            Object.entries(data).forEach(([field, messages]) => {
              if (Array.isArray(messages)) {
                // Si es un array de mensajes, agregar cada uno
                messages.forEach(msg => {
                  if (msg) {
                    // Formatear el nombre del campo para que sea más legible
                    const fieldName = field === 'non_field_errors' ? '' : `${field.replace(/_/g, ' ')}: `;
                    errorMessages.push(`- ${fieldName}${msg}`);
                  }
                });
              } else if (typeof messages === 'string') {
                // Si es un string, agregarlo directamente
                errorMessages.push(`- ${field}: ${messages}`);
              } else if (messages && typeof messages === 'object') {
                // Si es un objeto anidado, convertirlo a string
                errorMessages.push(`- ${field}: ${JSON.stringify(messages)}`);
              }
            });
          } else if (typeof data === 'string') {
            // Si la respuesta es directamente un string
            errorMessages.push(`- ${data}`);
          }
          
          // Si encontramos mensajes de error, formatearlos
          if (errorMessages.length > 0) {
            errorMessage = `Error de validación:\n${errorMessages.join('\n')}`;
          } else if (data.detail) {
            errorMessage = data.detail;
          } else if (data.message) {
            errorMessage = data.message;
          } else if (data.non_field_errors) {
            const nonFieldErrors = Array.isArray(data.non_field_errors) 
              ? data.non_field_errors.join('\n- ')
              : data.non_field_errors;
            errorMessage = `Error de validación:\n- ${nonFieldErrors}`;
          } else {
            errorMessage = 'Error de validación: Datos inválidos';
          }
        } else if (response.status === 500) {
          errorMessage = 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.';
        }
        
        const error: ErrorWithResponse = new Error(errorMessage);
        error.response = response;
        error.details = data;
        error.name = response.status === 400 ? 'ValidationError' : 'ServerError';
        
        throw error;
      }

      // Iniciar sesión automáticamente después del registro
      if (data.access && data.refresh) {
        this.setTokens({
          access: data.access,
          refresh: data.refresh,
        });
        
        if (data.user) {
          this.setCurrentUser(data.user);
          return data.user;
        } else {
          // Si no viene el usuario en la respuesta, obtenerlo
          const userResponse = await this.fetchWithAuth('/me/');
          if (userResponse.ok) {
            const userData = await userResponse.json();
            this.setCurrentUser(userData);
            return userData;
          }
        }
      }

      throw new Error('Error en el registro: respuesta inesperada del servidor');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Cerrar sesión
  public async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        await fetch(`${API_URL}/logout/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  // Refrescar token
  public async refreshToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No hay token de actualización disponible');
    }

    this.refreshPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`${AUTH_URL}/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el token');
        }

        const data = await response.json();
        this.setTokens({
          access: data.access,
          refresh: data.refresh || refreshToken,
        });
        
        // Notificar a todos los suscriptores que el token se actualizó
        this.refreshSubscribers.forEach(callback => callback(data.access));
        this.refreshSubscribers = [];
        
        resolve(data.access);
      } catch (error) {
        this.clearAuthData();
        reject(error);
      } finally {
        this.refreshPromise = null;
      }
    });

    return this.refreshPromise;
  }

  // Método para suscribirse a la actualización del token
  public subscribeTokenRefresh(callback: (token: string) => void): () => void {
    this.refreshSubscribers.push(callback);
    return () => {
      this.refreshSubscribers = this.refreshSubscribers.filter(cb => cb !== callback);
    };
  }

  // Configurar interceptores para manejar automáticamente la autenticación
  private setupInterceptors(): void {
    if (typeof window === 'undefined') return;

    // Guardar referencia al método fetch original
    const originalFetch = window.fetch;

    // Sobrescribir el método fetch global
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      // Determinar si es una solicitud a nuestra API
      const requestUrl = typeof input === 'string' 
        ? input 
        : input instanceof URL 
          ? input.toString() 
          : input.url;
          
      const isApiRequest = requestUrl.startsWith(process.env.NEXT_PUBLIC_API_URL || API_URL);

      // Si no es una solicitud a nuestra API, usar fetch normal
      if (!isApiRequest) {
        return originalFetch(input, init);
      }

      // Clonar los headers para evitar mutaciones
      const headers = new Headers(init?.headers);
      
      // Agregar el token de acceso si existe
      const token = this.getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      // Asegurar que el content-type sea application/json si no se especifica
      if (!headers.has('Content-Type') && 
          (init?.method === 'POST' || init?.method === 'PUT' || init?.method === 'PATCH')) {
        headers.set('Content-Type', 'application/json');
      }

      try {
        // Realizar la solicitud con los headers actualizados
        let response = await originalFetch(input, {
          ...init,
          headers,
        });

        // Si el token expiró, intentar refrescarlo
        if (response.status === 401) {
          try {
            const newToken = await this.refreshToken();
            
            // Actualizar el encabezado de autorización con el nuevo token
            headers.set('Authorization', `Bearer ${newToken}`);
            
            // Reintentar la solicitud con el nuevo token
            response = await originalFetch(input, {
              ...init,
              headers,
            });
          } catch (refreshError) {
            // Si falla el refresh, redirigir al login
            this.clearAuthData();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            throw refreshError;
          }
        }

        return response;
      } catch (error) {
        console.error('Request error:', error);
        throw error;
      }
    };
  }

  // Método para realizar peticiones autenticadas
  public async fetchWithAuth(input: string, init: RequestInit = {}): Promise<Response> {
    try {
      const token = this.getAccessToken();
      
      // Determinar la URL base basada en el tipo de ruta
      let url: string;
      
      if (input.startsWith('http')) {
        // URL completa proporcionada
        url = input;
      } else if (input.startsWith('/auth/') || 
                input === '/login/' || 
                input === '/register/' || 
                input === '/me/') {
        // Rutas de autenticación - usar AUTH_URL sin añadir prefijo
        url = `${AUTH_URL}${input}`;
      } else {
        // Otras rutas - usar API_URL
        url = `${API_URL}${input}`;
      }
      
      const headers = new Headers(init?.headers);
      
      // Asegurar que siempre se envíe el header Accept para JSON
      if (!headers.has('Accept')) {
        headers.set('Accept', 'application/json');
      }
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      if (!headers.has('Content-Type') && 
          (init.method === 'POST' || init.method === 'PUT' || init.method === 'PATCH')) {
        headers.set('Content-Type', 'application/json');
      }

      console.log(`[fetchWithAuth] Enviando petición a: ${url}`, { method: init.method });
      
      let response = await fetch(url, {
        ...init,
        headers,
        credentials: 'include', // Importante para manejar cookies de sesión
      });

      console.log(`[fetchWithAuth] Respuesta recibida: ${response.status} ${response.statusText}`, {
        url: response.url,
        ok: response.ok,
        redirected: response.redirected,
        type: response.type,
        headers: Object.fromEntries(response.headers.entries()),
      });

      // Si la respuesta es un error 401 y tenemos un token, intentar refrescarlo
      if (response.status === 401 && token) {
        try {
          console.log('[fetchWithAuth] Token expirado, intentando refrescar...');
          const newToken = await this.refreshToken();
          headers.set('Authorization', `Bearer ${newToken}`);
          
          console.log('[fetchWithAuth] Token refrescado, reintentando petición...');
          response = await fetch(url, {
            ...init,
            headers,
            credentials: 'include',
          });
          
          console.log('[fetchWithAuth] Respuesta después de refrescar token:', response.status, response.statusText);
        } catch (error) {
          console.error('[fetchWithAuth] Error al refrescar el token:', error);
          this.clearAuthData();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw error;
        }
      }

      // Verificar si la respuesta es HTML inesperado
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html') && !response.ok) {
        const text = await response.text();
        console.error('[fetchWithAuth] Respuesta HTML inesperada:', text.substring(0, 500));
        throw new Error('El servidor devolvió una respuesta HTML inesperada. Verifica la URL y la configuración del servidor.');
      }

      return response;
    } catch (error) {
      console.error('[fetchWithAuth] Error en la petición:', error);
      throw error;
    }
  }

  // Verificar si el usuario está autenticado
  public isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  // Verificar si el usuario es administrador
  public isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.es_admin === true;
  }
}

// Exportar una instancia única del servicio
export const authService = AuthService.getInstance();

export default authService;
