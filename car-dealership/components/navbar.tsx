'use client';
import logo from '@/public/AutoRepuestoslogo(black).png';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Car,
  Menu,
  ShoppingCart,
  PenToolIcon as Tool,
  Wrench,
  X,
  RotateCcw,
} from 'lucide-react';
import Cart from '@/components/cart';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Link href='/' className='flex items-center gap-2 font-bold text-xl'>
            <Image src={logo} alt='Logo' className=' w-[12rem] ml-10' />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center gap-6'>
          <Link href='/' className='text-sm font-medium hover:text-primary'>
            Inicio
          </Link>
          <Link
            href='/comprar'
            className='text-sm font-medium hover:text-primary'
          >
            Comprar
          </Link>
          <Link
            href='/accesorios'
            className='text-sm font-medium hover:text-primary'
          >
            Accesorios
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='link' className='text-sm font-medium p-0'>
                Servicios
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem>
                <Link href='/servicios/reparacion' className='flex w-full'>
                  <Wrench className='mr-2 h-4 w-4' />
                  Reparación
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href='/servicios/asesoria' className='flex w-full'>
                  <Tool className='mr-2 h-4 w-4' />
                  Asesoría Técnica
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href='/servicios/piezas' className='flex w-full'>
                  <ShoppingCart className='mr-2 h-4 w-4' />
                  Venta de Piezas
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href='/devoluciones'
            className='text-sm font-medium hover:text-primary'
          >
            <span className='flex items-center gap-1'>
              <RotateCcw className='h-4 w-4' />
              Devoluciones
            </span>
          </Link>
        </nav>

        {/* Auth Buttons & Cart - Desktop */}
        <div className='hidden md:flex items-center gap-4'>
          <Cart />
          <Link href='/login'>
            <Button variant='outline'>Iniciar Sesión</Button>
          </Link>
          <Link href='/register'>
            <Button>Registrarse</Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <div className='flex items-center gap-2 md:hidden'>
            <Cart />
            <SheetTrigger asChild>
              <Button variant='outline' size='icon'>
                <Menu className='h-6 w-6' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
          </div>
          <SheetContent side='right'>
            <div className='flex flex-col h-full'>
              <div className='flex items-center justify-between border-b pb-4'>
                <Link
                  href='/'
                  className='flex items-center gap-2 font-bold text-xl'
                >
                  <Car className='h-6 w-6' />
                  <span>AutoRepuestos</span>
                </Link>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className='h-6 w-6' />
                </Button>
              </div>
              <nav className='flex flex-col gap-4 py-6'>
                <Link
                  href='/'
                  className='text-lg font-medium'
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link
                  href='/comprar'
                  className='text-lg font-medium'
                  onClick={() => setIsMenuOpen(false)}
                >
                  Comprar
                </Link>
                <Link
                  href='/accesorios'
                  className='text-lg font-medium'
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accesorios
                </Link>
                <div className='flex flex-col gap-2 pl-4 border-l'>
                  <h3 className='text-lg font-medium'>Servicios</h3>
                  <Link
                    href='/servicios/reparacion'
                    className='text-base'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Reparación
                  </Link>
                  <Link
                    href='/servicios/asesoria'
                    className='text-base'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Asesoría Técnica
                  </Link>
                  <Link
                    href='/servicios/piezas'
                    className='text-base'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Venta de Piezas
                  </Link>
                </div>
                <Link
                  href='/devoluciones'
                  className='text-lg font-medium'
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className='flex items-center gap-2'>
                    <RotateCcw className='h-5 w-5' />
                    Devoluciones
                  </span>
                </Link>
              </nav>
              <div className='mt-auto flex flex-col gap-4'>
                <Link href='/login' onClick={() => setIsMenuOpen(false)}>
                  <Button variant='outline' className='w-full'>
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href='/register' onClick={() => setIsMenuOpen(false)}>
                  <Button className='w-full'>Registrarse</Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
