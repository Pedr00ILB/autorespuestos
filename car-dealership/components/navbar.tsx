'use client';
import logo from '@/public/AutoRepuestoslogo(black).png';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  LayoutDashboard,
} from 'lucide-react';
import Cart from '@/components/cart';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useToast } from '@/components/ui/use-toast';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  // Evitar hidratación no coincidente
  if (!mounted) {
    return (
      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container flex h-16 items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Link href='/' className='flex items-center gap-2 font-bold text-xl'>
              <Image src={logo} alt='Logo' className='w-[12rem] ml-10' />
            </Link>
          </div>
        </div>
      </header>
    );
  }

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

          {isAuthenticated && user?.es_admin && (
            <Link
              href='/dashboard'
              className='text-sm font-medium hover:text-primary flex items-center gap-1'
            >
              <LayoutDashboard className='h-4 w-4' />
              Dashboard
            </Link>
          )}
        </nav>

        {/* Auth Buttons & Cart - Desktop */}
        <div className='flex items-center gap-2'>
          <Cart />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='icon' className='rounded-full h-9 w-9'>
                  <UserCircle className='h-5 w-5' />
                  <span className='sr-only'>Menú de usuario</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <div className='flex items-center justify-start gap-2 p-2'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100'>
                    <User className='h-5 w-5' />
                  </div>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm font-medium'>{user?.first_name || 'Usuario'}</p>
                    <p className='text-xs text-muted-foreground'>{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href='/perfil' className='w-full cursor-pointer'>
                    <User className='mr-2 h-4 w-4' />
                    Mi perfil
                  </Link>
                </DropdownMenuItem>
                {user?.es_admin && (
                  <DropdownMenuItem asChild>
                    <Link href='/dashboard' className='w-full cursor-pointer'>
                      <LayoutDashboard className='mr-2 h-4 w-4' />
                      Panel de control
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>
                  <LogOut className='mr-2 h-4 w-4' />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href='/login'>
                <Button variant='outline' size='sm'>
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href='/register'>
                <Button size='sm'>Registrarse</Button>
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
              {isAuthenticated && user && (
                <div className='flex items-center gap-3 p-2 border-b'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100'>
                    <User className='h-5 w-5' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>{user.first_name || 'Usuario'}</p>
                    <p className='text-xs text-muted-foreground'>{user.email}</p>
                  </div>
                </div>
              )}
              <Link
                href='/'
                className='text-sm font-medium hover:text-primary block pt-2'
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
                {isAuthenticated ? (
                  <>
                    <Link href='/perfil' className='w-full'>
                      <Button
                        variant='outline'
                        className='w-full mb-2'
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className='mr-2 h-4 w-4' />
                        Mi Perfil
                      </Button>
                    </Link>
                    {user?.es_admin && (
                      <Link href='/dashboard' className='w-full'>
                        <Button
                          variant='outline'
                          className='w-full mb-2'
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <LayoutDashboard className='mr-2 h-4 w-4' />
                          Panel de Control
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant='destructive'
                      className='w-full'
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className='mr-2 h-4 w-4' />
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href='/login' className='w-full'>
                      <Button
                        variant='outline'
                        className='w-full'
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link href='/register' className='w-full block mt-2'>
                      <Button
                        className='w-full'
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Registrarse
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
