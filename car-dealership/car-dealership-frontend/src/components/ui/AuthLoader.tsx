import { Loader2 } from 'lucide-react';

interface AuthLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const AuthLoader = ({ 
  message = 'Verificando autenticación...',
  fullScreen = true 
}: AuthLoaderProps) => {
  const containerClasses = `flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : 'min-h-[400px]'}`;
  
  return (
    <div className={`${containerClasses} bg-gray-50 dark:bg-gray-900 p-6`}>
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-full opacity-75 animate-ping"></div>
            <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-indigo-50 dark:bg-indigo-900/20">
              <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Cargando
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300">
          {message}
        </p>
        
        <div className="mt-6">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full animate-pulse w-1/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLoader;
