/**
 * Utilidad para manejar el almacenamiento en cookies
 * Útil cuando localStorage no está disponible (modo incógnito, etc.)
 */

const COOKIE_PREFIX = 'car_dealership_';

export const cookieStorage = {
  setItem: (key: string, value: string, days = 30) => {
    try {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      
      const cookieValue = `${COOKIE_PREFIX}${key}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
      document.cookie = cookieValue;
      console.log(`✅ ${key} guardado en cookies`);
      return true;
    } catch (error) {
      console.error(`❌ Error al guardar ${key} en cookies:`, error);
      return false;
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      const name = COOKIE_PREFIX + key + '=';
      const decodedCookie = decodeURIComponent(document.cookie);
      const cookieArray = decodedCookie.split(';');
      
      for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
          cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
          return cookie.substring(name.length, cookie.length);
        }
      }
      return null;
    } catch (error) {
      console.error(`Error al leer ${key} de las cookies:`, error);
      return null;
    }
  },
  
  removeItem: (key: string) => {
    try {
      document.cookie = `${COOKIE_PREFIX}${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    } catch (error) {
      console.error(`Error al eliminar ${key} de las cookies:`, error);
    }
  },
  
  clear: () => {
    try {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name.startsWith(COOKIE_PREFIX)) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      }
    } catch (error) {
      console.error('Error al limpiar las cookies:', error);
    }
  }
};

export const authCookies = {
  setTokens: (access: string, refresh: string) => {
    cookieStorage.setItem('token', access);
    cookieStorage.setItem('refresh_token', refresh);
  },
  
  getAccessToken: (): string | null => {
    return cookieStorage.getItem('token');
  },
  
  getRefreshToken: (): string | null => {
    return cookieStorage.getItem('refresh_token');
  },
  
  setUser: (user: any) => {
    cookieStorage.setItem('user', JSON.stringify(user));
  },
  
  getUser: (): any => {
    const user = cookieStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  clear: () => {
    cookieStorage.removeItem('token');
    cookieStorage.removeItem('refresh_token');
    cookieStorage.removeItem('user');
  }
};
