export const getDefaultCarData = () => ({
  marca: 'Desconocida',
  modelo: 'Desconocido',
  año: new Date().getFullYear(),
  precio: 0,
  kilometraje: 0,
  transmision: 'manual',
  combustible: 'gasolina',
  estado: 'usado',
  descripcion: 'Sin descripción disponible',
  imagen_principal: null
});

export const formatCarData = (car: any) => {
  // Manejo de valores null o undefined
  const formattedCar = {
    marca: car.marca || 'Desconocida',
    modelo: car.modelo || 'Desconocido',
    año: car.año || new Date().getFullYear(),
    precio: car.precio || 0,
    kilometraje: car.kilometraje ?? 0,
    transmision: car.transmision || 'manual',
    combustible: car.combustible || 'gasolina',
    estado: car.estado || 'usado',
    descripcion: car.descripcion || 'Sin descripción disponible',
    imagen_principal: car.imagen_principal || null
  };

  // Manejo de tipos de datos
  formattedCar.año = Number(formattedCar.año);
  formattedCar.precio = Number(formattedCar.precio);
  formattedCar.kilometraje = Number(formattedCar.kilometraje);

  return formattedCar;
};

export const handleApiError = (error: any) => {
  console.error('Error de API:', error);
  
  // Manejo de diferentes tipos de errores
  if (error.response) {
    // El servidor respondió con un error
    return error.response.data?.message || 'Error del servidor';
  } else if (error.request) {
    // La solicitud fue hecha pero no hubo respuesta
    return 'No se pudo conectar con el servidor';
  } else {
    // Error en la configuración de la solicitud
    return 'Error en la solicitud';
  }
};
