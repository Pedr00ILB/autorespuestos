import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { login } from '@/lib/auth';
import Image from 'next/image';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Verificar si se redirigió por expiración de sesión
  useEffect(() => {
    if (router.query.session_expired) {
      setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      // Limpiar el query de la URL sin recargar la página
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== INICIO DEL MANEJADOR DE ENVÍO ===');
    console.log('Preveniendo comportamiento por defecto del formulario...');
    
    setIsLoading(true);
    setError('');
    
    console.log('Estado actual:', {
      email: email,
      password: password ? '***' : '(vacío)',
      isLoading: isLoading
    });
    
    try {
      console.log('Llamando a la función login...');
      
      // Validar que los campos no estén vacíos
      if (!email.trim() || !password) {
        throw new Error('Por favor, completa todos los campos');
      }
      
      // Llamar a la función de login
      const loginResponse = await login({ 
        username: email.trim(), 
        password: password 
      });
      
      console.log('✅ Login exitoso, respuesta:', loginResponse);
      
      // Verificar que los tokens estén en localStorage
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refresh_token');
      const userData = localStorage.getItem('user');
      
      if (!token || !refreshToken) {
        throw new Error('No se pudieron guardar los tokens de autenticación');
      }
      
      console.log('🔍 Verificación de datos en localStorage:', { 
        token: token ? '✅ Presente' : '❌ Ausente',
        refreshToken: refreshToken ? '✅ Presente' : '❌ Ausente',
        user: userData ? '✅ Presente' : '❌ Ausente'
      });
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          console.log('👤 Usuario autenticado:', user);
          
          // Mostrar mensaje de bienvenida
          console.log(`Bienvenido, ${user.username || 'Usuario'}!`);
          
          // Redirigir según el tipo de usuario
          const redirectPath = user.is_staff ? '/admin/dashboard' : '/dashboard';
          console.log(`🔄 Redirigiendo a ${redirectPath}...`);
          
          // Usar replace en lugar de push para evitar que el usuario vuelva al login con el botón de atrás
          router.replace(redirectPath).then(() => {
            console.log('✅ Redirección completada');
            // Forzar recarga de la página para asegurar que se apliquen los cambios de autenticación
            window.location.reload();
          });
          
        } catch (error) {
          console.error('Error al procesar datos del usuario:', error);
          // Redirigir al dashboard por defecto si hay un error
          router.replace('/dashboard').then(() => window.location.reload());
        }
      } else {
        console.warn('No se encontró información del usuario en la respuesta');
        router.replace('/dashboard').then(() => window.location.reload());
      }
      
    } catch (err: any) {
      console.error('❌ Error en handleSubmit:', err);
      
      // Mensaje de error amigable
      let errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
      
      if (err.message.includes('Network Error')) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      } else if (err.message.includes('401')) {
        errorMessage = 'Usuario o contraseña incorrectos';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      console.log('Mostrando mensaje de error al usuario:', errorMessage);
      setError(errorMessage);
      
      // Depuración detallada del error
      if (err.response) {
        console.error('📡 Error del servidor:', {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
          headers: err.response.headers,
        });
      } else if (err.request) {
        console.error('🔌 No se recibió respuesta del servidor:', err.request);
      } else {
        console.error('⚠️ Error al configurar la petición:', err.message);
      }
    } finally {
      console.log('Finalizando estado de carga...');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={60}
              height={60}
              className="mx-auto"
            />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ingresa tus credenciales para acceder
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </>
              ) : 'Iniciar sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
