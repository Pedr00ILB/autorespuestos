import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Car, FileText, User, RotateCcw } from "lucide-react"

interface ComprobanteVentaProps {
  data: {
    numeroFactura: string
    fechaCompra: string
    vehiculo: string
    motivo: string
    tipoDevolucion: string
    metodoPago: string
    nombre: string
    email: string
    telefono: string
  }
}

export default function ComprobanteVenta({ data }: ComprobanteVentaProps) {
  // Mapeo de IDs de vehículos a nombres completos
  const vehiculosMap: Record<string, { nombre: string; precio: number }> = {
    "toyota-corolla": { nombre: "Toyota Corolla 2023", precio: 25000 },
    "honda-civic": { nombre: "Honda Civic 2022", precio: 23500 },
    "ford-mustang": { nombre: "Ford Mustang 2023", precio: 45000 },
    "chevrolet-camaro": { nombre: "Chevrolet Camaro 2022", precio: 42000 },
    "tesla-model3": { nombre: "Tesla Model 3 2023", precio: 52000 },
  }

  // Mapeo de métodos de pago
  const metodoPagoMap: Record<string, string> = {
    tarjeta: "Tarjeta de Crédito/Débito",
    transferencia: "Transferencia Bancaria",
    efectivo: "Efectivo",
    financiamiento: "Financiamiento",
  }

  // Obtener información del vehículo
  const vehiculoInfo = vehiculosMap[data.vehiculo] || { nombre: "Vehículo no especificado", precio: 0 }

  // Calcular impuestos (16% IVA)
  const subtotal = vehiculoInfo.precio
  const impuestos = subtotal * 0.16
  const total = subtotal + impuestos

  // Formatear fecha
  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  // Generar número de solicitud único
  const numeroSolicitud = `DEV-${Date.now().toString().slice(-6)}`

  return (
    <Card className="border-2 print:border-black">
      <CardHeader className="bg-gray-50 print:bg-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Car className="h-6 w-6" />
            <CardTitle>AutoMarket</CardTitle>
          </div>
          <div className="text-right">
            <h3 className="font-bold">COMPROBANTE DE VENTA</h3>
            <p className="text-sm text-gray-500">Solicitud de Devolución: {numeroSolicitud}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4" /> Información de la Factura
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Número de Factura:</span> {data.numeroFactura}
              </p>
              <p>
                <span className="font-medium">Fecha de Compra:</span> {formatearFecha(data.fechaCompra)}
              </p>
              <p>
                <span className="font-medium">Método de Pago:</span> {metodoPagoMap[data.metodoPago]}
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-medium flex items-center gap-2 mb-2">
              <User className="h-4 w-4" /> Información del Cliente
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Nombre:</span> {data.nombre}
              </p>
              <p>
                <span className="font-medium">Email:</span> {data.email}
              </p>
              <p>
                <span className="font-medium">Teléfono:</span> {data.telefono}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium flex items-center gap-2 mb-2">
            <Car className="h-4 w-4" /> Detalles del Vehículo
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Precio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{vehiculoInfo.nombre}</TableCell>
                <TableCell className="text-right">${vehiculoInfo.precio.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Subtotal</TableCell>
                <TableCell className="text-right">${subtotal.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>IVA (16%)</TableCell>
                <TableCell className="text-right">${impuestos.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Total</TableCell>
                <TableCell className="text-right font-bold">${total.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mb-6">
          <h3 className="font-medium flex items-center gap-2 mb-2">
            <RotateCcw className="h-4 w-4" /> Información de la Devolución
          </h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Tipo de Devolución:</span>{" "}
              {data.tipoDevolucion === "reembolso" ? "Reembolso" : "Cambio por otro vehículo"}
            </p>
            <p>
              <span className="font-medium">Motivo:</span> {data.motivo}
            </p>
            <p>
              <span className="font-medium">Fecha de Solicitud:</span>{" "}
              {formatearFecha(new Date().toISOString().split("T")[0])}
            </p>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Términos y Condiciones</h3>
              <p className="text-xs text-gray-600">
                La aprobación de esta solicitud está sujeta a la inspección del vehículo. El reembolso se procesará
                utilizando el mismo método de pago original en un plazo de 5 a 10 días hábiles después de la aprobación.
              </p>
            </div>
            <div className="text-right">
              <div className="mt-10 pt-10 border-t border-dashed">
                <p className="text-sm">Firma del Cliente</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>AutoMarket S.A. - Av. Principal #123, Ciudad - Tel: +1 (555) 123-4567</p>
          <p>Este documento es un comprobante de su solicitud de devolución y no garantiza la aprobación automática.</p>
        </div>
      </CardContent>
    </Card>
  )
}
