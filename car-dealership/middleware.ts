import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista de rutas protegidas que requieren autenticación
const protectedRoutes = ['/dashboard', '/perfil'];

// Lista de rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/register', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const userData = request.cookies.get('userData')?.value;
  
  // Verificar si la ruta actual es una ruta protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Verificar si la ruta actual es una ruta pública
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Si el usuario no está autenticado y está intentando acceder a una ruta protegida
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si el usuario está autenticado y está intentando acceder a una ruta pública
  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Para rutas de API que requieren autenticación
  if (pathname.startsWith('/api') && !pathname.includes('/api/auth/')) {
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
  }

  // Para rutas de admin
  if (pathname.startsWith('/admin')) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const user = userData ? JSON.parse(userData) : null;
      if (!user?.es_admin) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } catch (error) {
      console.error('Error al analizar los datos del usuario:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
