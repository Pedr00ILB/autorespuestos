import { useRouter } from 'next/router';
import api from '@/lib/api';
import CarForm from './CarForm';

interface CreateCarProps {
  className?: string;
}

const CreateCar: React.FC<CreateCarProps> = ({ className = '' }) => {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const formDataToSend = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          if (key === 'imagen_principal' && typeof value === 'object') {
            formDataToSend.append(key, value as File);
          } else if (value !== undefined) {
            formDataToSend.append(key, value.toString());
          }
        }
      });

      await api.post('/api/carros/', formDataToSend);
      router.push('/cars');
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : 'Error al crear el carro');
    }
  };

  return (
    <CarForm
      onSubmit={handleSubmit}
      className={className}
    />
  );
};

export default CreateCar;
