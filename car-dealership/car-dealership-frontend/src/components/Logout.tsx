'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface LogoutProps {
  className?: string;
  onLogout?: () => void;
  onError?: (error: Error) => void;
}

export default function Logout({ 
  className = '',
  onLogout,
  onError 
}: LogoutProps) {
  const { logout, isLoading } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoading || isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      await logout();
      // Llamar al callback de éxito si existe
      if (onLogout) onLogout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Llamar al callback de error si existe
      if (onError) onError(error instanceof Error ? error : new Error('Error desconocido'));
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button 
      onClick={handleLogout} 
      variant="ghost"
      disabled={isLoading || isLoggingOut}
      className={`text-red-600 hover:bg-red-50 hover:text-red-700 ${className}`}
      aria-label="Cerrar sesión"
    >
      {isLoading || isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
    </Button>
  );
}
