import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react"
import Image from 'next/image'
import logo from '@/public/AutoRepuestoslogo.png'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <Image 
                src={logo} 
                alt="AutoRepuestos Logo" 
                width={140}
                height={80}
                className="object-contain"
              />
            </Link>
            <p className="text-gray-400 mb-4">
              Tu tienda de confianza para la compra, venta y mantenimiento de vehículos y repuestos.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/comprar" className="text-gray-400 hover:text-white">
                  Comprar
                </Link>
              </li>
              <li>
                <Link href="/servicios/reparacion" className="text-gray-400 hover:text-white">
                  Reparación
                </Link>
              </li>
              <li>
                <Link href="/servicios/asesoria" className="text-gray-400 hover:text-white">
                  Asesoría Técnica
                </Link>
              </li>
              <li>
                <Link href="/servicios/piezas" className="text-gray-400 hover:text-white">
                  Venta de Piezas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">Av. Principal #123, Ciudad</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">info@autorepuestos.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Suscríbete</h3>
            <p className="text-gray-400 mb-4">Recibe nuestras últimas ofertas y novedades.</p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Tu email" className="bg-gray-800 border-gray-700" />
              <Button>Enviar</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-400">
          <p> {new Date().getFullYear()} AutoRepuestos. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
