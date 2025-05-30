import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { CartProvider } from "@/lib/cart-context"
import { AuthProvider as AuthContextProvider } from "@/context/AuthContext"
import AuthProvider from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AutoRepuestos - Compra y Venta de Vehículos y Repuestos",
  description: "La mejor plataforma para comprar y vender vehículos, repuestos y accesorios",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <AuthContextProvider>
          <AuthProvider>
            <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <Toaster />
            </div>
            </CartProvider>
          </AuthProvider>
        </AuthContextProvider>
      </body>
    </html>
  )
}
