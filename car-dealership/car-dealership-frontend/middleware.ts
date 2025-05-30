import { NextResponse, type NextRequest } from 'next/server';

/**
 * Función para decodificar un token JWT (solo la parte del payload)
 * @param token Token JWT
 * @returns Payload decodificado o null si hay un error
 */
function decodeJwtPayload(token: string): any | null {
  try {
    // El token JWT tiene el formato: header.payload.signature
    const base64Payload = token.split('.')[1];
    if (!base64Payload) return null;
    
    // Reemplazar caracteres específicos de base64url a base64 estándar
    const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decodificar y parsear el payload
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

// Tipos para el payload del token JWT
interface JwtPayload {
  exp: number;
  [key: string]: any;
}

// Función para verificar si un token está expirado
function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJwtPayload(token) as JwtPayload | null;
    if (!payload || !payload.exp) return true;
    
    const currentTime = Date.now() / 1000; // Tiempo actual en segundos
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error al verificar token expirado:', error);
    return true; // Si hay un error, consideramos el token como expirado
  }
}

export function middleware(request: NextRequest) {
  const isDev = process.env.NODE_ENV !== 'production';
  const { pathname } = request.nextUrl;
  
  // 1. Extraer el token de acceso de las cookies
  const accessToken = request.cookies.get('access_token')?.value;
  const hasToken = !!accessToken;
  
  // Verificar si el token ha expirado (si existe)
  const tokenIsExpired = accessToken ? isTokenExpired(accessToken) : true;
  const isAuthenticated = hasToken && !tokenIsExpired;
  
  // Logs de depuración en desarrollo
  if (isDev) {
    console.log({
      path: pathname,
      tokenFound: hasToken,
      tokenExpired: isTokenExpired,
      isAuthenticated,
      method: request.method,
    });
  }
  

  
  // 2. Definir rutas públicas y protegidas
  const publicPaths = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/api/auth/'
  ];
  
  // Rutas que requieren autenticación
  const protectedPaths = [
    '/dashboard',
    '/profile',
    '/cars',
    '/services',
    '/orders',
    '/api/protected/'
  ];
  
  // Rutas de API que no requieren autenticación
  const publicApiPaths = [
    '/api/auth/',
    '/api/public/'
  ];
  
  // Comprobar si la ruta actual es una API pública
  const isPublicApiPath = publicApiPaths.some(path => 
    pathname.startsWith(path)
  );
  
  // Comprobar si la ruta actual es pública
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // Comprobar si la ruta actual está protegida
  const isProtectedPath = protectedPaths.some(path =>
    pathname.startsWith(path)
  );
  
  // Permitir acceso a archivos estáticos y rutas de Next.js
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api/health')
  ) {
    return NextResponse.next();
  }
  
  // 5. Manejar rutas de API
  if (pathname.startsWith('/api/')) {
    // Permitir todas las solicitudes a rutas de API públicas
    if (isPublicApiPath) {
      return NextResponse.next();
    }
    
    // Para otras rutas de API, verificar autenticación
    if (!isAuthenticated) {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: 'No autorizado. Por favor, inicia sesión.' 
        }), 
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Si el token está expirado, devolver error 401
    if (tokenIsExpired) {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: 'Sesión expirada. Por favor, inicia sesión de nuevo.' 
        }), 
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    return NextResponse.next();
  }
  
  // 6. Manejar redirecciones para usuarios autenticados
  if (isAuthenticated) {
    // Si el usuario está autenticado y trata de acceder a login/register, redirigir al dashboard
    if (pathname === '/login' || pathname === '/register') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // Continuar con la solicitud si está autenticado
    return NextResponse.next();
  }
  
  // 7. Manejar rutas protegidas para usuarios no autenticados
  if (isProtectedPath) {
    // Crear URL de redirección con el parámetro de sesión expirada si corresponde
    const loginUrl = new URL('/login', request.url);
    
    if (tokenIsExpired) {
      loginUrl.searchParams.set('session_expired', '1');
    } else if (pathname !== '/') {
      // Guardar la URL actual para redirigir después del login
      loginUrl.searchParams.set('from', pathname);
    }
    
    // Eliminar cookies de autenticación si el token está expirado
    if (tokenIsExpired) {
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      return response;
    }
    
    return NextResponse.redirect(loginUrl);
  }
  
  // 8. Permitir que la petición continúe normalmente
  return NextResponse.next();
}

// 9. Configurar las rutas donde se aplicará el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth/ (rutas de autenticación)
     * - api/public/ (rutas públicas de la API)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/(auth|public)/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)',
  ],
};
