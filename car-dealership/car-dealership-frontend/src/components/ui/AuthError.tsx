import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthError as AuthErrorType } from '@/lib/auth/types';

interface AuthErrorProps {
  error: AuthErrorType | null;
  onRetry?: () => void;
}

function AuthError({ error, onRetry }: AuthErrorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  if (!error) return null;
  
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };
  
  const handleLogin = () => {
    const from = searchParams?.get('from');
    router.push(`/login${from ? `?from=${encodeURIComponent(from)}` : ''}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
              <span className="text-3xl">
                {error.status === 401 ? '🔐' : '🚫'}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {error.status === 401 ? 'No autorizado' : 'Acceso denegado'}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {error.message || 'Ha ocurrido un error de autenticación.'}
            </p>
            
            <div className="flex flex-col space-y-4">
              {error.status === 401 ? (
                <Button
                  onClick={handleLogin}
                  className="w-full py-3 px-6 text-base font-medium"
                >
                  Iniciar sesión
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  className="w-full py-3 px-6 text-base font-medium"
                >
                  Reintentar
                </Button>
              )}
              
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="w-full py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Volver al inicio
              </Button>
            </div>
          </div>
          
          {error.details && (
            <div className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 p-6">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Detalles del error:</h4>
              <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-md text-xs font-mono text-gray-700 dark:text-gray-300 overflow-x-auto">
                <pre className="whitespace-pre-wrap break-words">
                  {JSON.stringify(error.details, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>¿Necesitas ayuda? <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Contáctanos</a></p>
        </div>
      </div>
    </div>
  );
};

export default AuthError;
