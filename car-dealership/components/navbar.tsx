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
  DropdownMenuSeparator,
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
  User,
  LogOut,
  UserCircle,
  Settings,
  UserCog,
  LayoutDashboard,
} from 'lucide-react';
import Cart from '@/components/cart';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Link href='/' className='flex items-center gap-2 font-bold text-xl'>
            <Image src={logo} alt='Logo' className='w-[12rem] ml-4 md:ml-10' priority />
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
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem asChild>
                <Link href='/vehiculos' className='flex items-center w-full px-4 py-2 text-sm'>
                  <Car className='mr-3 h-4 w-4' />
                  Vehículos
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/accesorios' className='flex items-center w-full px-4 py-2 text-sm'>
                  <Tool className='mr-3 h-4 w-4' />
                  Accesorios
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href='/piezas-repuestos' className='flex items-center w-full px-4 py-2 text-sm'>
                  <Wrench className='mr-3 h-4 w-4' />
                  Piezas y Repuestos
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
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem asChild>
                <Link href='/servicios/reparacion' className='flex items-center w-full px-4 py-2 text-sm'>
                  <Wrench className='mr-3 h-4 w-4' />
                  Reparación
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/servicios/asesoria' className='flex items-center w-full px-4 py-2 text-sm'>
                  <Tool className='mr-3 h-4 w-4' />
                  Asesoría Técnica
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link
            href='/devoluciones'
            className='text-sm font-medium hover:text-primary flex items-center gap-1'
          >
            <RotateCcw className='h-4 w-4' />
            Devoluciones
          </Link>

        </nav>

        {/* Auth Buttons & Cart - Desktop */}
        <div className='hidden md:flex items-center gap-4'>
          <Cart />
          
          {loading ? (
            <div className='flex items-center justify-center w-10 h-10'>
              <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-primary'></div>
            </div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='relative h-10 w-10 rounded-full'>
                  <UserCircle className='h-6 w-6' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56' align='end' forceMount>
                <div className='flex items-center justify-start gap-2 p-2'>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm font-medium leading-none'>{user.nombre || 'Usuario'}</p>
                    <p className='text-xs leading-none text-muted-foreground'>{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href='/perfil' className='w-full cursor-pointer'>
                    <User className='mr-2 h-4 w-4' />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                {user.is_staff && (
                  <DropdownMenuItem asChild>
                    <Link href='/admin' className='w-full cursor-pointer'>
                      <LayoutDashboard className='mr-2 h-4 w-4' />
                      Panel de Control
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className='text-red-600 focus:text-red-600 focus:bg-red-50'
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href='/login'>
                <Button variant='outline' className='hidden sm:flex'>Iniciar Sesión</Button>
              </Link>
              <Link href='/register'>
                <Button className='hidden sm:flex'>Registrarse</Button>
              </Link>
            </>
          )}
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
              <Link 
                href='/' 
                className='flex items-center gap-2'
                onClick={() => setIsMenuOpen(false)}
              >
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
            
            {/* User Info Mobile */}
            {user && !loading && (
              <div className='flex items-center gap-3 px-4 py-3 mb-4 bg-gray-50 rounded-lg'>
                <div className='flex items-center justify-center h-10 w-10 rounded-full bg-primary/10'>
                  <User className='h-5 w-5 text-primary' />
                </div>
                <div>
                  <p className='text-sm font-medium'>{user.nombre || 'Usuario'}</p>
                  <p className='text-xs text-muted-foreground'>{user.email}</p>
                </div>
              </div>
            )}
            <nav className='space-y-4'>
              {!loading && !user && (
                <div className='flex flex-col space-y-2 mb-4'>
                  <Link 
                    href='/login' 
                    className='w-full'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant='outline' className='w-full'>
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link 
                    href='/register' 
                    className='w-full'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className='w-full'>
                      Registrarse
                    </Button>
                  </Link>
                </div>
              )}
              
              <Link
                href='/'
                className='text-sm font-medium hover:text-primary block py-2 px-2 rounded-md hover:bg-accent'
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <div className='space-y-1'>
                <h3 className='px-4 py-2 text-sm font-medium text-muted-foreground'>Comprar</h3>
                <Link
                  href='/vehiculos'
                  className='flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent'
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Car className='mr-3 h-4 w-4' />
                  Vehículos
                </Link>
                <Link
                  href='/accesorios'
                  className='flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent'
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Tool className='mr-3 h-4 w-4' />
                  Accesorios
                </Link>
                <Link
                  href='/piezas-repuestos'
                  className='flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent'
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Wrench className='mr-3 h-4 w-4' />
                  Piezas y Repuestos
                </Link>
              </div>
              
              <div className='space-y-1'>
                <h3 className='px-4 py-2 text-sm font-medium text-muted-foreground'>Servicios</h3>
                <Link
                  href='/servicios/reparacion'
                  className='flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent'
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Wrench className='mr-3 h-4 w-4' />
                  Reparación
                </Link>
                <Link
                  href='/servicios/asesoria'
                  className='flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent'
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Tool className='mr-3 h-4 w-4' />
                  Asesoría Técnica
                </Link>
              </div>
              
              <Link
                href='/devoluciones'
                className='text-sm font-medium hover:text-primary block py-2 px-2 rounded-md hover:bg-accent'
                onClick={() => setIsMenuOpen(false)}
              >
                <span className='flex items-center gap-1'>
                  <RotateCcw className='h-4 w-4' />
                  Devoluciones
                </span>
              </Link>


            </nav>
            
            {/* Mobile Auth Actions */}
            {user && !loading && (
              <div className='mt-6 pt-4 border-t'>
                <Link 
                  href='/perfil'
                  className='flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-accent'
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className='mr-3 h-5 w-5' />
                  Mi Perfil
                </Link>
                {user.is_staff && (
                  <Link 
                    href='/admin'
                    className='flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-accent'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className='mr-3 h-5 w-5' />
                    Panel de Control
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className='flex w-full items-center px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50'
                >
                  <LogOut className='mr-3 h-5 w-5' />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
