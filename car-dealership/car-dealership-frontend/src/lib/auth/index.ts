// Types
export type { User, LoginData, RegisterData, AuthTokens, AuthResponse } from './types';

// Hooks
export { useAuth } from './hooks/useAuth';
export { useInactivityTimer } from './hooks/useInactivityTimer';

// Components
export { ProtectedRoute } from './components/ProtectedRoute';

// Context
export { AuthProvider, useAuthContext } from './AuthProvider';

// Utils
export { handleError, setErrorHandler, AuthError } from './utils/errorHandler';

// API
export { login, register, logout, refreshToken, getCurrentUser, verifyToken } from './api';
