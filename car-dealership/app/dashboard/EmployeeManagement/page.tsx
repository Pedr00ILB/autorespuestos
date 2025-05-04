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

interface Employee {
  id: string;
  name: string;
  position: string;
  email?: string;
}

export default function EmployeeManagement() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (
      form.elements.namedItem('name') as HTMLInputElement
    ).value.trim();
    const position = (
      form.elements.namedItem('position') as HTMLInputElement
    ).value.trim();
    const email = (
      form.elements.namedItem('email') as HTMLInputElement
    ).value.trim();
    if (!name || !position) return;

    if (editing) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editing.id ? { ...emp, name, position, email } : emp
        )
      );
      toast({ title: 'Trabajador actualizado' });
    } else {
      const newEmp: Employee = {
        id: Date.now().toString(),
        name,
        position,
        email: email || undefined,
      };
      setEmployees((prev) => [newEmp, ...prev]);
      toast({ title: 'Trabajador creado' });
    }
    setOpen(false);
    setEditing(null);
    form.reset();
  }

  function handleEdit(emp: Employee) {
    setEditing(emp);
    setOpen(true);
  }

  function handleDelete(id: string) {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    toast({ title: 'Trabajador eliminado', variant: 'destructive' });
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <Dialog
          open={open}
          onOpenChange={(state) => {
            setOpen(state);
            if (!state) setEditing(null);
          }}
        >
          <DialogTrigger asChild>
            <Button>Nuevo Trabajador</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? 'Editar Trabajador' : 'Nuevo Trabajador'}
              </DialogTitle>
              <DialogDescription>
                Completa los campos para guardar el trabajador.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className='space-y-4'>
              <div className='grid gap-2'>
                <Label htmlFor='name'>Nombre</Label>
                <Input
                  id='name'
                  name='name'
                  defaultValue={editing?.name || ''}
                  required
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='position'>Cargo</Label>
                <Input
                  id='position'
                  name='position'
                  defaultValue={editing?.position || ''}
                  required
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='email'>Email (opcional)</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  defaultValue={editing?.email || ''}
                />
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
            <TableHead>Cargo</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((emp) => (
            <TableRow key={emp.id}>
              <TableCell>{emp.name}</TableCell>
              <TableCell>{emp.position}</TableCell>
              <TableCell>{emp.email ?? '-'}</TableCell>
              <TableCell>
                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => handleEdit(emp)}
                  >
                    Editar
                  </Button>
                  <Button
                    size='sm'
                    variant='destructive'
                    onClick={() => handleDelete(emp.id)}
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
