import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';
import CarForm from './CarForm';
import Alert from '@/components/Alert';
import Spinner from '@/components/Spinner';

interface EditCarProps {
  className?: string;
  carId: string;
}

const EditCar: React.FC<EditCarProps> = ({ className = '', carId }) => {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await api.get(`/api/carros/${carId}/`);
        setFormData({
          marca: response.data.marca,
          modelo: response.data.modelo,
          año: parseInt(response.data.año.toString()),
          precio: parseFloat(response.data.precio.toString()),
          kilometraje: response.data.kilometraje ? parseInt(response.data.kilometraje.toString()) : undefined,
          transmision: response.data.transmision || '',
          combustible: response.data.combustible || '',
          estado: response.data.estado || '',
          descripcion: response.data.descripcion || '',
          imagen_principal: null
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el carro');
        console.error('Error fetching car:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  const handleSubmit = async (data: any) => {
    try {
      const formDataToSend = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          if (key === 'imagen_principal' && typeof value === 'object') {
            formDataToSend.append(key, value as File);
          } else {
            formDataToSend.append(key, String(value));
          }
        }
      });

      const response = await api.put(
        `/api/carros/${carId}/`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      router.push('/cars');
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al actualizar el carro');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Spinner size="large" className="mx-auto" />
        <p className="mt-4 text-gray-600">Cargando carro...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Alert message={error} type="error" />
      </div>
    </div>
  );

  if (!formData) return null;

  return (
    <CarForm
      initialData={formData}
      onSubmit={handleSubmit}
      isEditMode={true}
      className={className}
    />
  );
};

export default EditCar;
