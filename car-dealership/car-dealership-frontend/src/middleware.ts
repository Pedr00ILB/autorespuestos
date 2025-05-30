import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTES, PROTECTED_ROUTES, PUBLIC_ONLY_ROUTES, getRequiredRole } from './lib/config/routes';
import { AUTH_ROUTES, COOKIE_CONFIG } from './lib/config';

// Configuración
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const PUBLIC_PATHS = ['/_next', '/static', '/favicon.ico'];

// Verifica si la ruta requiere autenticación
const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTES.some(route => {
    if (typeof route === 'string') {
      return pathname.startsWith(route);
    }
    // Manejar rutas dinámicas (ej: /cars/[id])
    const routeStr = String(route);
    const baseRoute = routeStr.split('(')[0];
    return pathname.startsWith(baseRoute);
  });
};

// Verifica el rol del usuario para la ruta actual
const verifyUserRole = async (
  headers: Headers,
  pathname: string,
  url: URL
): Promise<NextResponse | null> => {
  const requiredRole = getRequiredRole(pathname);
  if (!requiredRole) return null;
  
  try {
    // Obtener el perfil del usuario
    const userResponse = await fetch(`${API_URL}${AUTH_ROUTES.ME}`, { 
      headers,
      credentials: 'include',
    });
    
    if (userResponse.ok) {
      const user = await userResponse.json();
      const hasRole = 
        (requiredRole === 'cliente' && user.es_cliente) ||
        (requiredRole === 'empleado' && user.es_empleado) ||
        (requiredRole === 'admin' && user.es_admin);
      
      if (!hasRole) {
        // Redirigir a la página de inicio si no tiene el rol requerido
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    }
    return null;
  } catch (error) {
    console.error('Error al verificar el rol del usuario:', error);
    return null;
  }
};

// Verifica si la ruta es solo para usuarios no autenticados
const isPublicOnlyRoute = (pathname: string): boolean => {
  return PUBLIC_ONLY_ROUTES.includes(pathname);
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(COOKIE_CONFIG.ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(COOKIE_CONFIG.REFRESH_TOKEN)?.value;
  const csrfToken = request.cookies.get('csrftoken')?.value;
  
  // Clonar la URL para modificaciones
  const url = request.nextUrl.clone();
  
  // Configurar encabezados para las peticiones a la API
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  
  if (csrfToken) {
    headers.set('X-CSRFToken', csrfToken);
  }
  
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  // 1. Permitir archivos estáticos y rutas de Next.js
  if (pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }
  
  // 2. Si la ruta es solo para usuarios no autenticados y hay token, redirigir al dashboard
  if (isPublicOnlyRoute(pathname) && accessToken) {
    url.pathname = ROUTES.DASHBOARD;
    return NextResponse.redirect(url);
  }
  
  // 3. Si la ruta es protegida y no hay token, redirigir al login
  if (isProtectedRoute(pathname) && !accessToken) {
    url.pathname = ROUTES.LOGIN;
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }
  
  // 4. Si hay token, verificar su validez
  if (accessToken && isProtectedRoute(pathname)) {
    try {
      // Verificar el token de acceso
      const verifyResponse = await fetch(`${API_URL}${AUTH_ROUTES.VERIFY}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ token: accessToken }),
      });
      
      // Si el token es inválido, intentar refrescarlo
      if (!verifyResponse.ok && refreshToken) {
        const refreshResponse = await fetch(`${API_URL}${AUTH_ROUTES.REFRESH}`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ refresh: refreshToken }),
        });
        
        if (refreshResponse.ok) {
          const { access } = await refreshResponse.json();
          
          // Actualizar el token en las cookies
          const response = NextResponse.next();
          response.cookies.set({
            name: COOKIE_CONFIG.ACCESS_TOKEN,
            value: access,
            path: COOKIE_CONFIG.PATH,
            sameSite: COOKIE_CONFIG.SAME_SITE,
            secure: COOKIE_CONFIG.SECURE,
            maxAge: COOKIE_CONFIG.MAX_AGE,
          });
          
          // Actualizar el encabezado de autorización
          headers.set('Authorization', `Bearer ${access}`);
          
          // Verificar el rol del usuario si es necesario
          const roleResponse = await verifyUserRole(headers, pathname, url);
          if (roleResponse) {
            return roleResponse; // Redirigir si falla la verificación de rol
          }
          return response;
        } else {
          // Si no se puede refrescar, redirigir al login
          throw new Error('Failed to refresh token');
        }
      } else if (!verifyResponse.ok) {
        throw new Error('Invalid access token');
      }
      
      // Verificar el rol del usuario si es necesario
      const roleResponse = await verifyUserRole(headers, pathname, url);
      if (roleResponse) {
        return roleResponse; // Redirigir si falla la verificación de rol
      }
    } catch (error) {
      console.error('Error de autenticación:', error);
      
      // Limpiar cookies de autenticación
      const response = NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
      response.cookies.delete(COOKIE_CONFIG.ACCESS_TOKEN);
      response.cookies.delete(COOKIE_CONFIG.REFRESH_TOKEN);
      
      // Añadir parámetro de error
      url.searchParams.set('error', 'session_expired');
      return response;
    }
  }

  // 5. Permitir el acceso a la ruta
  const response = NextResponse.next();
  
  // 6. Asegurarse de que las cookies de autenticación tengan la configuración correcta
  if (accessToken) {
    response.cookies.set({
      name: COOKIE_CONFIG.ACCESS_TOKEN,
      value: accessToken,
      path: COOKIE_CONFIG.PATH,
      sameSite: COOKIE_CONFIG.SAME_SITE,
      secure: COOKIE_CONFIG.SECURE,
      maxAge: COOKIE_CONFIG.MAX_AGE,
    });
  }
  
  if (refreshToken) {
    response.cookies.set({
      name: COOKIE_CONFIG.REFRESH_TOKEN,
      value: refreshToken,
      path: COOKIE_CONFIG.PATH,
      sameSite: COOKIE_CONFIG.SAME_SITE,
      secure: COOKIE_CONFIG.SECURE,
      maxAge: COOKIE_CONFIG.MAX_AGE,
      httpOnly: true,
    });
  }
  
  return response;
}

// Configuración del middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
