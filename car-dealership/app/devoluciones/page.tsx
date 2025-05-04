"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import ComprobanteVenta from "@/components/comprobante-venta"

// Esquema de validación
const formSchema = z.object({
  numeroFactura: z.string().min(1, { message: "El número de factura es requerido" }),
  fechaCompra: z.string().min(1, { message: "La fecha de compra es requerida" }),
  vehiculo: z.string().min(1, { message: "El vehículo es requerido" }),
  motivo: z.string().min(10, { message: "El motivo debe tener al menos 10 caracteres" }),
  tipoDevolucion: z.enum(["reembolso", "cambio"], {
    required_error: "Debe seleccionar un tipo de devolución",
  }),
  metodoPago: z.string().min(1, { message: "El método de pago es requerido" }),
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  email: z.string().email({ message: "Email inválido" }),
  telefono: z.string().min(1, { message: "El teléfono es requerido" }),
})

export default function DevolucionesPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<z.infer<typeof formSchema> | null>(null)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numeroFactura: "",
      fechaCompra: "",
      vehiculo: "",
      motivo: "",
      tipoDevolucion: "reembolso",
      metodoPago: "",
      nombre: "",
      email: "",
      telefono: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Aquí iría la lógica para procesar la devolución
      // Simulamos un proceso exitoso
      setFormData(values)
      setSubmitted(true)
      setError(null)
    } catch (err) {
      setError("Ha ocurrido un error al procesar la devolución. Por favor, inténtelo de nuevo.")
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Solicitud de Devolución</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {submitted ? (
        <div className="space-y-6">
          <Alert className="mb-6 border-green-500 text-green-500">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Solicitud Recibida</AlertTitle>
            <AlertDescription>
              Su solicitud de devolución ha sido recibida correctamente. A continuación puede ver el comprobante de
              venta.
            </AlertDescription>
          </Alert>

          <ComprobanteVenta data={formData!} />

          <div className="flex justify-center mt-6">
            <Button onClick={() => window.print()} className="mr-4">
              Imprimir Comprobante
            </Button>
            <Button variant="outline" onClick={() => setSubmitted(false)}>
              Realizar otra solicitud
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Compra</CardTitle>
              <CardDescription>
                Proporcione los detalles de la compra para la cual desea solicitar una devolución.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="numeroFactura"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Factura</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej. FAC-12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fechaCompra"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Compra</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vehiculo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehículo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un vehículo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="toyota-corolla">Toyota Corolla 2023</SelectItem>
                            <SelectItem value="honda-civic">Honda Civic 2022</SelectItem>
                            <SelectItem value="ford-mustang">Ford Mustang 2023</SelectItem>
                            <SelectItem value="chevrolet-camaro">Chevrolet Camaro 2022</SelectItem>
                            <SelectItem value="tesla-model3">Tesla Model 3 2023</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="motivo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motivo de la Devolución</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describa detalladamente el motivo de la devolución"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tipoDevolucion"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Tipo de Devolución</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="reembolso" />
                              </FormControl>
                              <FormLabel className="font-normal">Reembolso</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="cambio" />
                              </FormControl>
                              <FormLabel className="font-normal">Cambio por otro vehículo</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metodoPago"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Método de Pago Original</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un método de pago" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="tarjeta">Tarjeta de Crédito/Débito</SelectItem>
                            <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                            <SelectItem value="efectivo">Efectivo</SelectItem>
                            <SelectItem value="financiamiento">Financiamiento</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Información de Contacto</h3>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej. Juan Pérez" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="ejemplo@correo.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="telefono"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Enviar Solicitud
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Política de Devoluciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <p>
                    En AutoMarket, nos comprometemos a garantizar su satisfacción con cada compra. Nuestra política de
                    devoluciones le permite devolver un vehículo dentro de los primeros 7 días después de la compra o
                    antes de recorrer 1,000 kilómetros (lo que ocurra primero).
                  </p>
                  <p>
                    <strong>Condiciones para la devolución:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>El vehículo debe estar en las mismas condiciones en que fue entregado</li>
                    <li>No debe presentar daños adicionales o modificaciones</li>
                    <li>Debe incluir todos los accesorios, documentos y elementos originales</li>
                    <li>Debe presentar la factura original de compra</li>
                  </ul>
                  <p>
                    <strong>Proceso de devolución:</strong>
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Complete el formulario de solicitud de devolución</li>
                    <li>Un asesor se pondrá en contacto para programar la inspección del vehículo</li>
                    <li>Tras la aprobación, se procesará el reembolso o cambio según corresponda</li>
                  </ol>
                  <p className="text-sm text-gray-500 mt-4">
                    Para más información, consulte nuestros términos y condiciones completos o contacte a nuestro
                    servicio de atención al cliente.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preguntas Frecuentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">¿Cuánto tiempo tarda en procesarse mi devolución?</h3>
                    <p className="text-sm text-gray-600">
                      El proceso de devolución generalmente toma entre 5 y 10 días hábiles desde la aprobación.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">¿Puedo devolver accesorios comprados por separado?</h3>
                    <p className="text-sm text-gray-600">
                      Sí, los accesorios pueden devolverse dentro de los 30 días posteriores a la compra, siempre que
                      estén en su embalaje original y sin usar.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">¿Qué sucede si mi vehículo fue financiado?</h3>
                    <p className="text-sm text-gray-600">
                      Para vehículos financiados, trabajaremos directamente con la entidad financiera para procesar la
                      cancelación del préstamo.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
