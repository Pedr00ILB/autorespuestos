import { useState } from 'react';
import api from '@/lib/api';
import { handleApiError } from '../utils/data';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApi = <T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): ApiResponse<T> => {
  const [response, setResponse] = useState<ApiResponse<T>>({
    data: null,
    loading: true,
    error: null
  });

  const fetchData = async () => {
    try {
      const config = {
        method,
        url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
        data: body,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const res = await api(config);
      setResponse({
        data: res.data,
        loading: false,
        error: null
      });
    } catch (error) {
      setResponse({
        data: null,
        loading: false,
        error: handleApiError(error)
      });
    }
  };

  // Solo llamamos a fetchData si hay un body (POST/PUT) o si es una llamada GET
  if (body || method === 'GET') {
    fetchData();
  }

  return response;
};
