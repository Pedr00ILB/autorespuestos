export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  telefono?: string;
  fecha_nacimiento?: string;
  es_cliente: boolean;
  es_empleado: boolean;
  es_admin: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  telefono: string;
  fecha_nacimiento: string;
}

// Los tokens ahora se manejan mediante cookies httpOnly
export interface AuthTokens {
  access?: string; // No se usa en el frontend
  refresh?: string; // No se usa en el frontend
}

export interface AuthResponse {
  user: User;
  tokens?: AuthTokens; // Opcional ya que los tokens se manejan por cookies
}

export interface AuthError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export type AuthCallback = (error: AuthError | null) => void;

export interface AuthOptions {
  onSuccess?: (data: AuthResponse) => void;
  onError?: (error: AuthError) => void;
}
