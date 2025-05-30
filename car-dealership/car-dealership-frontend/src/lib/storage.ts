/**
 * Utilidad para manejar el almacenamiento local de forma segura
 * Utiliza localStorage con respaldo en sessionStorage y cookies si es necesario
 */

// Verificar si estamos en el navegador
const isBrowser = typeof window !== 'undefined';

// Verificar si el almacenamiento está disponible
const storageAvailable = (type: 'localStorage' | 'sessionStorage'): boolean => {
  if (!isBrowser) return false;
  
  try {
    const storage = window[type];
    const testKey = '__test__';
    storage.setItem(testKey, testKey);
    const item = storage.getItem(testKey);
    storage.removeItem(testKey);
    return item === testKey;
  } catch (e) {
    return false;
  }
};

// Determinar qué tipo de almacenamiento está disponible
const getStorage = () => {
  if (storageAvailable('localStorage')) {
    return {
      type: 'localStorage',
      set: (key: string, value: string) => localStorage.setItem(key, value),
      get: (key: string) => localStorage.getItem(key),
      remove: (key: string) => localStorage.removeItem(key),
      clear: () => localStorage.clear(),
    };
  }
  
  if (storageAvailable('sessionStorage')) {
    return {
      type: 'sessionStorage',
      set: (key: string, value: string) => sessionStorage.setItem(key, value),
      get: (key: string) => sessionStorage.getItem(key),
      remove: (key: string) => sessionStorage.removeItem(key),
      clear: () => sessionStorage.clear(),
    };
  }
  
  // Si no hay almacenamiento disponible, usar cookies
  return {
    type: 'cookie',
    set: (key: string, value: string) => {
      if (!isBrowser) return;
      document.cookie = `car_dealership_${key}=${encodeURIComponent(value)};path=/;max-age=2592000;SameSite=Lax`;
    },
    get: (key: string) => {
      if (!isBrowser) return null;
      const name = `car_dealership_${key}=`;
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
    },
    remove: (key: string) => {
      if (!isBrowser) return;
      document.cookie = `car_dealership_${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    },
    clear: () => {
      if (!isBrowser) return;
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name.startsWith('car_dealership_')) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      }
    }
  };
};

// Función para obtener el almacenamiento activo actual
export const getActiveStorage = () => {
  const storage = getStorage();
  console.log(`🔍 Usando almacenamiento: ${storage.type}`);
  return storage;
};

// Almacenamiento seguro
export const safeStorage = {
  setItem: (key: string, value: string) => {
    if (!isBrowser) {
      console.warn(`No se puede guardar en el almacenamiento: ${key} (fuera del navegador)`);
      return;
    }
    try {
      const activeStorage = getActiveStorage();
      activeStorage.set(key, value);
      console.log(`✅ ${key} guardado en ${activeStorage.type}`);
    } catch (error) {
      console.error(`❌ Error al guardar ${key} en el almacenamiento:`, error);
    }
  },
  
  getItem: (key: string): string | null => {
    if (!isBrowser) return null;
    try {
      const activeStorage = getActiveStorage();
      const value = activeStorage.get(key);
      return value;
    } catch (error) {
      console.error(`Error al leer ${key} del almacenamiento:`, error);
      return null;
    }
  },
  
  removeItem: (key: string) => {
    if (!isBrowser) return;
    try {
      const activeStorage = getActiveStorage();
      activeStorage.remove(key);
      console.log(`🗑️ ${key} eliminado de ${activeStorage.type}`);
    } catch (error) {
      console.error(`Error al eliminar ${key} del almacenamiento:`, error);
    }
  },
  
  clear: () => {
    if (!isBrowser) return;
    try {
      const activeStorage = getActiveStorage();
      activeStorage.clear();
      console.log(`🧹 Almacenamiento (${activeStorage.type}) limpiado correctamente`);
    } catch (error) {
      console.error('Error al limpiar el almacenamiento:', error);
    }
  }
};

// Funciones específicas para autenticación
export const authStorage = {
  setTokens: (access: string, refresh: string) => {
    safeStorage.setItem('token', access);
    safeStorage.setItem('refresh_token', refresh);
  },
  
  getAccessToken: (): string | null => {
    return safeStorage.getItem('token');
  },
  
  getRefreshToken: (): string | null => {
    return safeStorage.getItem('refresh_token');
  },
  
  setUser: (user: any) => {
    safeStorage.setItem('user', JSON.stringify(user));
  },
  
  getUser: (): any => {
    const user = safeStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  clear: () => {
    safeStorage.removeItem('token');
    safeStorage.removeItem('refresh_token');
    safeStorage.removeItem('user');
  }
};
