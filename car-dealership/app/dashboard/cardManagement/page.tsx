'use client';

import React, { useState } from 'react';
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
  price: number;
  image: string;
  mileage: number;
  fuel: string;
  isNew: boolean;
}

export default function CarManagement() {
  const { toast } = useToast();
  const [carsList, setCarsList] = useState<Car[]>([]);
  const [open, setOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget.elements as typeof e.currentTarget.elements & {
      brand: HTMLInputElement;
      model: HTMLInputElement;
      year: HTMLInputElement;
      price: HTMLInputElement;
      image: HTMLInputElement;
      mileage: HTMLInputElement;
      fuel: HTMLSelectElement;
      isNew: HTMLInputElement;
    };

    const carData: Car = {
      id: editingCar?.id || Date.now().toString(),
      brand: form.brand.value.trim(),
      model: form.model.value.trim(),
      year: parseInt(form.year.value, 10),
      price: parseFloat(form.price.value),
      image: form.image.value.trim(),
      mileage: parseInt(form.mileage.value, 10),
      fuel: form.fuel.value,
      isNew: form.isNew.checked,
    };

    if (editingCar) {
      setCarsList((prev) =>
        prev.map((c) => (c.id === editingCar.id ? carData : c))
      );
      toast({ title: 'Coche actualizado' });
    } else {
      setCarsList((prev) => [carData, ...prev]);
      toast({ title: 'Coche creado' });
    }

    setOpen(false);
    setEditingCar(null);
    e.currentTarget.reset();
  }

  function handleEdit(car: Car) {
    setEditingCar(car);
    setOpen(true);
  }

  function handleDelete(id: string) {
    setCarsList((prev) => prev.filter((c) => c.id !== id));
    toast({ title: 'Coche eliminado', variant: 'destructive' });
  }

  return (
    <div className='space-y-4'>
      {/* Botón para crear */}
      <div className='flex justify-end'>
        <Dialog
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            if (!open) setEditingCar(null);
          }}
        >
          <DialogTrigger asChild>
            <Button>Nuevo Coche</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCar ? 'Editar Coche' : 'Nuevo Coche'}
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
                  <Label htmlFor='price'>Precio</Label>
                  <Input
                    id='price'
                    name='price'
                    type='number'
                    step='0.01'
                    defaultValue={editingCar?.price.toString() || ''}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='mileage'>Kilometraje</Label>
                  <Input
                    id='mileage'
                    name='mileage'
                    type='number'
                    defaultValue={editingCar?.mileage.toString() || ''}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='fuel'>Combustible</Label>
                  <select
                    id='fuel'
                    name='fuel'
                    className='w-full border rounded p-2'
                    defaultValue={editingCar?.fuel || 'Gasolina'}
                  >
                    <option value='Gasolina'>Gasolina</option>
                    <option value='Diésel'>Diésel</option>
                    <option value='Eléctrico'>Eléctrico</option>
                  </select>
                </div>
                <div className='col-span-2'>
                  <Label htmlFor='image'>URL Imagen</Label>
                  <Input
                    id='image'
                    name='image'
                    defaultValue={editingCar?.image || ''}
                    required
                  />
                </div>
                <div className='col-span-2 flex items-center gap-2'>
                  <Input
                    id='isNew'
                    name='isNew'
                    type='checkbox'
                    defaultChecked={editingCar?.isNew}
                  />
                  <Label htmlFor='isNew'>Nuevo</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type='submit'>Guardar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla de coches */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Marca</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Año</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carsList.map((car) => (
            <TableRow key={car.id}>
              <TableCell>{car.brand}</TableCell>
              <TableCell>{car.model}</TableCell>
              <TableCell>{car.year}</TableCell>
              <TableCell>${car.price.toLocaleString()}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
