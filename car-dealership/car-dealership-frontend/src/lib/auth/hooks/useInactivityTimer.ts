import { useEffect, useCallback, useRef } from 'react';

type InactivityTimerProps = {
  onLogout: () => void;
  timeout?: number;
  events?: string[];
};

export const useInactivityTimer = ({
  onLogout,
  timeout = 30 * 60 * 1000, // 30 minutos por defecto
  events = ['mousedown', 'keydown', 'mousemove', 'scroll', 'touchstart'],
}: InactivityTimerProps) => {
  const timerRef = useRef<NodeJS.Timeout>();

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(onLogout, timeout);
  }, [onLogout, timeout]);

  useEffect(() => {
    // Iniciar el timer
    resetTimer();

    // Resetear el timer con los eventos
    const eventListeners = events.map(event => {
      window.addEventListener(event, resetTimer);
      return () => window.removeEventListener(event, resetTimer);
    });

    // Limpiar
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      eventListeners.forEach(cleanup => cleanup());
    };
  }, [events, resetTimer]);
};
