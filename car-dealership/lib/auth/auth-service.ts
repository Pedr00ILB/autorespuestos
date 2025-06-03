const API_URL = 'http://localhost:8000/api/auth';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  username: string;
  first_name?: string;
  last_name?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  password2: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
  user?: any;
}

// Extender la interfaz Error para incluir la propiedad response
interface ErrorWithResponse extends Error {
  response?: Response;
  [key: string]: any;
}

class AuthService {
  // Almacenar tokens en localStorage
  private static setTokens(access: string, refresh: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
    }
  }

  // Obtener token de acceso
  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  // Obtener token de actualización
  private static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  // Limpiar tokens
  private static clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  // Configurar encabezados de autenticación
  static getAuthHeader(): HeadersInit {
    const token = AuthService.getAccessToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }

  // Iniciar sesión
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al iniciar sesión');
      }

      const data = await response.json();
      AuthService.setTokens(data.access, data.refresh);
      
      // Obtener información del usuario
      const userResponse = await fetch(`${API_URL}/me/`, {
        headers: AuthService.getAuthHeader(),
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        localStorage.setItem('user', JSON.stringify(userData));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Registrar nuevo usuario
  static async register(userData: RegisterData): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          es_cliente: true, // Asegurarse de que se registre como cliente
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Si hay errores de validación, lanzarlos para mostrarlos en el formulario
        if (response.status === 400) {
          const error: ErrorWithResponse = new Error('Error de validación');
          error.response = response;
          error.details = responseData;
          throw error;
        }
        
        // Para otros errores, lanzar el mensaje de error del servidor
        const errorMessage = responseData.detail || 
                            responseData.message || 
                            'Error al registrar el usuario';
        throw new Error(errorMessage);
      }

      // Si el registro es exitoso, guardar los tokens si vienen en la respuesta
      if (responseData.access && responseData.refresh) {
        AuthService.setTokens(responseData.access, responseData.refresh);
        
        // Si la respuesta incluye datos del usuario, guardarlos
        if (responseData.user) {
          localStorage.setItem('user', JSON.stringify(responseData.user));
        } else {
          // Si no vienen los datos del usuario, obtenerlos
          try {
            const userResponse = await fetch(`${API_URL}/me/`, {
              headers: AuthService.getAuthHeader(),
            });
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              localStorage.setItem('user', JSON.stringify(userData));
            }
          } catch (userError) {
            console.error('Error obteniendo datos del usuario:', userError);
          }
        }
      }

      return responseData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Cerrar sesión
  static async logout(): Promise<void> {
    try {
      const refreshToken = AuthService.getRefreshToken();
      if (refreshToken) {
        await fetch(`${API_URL}/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      AuthService.clearTokens();
    }
  }

  // Refrescar token
  static async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = AuthService.getRefreshToken();
      if (!refreshToken) return null;

      const response = await fetch(`${API_URL}/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      AuthService.setTokens(data.access, data.refresh);
      return data.access;
    } catch (error) {
      console.error('Refresh token error:', error);
      AuthService.clearTokens();
      return null;
    }
  }

  // Verificar autenticación
  static async isAuthenticated(): Promise<boolean> {
    const token = AuthService.getAccessToken();
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/verify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        // Intentar refrescar el token si la verificación falla
        const newToken = await AuthService.refreshToken();
        return !!newToken;
      }

      return true;
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  }

  // Obtener usuario actual
  static getCurrentUser(): any | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default AuthService;
