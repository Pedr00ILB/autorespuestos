'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number | null;
  fuel: string;
  priceMLC: number;
  priceCUP: number | null;
  images: string[];
  description: string;
  specifications: {
    engine: string;
    transmission: string;
    color: string;
    seats: number;
    features: string[];
  };
}

export default function CarManagement() {
  const { toast } = useToast();
  const [carsList, setCarsList] = useState<Car[]>([]);
  const [open, setOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [featuresInput, setFeaturesInput] = useState('');

  // Cargar vehículos al iniciar
  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await fetch('/api/vehicles');
        if (response.ok) {
          const data = await response.json();
          // Convertir objeto de vehículos a array
          const vehiclesArray = Object.values(data || {});
          setCarsList(vehiclesArray as Car[]);
        }
      } catch (error) {
        console.error('Error al cargar vehículos:', error);
        toast({ 
          title: 'Error al cargar vehículos', 
          description: 'No se pudieron cargar los vehículos', 
          variant: 'destructive' 
        });
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
  }, [toast]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget.elements as typeof e.currentTarget.elements & {
      brand: HTMLInputElement;
      model: HTMLInputElement;
      year: HTMLInputElement;
      priceMLC: HTMLInputElement;
      priceCUP: HTMLInputElement;
      imageUrl: HTMLInputElement;
      mileage: HTMLInputElement;
      fuel: HTMLSelectElement;
      description: HTMLTextAreaElement;
      engine: HTMLInputElement;
      transmission: HTMLInputElement;
      color: HTMLInputElement;
      seats: HTMLInputElement;
    };

    // Procesar las características del array de strings
    const features = featuresInput.split(',').map(feature => feature.trim()).filter(Boolean);

    const carData: Car = {
      id: editingCar?.id || Date.now().toString(),
      brand: form.brand.value.trim(),
      model: form.model.value.trim(),
      year: parseInt(form.year.value, 10),
      mileage: form.mileage.value ? parseInt(form.mileage.value, 10) : null,
      fuel: form.fuel.value,
      priceMLC: parseFloat(form.priceMLC.value),
      priceCUP: form.priceCUP.value ? parseFloat(form.priceCUP.value) : null,
      images: [form.imageUrl.value.trim()], // Por ahora solo permitimos una imagen
      description: form.description.value.trim(),
      specifications: {
        engine: form.engine.value.trim(),
        transmission: form.transmission.value.trim(),
        color: form.color.value.trim(),
        seats: parseInt(form.seats.value, 10),
        features: features,
      },
    };

    try {
      // Aquí se implementaría la lógica para guardar en la API
      if (editingCar) {
        // TODO: Implementar actualización a través de la API
        setCarsList((prev) =>
          prev.map((c) => (c.id === editingCar.id ? carData : c))
        );
        toast({ title: 'Vehículo actualizado' });
      } else {
        // TODO: Implementar creación a través de la API
        setCarsList((prev) => [carData, ...prev]);
        toast({ title: 'Vehículo creado' });
      }

      setOpen(false);
      setEditingCar(null);
      e.currentTarget.reset();
      setFeaturesInput('');
    } catch (error) {
      toast({ 
        title: 'Error al guardar', 
        description: 'No se pudo guardar el vehículo', 
        variant: 'destructive' 
      });
    }
  }

  function handleEdit(car: Car) {
    setEditingCar(car);
    setFeaturesInput(car.specifications.features.join(', '));
    setOpen(true);
  }

  function handleDelete(id: string) {
    // TODO: Implementar eliminación a través de la API
    setCarsList((prev) => prev.filter((c) => c.id !== id));
    toast({ title: 'Vehículo eliminado', variant: 'destructive' });
  }

  if (loading) {
    return <div className="text-center p-10">Cargando vehículos...</div>;
  }

  return (
    <div className='space-y-4'>
      {/* Botón para crear */}
      <div className='flex justify-end'>
        <Dialog
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            if (!open) {
              setEditingCar(null);
              setFeaturesInput('');
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>Nuevo Vehículo</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCar ? 'Editar Vehículo' : 'Nuevo Vehículo'}
              </DialogTitle>
              <DialogDescription>
                Rellena los datos del vehículo.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='brand'>Marca</Label>
                  <Input
                    id='brand'
                    name='brand'
                    defaultValue={editingCar?.brand || ''}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='model'>Modelo</Label>
                  <Input
                    id='model'
                    name='model'
                    defaultValue={editingCar?.model || ''}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='year'>Año</Label>
                  <Input
                    id='year'
                    name='year'
                    type='number'
                    defaultValue={editingCar?.year.toString() || ''}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='priceMLC'>Precio MLC</Label>
                  <Input
                    id='priceMLC'
                    name='priceMLC'
                    type='number'
                    step='0.01'
                    defaultValue={editingCar?.priceMLC.toString() || ''}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='priceCUP'>Precio CUP (opcional)</Label>
                  <Input
                    id='priceCUP'
                    name='priceCUP'
                    type='number'
                    step='0.01'
                    defaultValue={editingCar?.priceCUP?.toString() || ''}
                  />
                </div>
                <div>
                  <Label htmlFor='mileage'>Kilometraje (opcional)</Label>
                  <Input
                    id='mileage'
                    name='mileage'
                    type='number'
                    defaultValue={editingCar?.mileage?.toString() || ''}
                  />
                </div>
                <div>
                  <Label htmlFor='fuel'>Combustible</Label>
                  <select
                    id='fuel'
                    name='fuel'
                    className='w-full border rounded p-2'
                    defaultValue={editingCar?.fuel || 'Gasolina'}
                    required
                  >
                    <option value='Gasolina'>Gasolina</option>
                    <option value='Diésel'>Diésel</option>
                    <option value='Eléctrico'>Eléctrico</option>
                    <option value='Híbrido'>Híbrido</option>
                  </select>
                </div>
                <div className='col-span-2'>
                  <Label htmlFor='imageUrl'>URL Imagen</Label>
                  <Input
                    id='imageUrl'
                    name='imageUrl'
                    defaultValue={editingCar?.images?.[0] || ''}
                    required
                  />
                </div>
                <div className='col-span-2'>
                  <Label htmlFor='description'>Descripción</Label>
                  <textarea
                    id='description'
                    name='description'
                    className='w-full border rounded p-2 min-h-24'
                    defaultValue={editingCar?.description || ''}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='engine'>Motor</Label>
                  <Input
                    id='engine'
                    name='engine'
                    defaultValue={editingCar?.specifications?.engine || ''}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='transmission'>Transmisión</Label>
                  <Input
                    id='transmission'
                    name='transmission'
                    defaultValue={editingCar?.specifications?.transmission || ''}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='color'>Color</Label>
                  <Input
                    id='color'
                    name='color'
                    defaultValue={editingCar?.specifications?.color || ''}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='seats'>Asientos</Label>
                  <Input
                    id='seats'
                    name='seats'
                    type='number'
                    defaultValue={editingCar?.specifications?.seats?.toString() || '5'}
                    required
                  />
                </div>
                <div className='col-span-2'>
                  <Label htmlFor='features'>Características (separadas por comas)</Label>
                  <textarea
                    id='features'
                    className='w-full border rounded p-2 min-h-24'
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    placeholder="Aire acondicionado, Dirección asistida, Vidrios eléctricos"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type='submit'>Guardar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla de vehículos */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Marca</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Año</TableHead>
            <TableHead>Precio MLC</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carsList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No hay vehículos disponibles
              </TableCell>
            </TableRow>
          ) : (
            carsList.map((car) => (
              <TableRow key={car.id}>
                <TableCell>{car.brand}</TableCell>
                <TableCell>{car.model}</TableCell>
                <TableCell>{car.year}</TableCell>
                <TableCell>${car.priceMLC.toLocaleString()}</TableCell>
                <TableCell>
                  <div className='flex gap-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleEdit(car)}
                    >
                      Editar
                    </Button>
                    <Button
                      size='sm'
                      variant='destructive'
                      onClick={() => handleDelete(car.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
