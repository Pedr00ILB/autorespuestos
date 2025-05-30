import api from './api';
import { authStorage } from './storage';

// Verificar si estamos en el navegador
const isBrowser = typeof window !== 'undefined';

// Función para obtener token
export const login = async (credentials: { username: string; password: string }) => {
  console.log('=== INICIO DE LOGIN ===');
  console.log('Credenciales recibidas (contraseña oculta):', { 
    username: credentials.username,
    password: '***' 
  });
  
  try {
    console.log('Preparando petición a /api/auth/token/');
    
    // Mostrar la URL completa que se usará
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/auth/token/`;
    console.log('URL de la API:', apiUrl);
    
    // Mostrar headers que se enviarán
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    console.log('Headers de la petición:', JSON.stringify(headers, null, 2));
    
    // Mostrar credenciales que se enviarán (sin la contraseña)
    console.log('Enviando credenciales a la API...');
    
    // Realizar la petición
    console.log('Enviando petición POST...');
    const response = await api.post('/api/auth/token/', credentials, {
      _skipAuth: true,
      headers: headers,
    }).catch(error => {
      console.error('❌ Error en la petición:', error);
      if (error.response) {
        console.error('Respuesta del servidor con error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }
      throw error; // Relanzar el error para manejarlo en el bloque catch externo
    });
    
    console.log('=== RESPUESTA DEL SERVIDOR ===');
    console.log('Status:', response.status);
    console.log('Headers:', JSON.stringify(response.headers, null, 2));
    
    // Mostrar los datos de la respuesta de forma segura (sin exponer tokens completos)
    const safeResponseData = {
      ...response.data,
      access: response.data?.access ? '***' + response.data.access.slice(-10) : undefined,
      refresh: response.data?.refresh ? '***' + response.data.refresh.slice(-10) : undefined,
      user: response.data?.user || null
    };
    console.log('Datos de la respuesta (seguros):', JSON.stringify(safeResponseData, null, 2));
    
    // Verificar la estructura de la respuesta
    if (response.data?.access && response.data?.refresh) {
      console.log('✅ Tokens recibidos correctamente');
      
      // Usar la utilidad de almacenamiento seguro
      console.log('🔵 Guardando datos de autenticación...');
      
      try {
        // 1. Guardar tokens
        console.log('Guardando tokens...');
        authStorage.setTokens(response.data.access, response.data.refresh);
        console.log('✅ Tokens guardados');
        
        // 2. Guardar información del usuario si está disponible
        if (response.data.user) {
          console.log('Guardando información del usuario...');
          authStorage.setUser(response.data.user);
          console.log('✅ Información del usuario guardada:', response.data.user);
        } else {
          console.warn('⚠️ No se recibió información del usuario en la respuesta');
        }
        
        // Verificación exhaustiva
        console.log('🔍 Verificación de datos guardados:');
        
        // Verificar cada ítem individualmente
        const checkStorage = (key: string, getter: () => any) => {
          try {
            const value = getter();
            console.log(`${key}: ${value ? '✅ Presente' : '❌ Ausente'}`);
            if (value) {
              const valueStr = typeof value === 'string' 
                ? (key.includes('token') ? '***' + value.slice(-10) : value)
                : JSON.stringify(value);
              console.log(`   Valor: ${valueStr}`);
            }
          } catch (e) {
            console.error(`❌ Error al verificar ${key}:`, e);
          }
        };
        
        // Verificar cada clave
        checkStorage('Token de acceso', () => authStorage.getAccessToken());
        checkStorage('Token de actualización', () => authStorage.getRefreshToken());
        checkStorage('Usuario', () => authStorage.getUser());
        
        // Verificar directamente el almacenamiento subyacente
        console.log('🔍 Verificación directa del almacenamiento:');
        try {
          if (isBrowser) {
            console.log('localStorage:', Object.keys(localStorage));
            console.log('sessionStorage:', Object.keys(sessionStorage));
            console.log('cookies:', document.cookie);
          }
        } catch (storageError) {
          console.error('❌ Error al verificar el almacenamiento:', storageError);
        }
        
      } catch (storageError) {
        console.error('❌ Error al guardar datos de autenticación:', storageError);
        throw new Error('No se pudieron guardar los datos de autenticación. Por favor, inténtalo de nuevo.');
      }
      
      // Devolver todos los datos para que el componente pueda usarlos
      return response.data;
      
    } else {
      console.error('❌ La respuesta no contiene los tokens esperados');
      console.error('Estructura de la respuesta recibida:', response.data);
      throw new Error('La respuesta del servidor no contiene los tokens esperados');
    }
    
  } catch (error: any) {
    console.error('❌ Error en la función login:', error);
    
    // Mejorar el mensaje de error
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Detalles del error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Proporcionar un mensaje más descriptivo según el código de estado
      if (error.response.status === 400) {
        throw new Error('Credenciales inválidas. Por favor, verifica tu usuario y contraseña.');
      } else if (error.response.status === 401) {
        throw new Error('No autorizado. Por favor, inicia sesión nuevamente.');
      } else if (error.response.status === 500) {
        throw new Error('Error en el servidor. Por favor, inténtalo de nuevo más tarde.');
      } else {
        throw new Error(`Error en la solicitud: ${error.response.status} - ${error.response.statusText}`);
      }
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor:', error.request);
      throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    } else {
      // Algo sucedió en la configuración de la solicitud
      console.error('Error al configurar la solicitud:', error.message);
      throw new Error(`Error al procesar la solicitud: ${error.message}`);
    }
  }
};

// Función para refrescar token
export const refreshToken = async () => {
  try {
    const response = await api.post('/api/auth/token/refresh/', {
      refresh: localStorage.getItem('refresh_token')
    });
    localStorage.setItem('token', response.data.access);
    return response.data;
  } catch (error) {
    throw error;
  }
};
