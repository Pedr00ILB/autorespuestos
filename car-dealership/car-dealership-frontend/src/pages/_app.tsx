import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import { authStorage } from '../lib/storage';
import '../styles/globals.css';

// Componente para verificar la autenticación
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Verificar autenticación en cada cambio de ruta
  useEffect(() => {
    // Marcar que el componente está montado (solo en el navegador)
    setIsMounted(true);
    
    const checkAuth = () => {
      // Solo ejecutar en el navegador
      if (typeof window === 'undefined') return;
      
      const token = authStorage.getAccessToken();
      const isAuthPage = ['/login', '/register'].includes(router.pathname);
      
      console.log('🔍 Verificación de autenticación:', {
        rutaActual: router.pathname,
        tokenPresente: !!token,
        esPaginaDeAuth: isAuthPage
      });
      
      // Si no hay token y no está en una página de autenticación, redirigir a login
      if (!token && !isAuthPage) {
        console.log('🔒 No autenticado, redirigiendo a /login');
        router.push('/login');
      }
      
      // Si hay token y está en una página de autenticación, redirigir al dashboard
      if (token && isAuthPage) {
        console.log('✅ Ya autenticado, redirigiendo a /dashboard');
        router.push('/dashboard');
      }
    };
    
    // Verificar autenticación al cargar
    checkAuth();
    
    // Verificar autenticación en cada cambio de ruta
    router.events.on('routeChangeComplete', checkAuth);
    
    // Limpiar el event listener al desmontar
    return () => {
      router.events.off('routeChangeComplete', checkAuth);
    };
  }, [router]);

  // No renderizar nada hasta que el componente esté montado
  if (!isMounted) {
    return null;
  }
  
  // Renderizar la aplicación
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
