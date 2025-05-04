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
import { accessories as initialParts } from '@/lib/data';

interface Part {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function PartManagement() {
  const { toast } = useToast();
  const [parts, setParts] = useState<Part[]>(initialParts);
  const [open, setOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget.elements as typeof e.currentTarget.elements & {
      name: HTMLInputElement;
      category: HTMLInputElement;
      price: HTMLInputElement;
      image: HTMLInputElement;
    };

    const partData: Part = {
      id: editingPart?.id || Date.now().toString(),
      name: form.name.value.trim(),
      category: form.category.value.trim(),
      price: parseFloat(form.price.value),
      image: form.image.value.trim(),
    };

    if (editingPart) {
      setParts((prev) =>
        prev.map((p) => (p.id === editingPart.id ? partData : p))
      );
      toast({ title: 'Pieza actualizada' });
    } else {
      setParts((prev) => [partData, ...prev]);
      toast({ title: 'Pieza creada' });
    }

    setOpen(false);
    setEditingPart(null);
    e.currentTarget.reset();
  }

  function handleEdit(part: Part) {
    setEditingPart(part);
    setOpen(true);
  }

  function handleDelete(id: string) {
    setParts((prev) => prev.filter((p) => p.id !== id));
    toast({ title: 'Pieza eliminada', variant: 'destructive' });
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <Dialog
          open={open}
          onOpenChange={(state) => {
            setOpen(state);
            if (!state) setEditingPart(null);
          }}
        >
          <DialogTrigger asChild>
            <Button>Nuevo Repuesto</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPart ? 'Editar Repuesto' : 'Nuevo Repuesto'}
              </DialogTitle>
              <DialogDescription>
                Completa los campos para guardar la pieza.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='name'>Nombre</Label>
                  <Input
                    id='name'
                    name='name'
                    defaultValue={editingPart?.name || ''}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='category'>Categoría</Label>
                  <Input
                    id='category'
                    name='category'
                    defaultValue={editingPart?.category || ''}
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
                    defaultValue={editingPart?.price.toString() || ''}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='image'>URL de Imagen</Label>
                  <Input
                    id='image'
                    name='image'
                    defaultValue={editingPart?.image || ''}
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parts.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell>${p.price.toFixed(2)}</TableCell>
              <TableCell>
                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => handleEdit(p)}
                  >
                    Editar
                  </Button>
                  <Button
                    size='sm'
                    variant='destructive'
                    onClick={() => handleDelete(p.id)}
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
