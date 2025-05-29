import api from './api';

// Función para obtener token
export const login = async (credentials: { username: string; password: string }) => {
  try {
    const response = await api.post('/api/auth/token/', credentials);
    localStorage.setItem('token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    return response.data;
  } catch (error) {
    throw error;
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
