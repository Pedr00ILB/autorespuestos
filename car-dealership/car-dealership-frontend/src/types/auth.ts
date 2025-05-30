/**
 * Tipos y interfaces relacionados con la autenticación
 */

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  es_cliente: boolean;
  es_empleado: boolean;
  es_admin: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  first_name: string;
  last_name: string;
  telefono: string;
  fecha_nacimiento: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}
