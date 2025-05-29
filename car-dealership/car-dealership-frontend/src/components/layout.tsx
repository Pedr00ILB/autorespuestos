import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="mr-2"
                />
                <span className="text-xl font-bold text-gray-800">AutoRepuestos</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/cars" className="text-gray-600 hover:text-gray-900">
                Catálogo
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                Acerca de
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white shadow mt-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">© 2025 AutoRepuestos. Todos los derechos reservados.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Facebook
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Instagram
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
