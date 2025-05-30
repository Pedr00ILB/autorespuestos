'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import Image from 'next/image';
import { AuthProvider } from '@/providers/AuthProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "AutoRepuestos",
  description: "Catálogo de carros y repuestos de alta calidad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} antialiased min-h-screen bg-gray-100`}
      >
        <AuthProvider>
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
                  <span className="text-xl font-bold">AutoRepuestos</span>
                </Link>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  href="/cars"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Catálogo
                </Link>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sobre Nosotros
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="bg-white shadow mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
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
        </AuthProvider>
      </body>
    </html>
  );
}
