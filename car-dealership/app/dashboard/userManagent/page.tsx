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

interface User {
  id: string;
  name: string;
  email: string;
}

export default function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (
      form.elements.namedItem('name') as HTMLInputElement
    ).value.trim();
    const email = (
      form.elements.namedItem('email') as HTMLInputElement
    ).value.trim();
    if (!name || !email) return;

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, name, email } : u))
      );
      toast({ title: 'Usuario actualizado' });
    } else {
      const newUser: User = { id: Date.now().toString(), name, email };
      setUsers((prev) => [newUser, ...prev]);
      toast({ title: 'Usuario creado' });
    }
    setOpen(false);
    setEditingUser(null);
    form.reset();
  }

  function handleEdit(user: User) {
    setEditingUser(user);
    setOpen(true);
  }

  function handleDelete(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast({ title: 'Usuario eliminado', variant: 'destructive' });
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <Dialog
          open={open}
          onOpenChange={(state) => {
            setOpen(state);
            if (!state) setEditingUser(null);
          }}
        >
          <DialogTrigger asChild>
            <Button>Nuevo Usuario</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </DialogTitle>
              <DialogDescription>
                Completa los campos para guardar el usuario.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className='space-y-4'>
              <div className='grid gap-2'>
                <Label htmlFor='name'>Nombre</Label>
                <Input
                  id='name'
                  name='name'
                  defaultValue={editingUser?.name || ''}
                  required
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  defaultValue={editingUser?.email || ''}
                  required
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
            <TableHead>Email</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => handleEdit(user)}
                  >
                    Editar
                  </Button>
                  <Button
                    size='sm'
                    variant='destructive'
                    onClick={() => handleDelete(user.id)}
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
