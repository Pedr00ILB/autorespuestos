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
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='link' className='text-sm font-medium p-0'>
                Comprar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem>
                <Link href='/comprar' className='flex w-full'>
                  <Car className='mr-2 h-4 w-4' />
                  Vehículos
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href='/accesorios' className='flex w-full'>
                  <Tool className='mr-2 h-4 w-4' />
                  Accesorios
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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

        {/* Mobile Menu Button */}
        <Button
          variant='ghost'
          size='icon'
          className='md:hidden'
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className='h-6 w-6' />
        </Button>

        {/* Mobile Menu */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetContent side='left' className='w-[300px]'>
            <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
            <div className='flex items-center justify-between py-4'>
              <Link href='/' className='flex items-center gap-2'>
                <Image src={logo} alt='Logo' className='h-8 w-auto' />
              </Link>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsMenuOpen(false)}
              >
                <X className='h-6 w-6' />
              </Button>
            </div>
            <nav className='space-y-4'>
              <Link
                href='/'
                className='text-sm font-medium hover:text-primary block'
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='text-sm font-medium w-full justify-start'
                  >
                    Comprar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-full'>
                  <DropdownMenuItem>
                    <Link
                      href='/comprar'
                      className='flex w-full'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Car className='mr-2 h-4 w-4' />
                      Vehículos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href='/accesorios'
                      className='flex w-full'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Tool className='mr-2 h-4 w-4' />
                      Accesorios
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='text-sm font-medium w-full justify-start'
                  >
                    Servicios
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-full'>
                  <DropdownMenuItem>
                    <Link
                      href='/servicios/reparacion'
                      className='flex w-full'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Wrench className='mr-2 h-4 w-4' />
                      Reparación
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href='/servicios/asesoria'
                      className='flex w-full'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Tool className='mr-2 h-4 w-4' />
                      Asesoría Técnica
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href='/servicios/piezas'
                      className='flex w-full'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingCart className='mr-2 h-4 w-4' />
                      Venta de Piezas
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Link
                href='/devoluciones'
                className='text-sm font-medium hover:text-primary block'
                onClick={() => setIsMenuOpen(false)}
              >
                <span className='flex items-center gap-1'>
                  <RotateCcw className='h-4 w-4' />
                  Devoluciones
                </span>
              </Link>

              {/* Auth Buttons - Mobile */}
              <div className='mt-6 space-y-2'>
                <Link href='/login'>
                  <Button
                    variant='outline'
                    className='w-full'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href='/register'>
                  <Button
                    className='w-full'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrarse
                  </Button>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
