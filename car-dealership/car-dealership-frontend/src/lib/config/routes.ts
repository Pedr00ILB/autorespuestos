/**
 * Configuración de rutas de la aplicación
 */

export const ROUTES = {
  // Públicas
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Protegidas
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  
  // Rutas de cliente
  CARS: '/cars',
  CAR_DETAIL: (id: string | number) => `/cars/${id}`,
  
  // Rutas de empleado
  INVENTORY: '/inventory',
  ORDERS: '/orders',
  
  // Rutas de administrador
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
};

/**
 * Rutas que requieren autenticación
 */
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PROFILE,
  ROUTES.CARS,
  ROUTES.INVENTORY,
  ROUTES.ORDERS,
  ROUTES.ADMIN_USERS,
  ROUTES.ADMIN_SETTINGS,
];

/**
 * Rutas que son accesibles solo para usuarios no autenticados
 */
export const PUBLIC_ONLY_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
];

/**
 * Mapa de roles requeridos para cada ruta
 */
export const ROUTE_ROLES: Record<string, 'cliente' | 'empleado' | 'admin'> = {
  [ROUTES.INVENTORY]: 'empleado',
  [ROUTES.ORDERS]: 'empleado',
  [ROUTES.ADMIN_USERS]: 'admin',
  [ROUTES.ADMIN_SETTINGS]: 'admin',
};

/**
 * Obtiene el rol requerido para una ruta específica
 */
export const getRequiredRole = (pathname: string): 'cliente' | 'empleado' | 'admin' | undefined => {
  return ROUTE_ROLES[pathname];
};
