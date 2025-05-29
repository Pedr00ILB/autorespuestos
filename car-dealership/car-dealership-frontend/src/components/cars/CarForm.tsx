import { useState } from 'react';
import Alert from '@/components/Alert';

interface CarFormData {
  marca: string;
  modelo: string;
  año: number;
  precio: number;
  kilometraje?: number;
  transmision?: string;
  combustible?: string;
  estado?: string;
  descripcion?: string;
  imagen_principal?: File | null;
}

interface CarFormProps {
  initialData?: CarFormData;
  onSubmit: (data: CarFormData) => Promise<void>;
  isEditMode?: boolean;
  className?: string;
}

const CarForm: React.FC<CarFormProps> = ({ 
  initialData = {
    marca: '',
    modelo: '',
    año: 0,
    precio: 0,
    kilometraje: undefined,
    transmision: '',
    combustible: '',
    estado: '',
    descripcion: '',
    imagen_principal: null
  },
  onSubmit,
  isEditMode = false,
  className = ''
}) => {
  const [formData, setFormData] = useState<CarFormData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'año' || name === 'precio' ? parseInt(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imagen_principal: file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await onSubmit(formData);
      setSuccess('Operación exitosa');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la operación');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-100 ${className}`}>
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            {isEditMode ? 'Editar Carro' : 'Crear Carro'}
          </h1>
          
          {success && (
            <Alert message={success} type="success" className="mb-6" />
          )}
          {error && (
            <Alert message={error} type="error" className="mb-6" />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="marca" className="block text-sm font-medium text-gray-700">
                Marca
              </label>
              <input
                type="text"
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">
                Modelo
              </label>
              <input
                type="text"
                id="modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="año" className="block text-sm font-medium text-gray-700">
                Año
              </label>
              <input
                type="number"
                id="año"
                name="año"
                value={formData.año}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="1900"
                max={new Date().getFullYear().toString()}
              />
            </div>

            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
                Precio
              </label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="kilometraje" className="block text-sm font-medium text-gray-700">
                Kilometraje
              </label>
              <input
                type="number"
                id="kilometraje"
                name="kilometraje"
                value={formData.kilometraje || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="transmision" className="block text-sm font-medium text-gray-700">
                Transmisión
              </label>
              <input
                type="text"
                id="transmision"
                name="transmision"
                value={formData.transmision}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="combustible" className="block text-sm font-medium text-gray-700">
                Combustible
              </label>
              <input
                type="text"
                id="combustible"
                name="combustible"
                value={formData.combustible}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                Estado
              </label>
              <input
                type="text"
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={4}
              />
            </div>

            <div>
              <label htmlFor="imagen_principal" className="block text-sm font-medium text-gray-700">
                Imagen Principal
              </label>
              <input
                type="file"
                id="imagen_principal"
                name="imagen_principal"
                onChange={handleImageChange}
                accept="image/*"
                className="mt-1 block w-full"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarForm;
