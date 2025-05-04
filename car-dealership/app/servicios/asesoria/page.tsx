'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, CheckCircle2, PenToolIcon as Tool } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Esquema de validación
const formSchema = z.object({
  nombre: z.string().min(1, { message: 'El nombre es requerido' }),
  email: z.string().email({ message: 'Email inválido' }),
  telefono: z.string().min(1, { message: 'El teléfono es requerido' }),
  vehiculo: z.string().min(1, { message: 'El tipo de vehículo es requerido' }),
  marca: z.string().min(1, { message: 'La marca es requerida' }),
  modelo: z.string().min(1, { message: 'El modelo es requerido' }),
  anio: z.string().min(1, { message: 'El año es requerido' }),
  tipoAsesoria: z.enum(['mecanica', 'electrica', 'estetica', 'compra'], {
    required_error: 'Debe seleccionar un tipo de asesoría',
  }),
  fecha: z.date({
    required_error: 'La fecha es requerida',
  }),
  horario: z.string().min(1, { message: 'El horario es requerido' }),
  descripcion: z
    .string()
    .min(10, { message: 'La descripción debe tener al menos 10 caracteres' }),
});

export default function AsesoriaPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<z.infer<typeof formSchema> | null>(
    null
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      email: '',
      telefono: '',
      vehiculo: '',
      marca: '',
      modelo: '',
      anio: '',
      tipoAsesoria: 'mecanica',
      descripcion: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setFormData(values);
    setSubmitted(true);
    console.log(values);
  }

  // Horarios disponibles
  const horarios = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ];

  return (
    <div className='container mx-auto py-10 px-4'>
      <div className='flex flex-col md:flex-row items-center gap-6 mb-10'>
        <div className='flex-1'>
          <h1 className='text-3xl font-bold mb-4'>
            Asesoría Técnica Especializada
          </h1>
          <p className='text-gray-600 mb-6'>
            Nuestro equipo de expertos técnicos está listo para ayudarte con
            cualquier duda o problema relacionado con tu vehículo. Agenda una
            cita y recibe asesoramiento personalizado de los mejores
            profesionales del sector.
          </p>
          <div className='flex flex-wrap gap-4'>
            <Link href='#agendar'>
              <Button size='lg' className='bg-red-600 hover:bg-red-700'>
                Agendar Asesoría
              </Button>
            </Link>
          </div>
        </div>
        <div className='relative w-full md:w-1/2 h-[300px] rounded-lg overflow-hidden'>
          <Image
            src='/placeholder.svg?height=300&width=500'
            alt='Asesoría Técnica'
            fill
            className='object-cover'
          />
        </div>
      </div>

      <Tabs defaultValue='tipos' className='mb-10'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='tipos'>Tipos de Asesoría</TabsTrigger>
          <TabsTrigger value='proceso'>Proceso</TabsTrigger>
          <TabsTrigger value='preguntas'>Preguntas Frecuentes</TabsTrigger>
        </TabsList>
        <TabsContent value='tipos' className='p-6 border rounded-md mt-2'>
          <div className='grid md:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle>Asesoría Mecánica</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600'>
                  Diagnóstico de problemas mecánicos, recomendaciones de
                  mantenimiento preventivo, evaluación de rendimiento del motor
                  y sistemas de transmisión.
                </p>
                <ul className='list-disc pl-5 mt-4 space-y-1 text-gray-600'>
                  <li>Diagnóstico de ruidos y vibraciones</li>
                  <li>Evaluación de sistemas de frenos</li>
                  <li>Análisis de consumo de combustible</li>
                  <li>Recomendaciones de mantenimiento</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Asesoría Eléctrica</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600'>
                  Diagnóstico de sistemas eléctricos, solución de problemas con
                  luces, batería, alternador y sistemas electrónicos del
                  vehículo.
                </p>
                <ul className='list-disc pl-5 mt-4 space-y-1 text-gray-600'>
                  <li>Diagnóstico de fallos eléctricos</li>
                  <li>Evaluación de sistemas de arranque</li>
                  <li>Análisis de computadoras y sensores</li>
                  <li>Solución de problemas con la batería</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Asesoría Estética</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600'>
                  Recomendaciones para el cuidado de la pintura, interiores,
                  tratamientos de protección y mejoras estéticas para tu
                  vehículo.
                </p>
                <ul className='list-disc pl-5 mt-4 space-y-1 text-gray-600'>
                  <li>Consejos para el cuidado de la pintura</li>
                  <li>Recomendaciones de productos de limpieza</li>
                  <li>Opciones de personalización</li>
                  <li>Tratamientos de protección</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Asesoría de Compra</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600'>
                  Te ayudamos a tomar la mejor decisión al comprar un vehículo
                  nuevo o usado, evaluando su estado, valor y potenciales
                  problemas.
                </p>
                <ul className='list-disc pl-5 mt-4 space-y-1 text-gray-600'>
                  <li>Evaluación pre-compra de vehículos</li>
                  <li>Verificación de historial y documentación</li>
                  <li>Comparativa de modelos y marcas</li>
                  <li>Negociación y valoración</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value='proceso' className='p-6 border rounded-md mt-2'>
          <div className='grid md:grid-cols-4 gap-6'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-red-600 font-bold text-xl'>1</span>
              </div>
              <h3 className='font-medium mb-2'>Agenda tu Cita</h3>
              <p className='text-sm text-gray-600'>
                Completa el formulario con tus datos y selecciona la fecha y
                hora que mejor te convenga.
              </p>
            </div>
            <div className='text-center'>
              <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-red-600 font-bold text-xl'>2</span>
              </div>
              <h3 className='font-medium mb-2'>Confirmación</h3>
              <p className='text-sm text-gray-600'>
                Recibirás un correo electrónico confirmando tu cita con todos
                los detalles.
              </p>
            </div>
            <div className='text-center'>
              <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-red-600 font-bold text-xl'>3</span>
              </div>
              <h3 className='font-medium mb-2'>Asesoría</h3>
              <p className='text-sm text-gray-600'>
                Nuestro técnico especializado te atenderá en la fecha y hora
                acordada para resolver tus dudas.
              </p>
            </div>
            <div className='text-center'>
              <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-red-600 font-bold text-xl'>4</span>
              </div>
              <h3 className='font-medium mb-2'>Seguimiento</h3>
              <p className='text-sm text-gray-600'>
                Te contactaremos después para asegurarnos de que todas tus dudas
                fueron resueltas.
              </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value='preguntas' className='p-6 border rounded-md mt-2'>
          <div className='space-y-6'>
            <div>
              <h3 className='font-medium mb-2'>
                ¿Cuánto dura una sesión de asesoría técnica?
              </h3>
              <p className='text-gray-600'>
                Las sesiones de asesoría técnica tienen una duración aproximada
                de 45 minutos a 1 hora, dependiendo de la complejidad del caso.
              </p>
            </div>
            <div>
              <h3 className='font-medium mb-2'>
                ¿Necesito llevar mi vehículo para la asesoría?
              </h3>
              <p className='text-gray-600'>
                Para asesorías mecánicas y eléctricas es recomendable traer el
                vehículo. Para asesorías de compra o estéticas, puedes traer
                fotos o documentación.
              </p>
            </div>
            <div>
              <h3 className='font-medium mb-2'>
                ¿Cuál es el costo de la asesoría técnica?
              </h3>
              <p className='text-gray-600'>
                La primera consulta de asesoría tiene un costo de $50. Si
                decides realizar algún servicio con nosotros, este monto se
                descuenta del total.
              </p>
            </div>
            <div>
              <h3 className='font-medium mb-2'>
                ¿Puedo cambiar la fecha de mi cita?
              </h3>
              <p className='text-gray-600'>
                Sí, puedes cambiar la fecha de tu cita hasta 24 horas antes.
                Para hacerlo, contáctanos por teléfono o email.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div id='agendar' className='scroll-mt-20'>
        {submitted ? (
          <div className='max-w-2xl mx-auto'>
            <Alert className='mb-6 border-green-500 text-green-500'>
              <CheckCircle2 className='h-4 w-4' />
              <AlertTitle>¡Cita Agendada!</AlertTitle>
              <AlertDescription>
                Tu cita de asesoría técnica ha sido agendada correctamente.
                Hemos enviado un correo de confirmación a {formData?.email}.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader className='bg-gray-50'>
                <div className='flex items-center gap-2'>
                  <Tool className='h-5 w-5 text-red-600' />
                  <CardTitle>Detalles de tu Asesoría Técnica</CardTitle>
                </div>
              </CardHeader>
              <CardContent className='p-6'>
                <div className='grid md:grid-cols-2 gap-6'>
                  <div>
                    <h3 className='font-medium mb-2'>Información Personal</h3>
                    <div className='space-y-1 text-sm'>
                      <p>
                        <span className='font-medium'>Nombre:</span>{' '}
                        {formData?.nombre}
                      </p>
                      <p>
                        <span className='font-medium'>Email:</span>{' '}
                        {formData?.email}
                      </p>
                      <p>
                        <span className='font-medium'>Teléfono:</span>{' '}
                        {formData?.telefono}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className='font-medium mb-2'>
                      Información del Vehículo
                    </h3>
                    <div className='space-y-1 text-sm'>
                      <p>
                        <span className='font-medium'>Tipo:</span>{' '}
                        {formData?.vehiculo}
                      </p>
                      <p>
                        <span className='font-medium'>Marca:</span>{' '}
                        {formData?.marca}
                      </p>
                      <p>
                        <span className='font-medium'>Modelo:</span>{' '}
                        {formData?.modelo}
                      </p>
                      <p>
                        <span className='font-medium'>Año:</span>{' '}
                        {formData?.anio}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='mt-6'>
                  <h3 className='font-medium mb-2'>Detalles de la Asesoría</h3>
                  <div className='space-y-1 text-sm'>
                    <p>
                      <span className='font-medium'>Tipo de Asesoría:</span>{' '}
                      {formData?.tipoAsesoria === 'mecanica'
                        ? 'Mecánica'
                        : formData?.tipoAsesoria === 'electrica'
                        ? 'Eléctrica'
                        : formData?.tipoAsesoria === 'estetica'
                        ? 'Estética'
                        : 'Asesoría de Compra'}
                    </p>
                    <p>
                      <span className='font-medium'>Fecha:</span>{' '}
                      {formData?.fecha
                        ? format(formData.fecha, 'PPP', { locale: es })
                        : ''}
                    </p>
                    <p>
                      <span className='font-medium'>Horario:</span>{' '}
                      {formData?.horario}
                    </p>
                    <p>
                      <span className='font-medium'>Descripción:</span>{' '}
                      {formData?.descripcion}
                    </p>
                  </div>
                </div>

                <div className='mt-6 p-4 bg-gray-50 rounded-md'>
                  <h3 className='font-medium mb-2'>Información Importante</h3>
                  <ul className='list-disc pl-5 space-y-1 text-sm text-gray-600'>
                    <li>Por favor, llega 10 minutos antes de tu cita.</li>
                    <li>Trae la documentación de tu vehículo.</li>
                    <li>
                      Si necesitas cancelar o reprogramar, hazlo con al menos 24
                      horas de anticipación.
                    </li>
                    <li>
                      Para cualquier duda, contáctanos al +1 (555) 123-4567.
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className='flex justify-center mt-6'>
              <Button onClick={() => setSubmitted(false)} variant='outline'>
                Agendar otra cita
              </Button>
            </div>
          </div>
        ) : (
          <Card className='max-w-2xl mx-auto'>
            <CardHeader>
              <CardTitle>Agenda tu Asesoría Técnica</CardTitle>
              <CardDescription>
                Completa el formulario para agendar una cita con nuestros
                especialistas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-6'
                >
                  <div className='space-y-4'>
                    <h3 className='font-medium'>Información Personal</h3>
                    <div className='grid md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='nombre'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre Completo</FormLabel>
                            <FormControl>
                              <Input placeholder='Juan Pérez' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='telefono'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='+1 (555) 123-4567'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type='email'
                              placeholder='ejemplo@correo.com'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='space-y-4 pt-4 border-t'>
                    <h3 className='font-medium'>Información del Vehículo</h3>
                    <div className='grid md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='vehiculo'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Vehículo</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Seleccione un tipo' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='sedan'>Sedán</SelectItem>
                                <SelectItem value='suv'>SUV</SelectItem>
                                <SelectItem value='pickup'>Pickup</SelectItem>
                                <SelectItem value='deportivo'>
                                  Deportivo
                                </SelectItem>
                                <SelectItem value='otro'>Otro</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='marca'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Marca</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Toyota, Honda, Ford...'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='grid md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='modelo'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Modelo</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Corolla, Civic, Mustang...'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='anio'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Año</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Seleccione un año' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 30 }, (_, i) => (
                                  <SelectItem
                                    key={i}
                                    value={String(new Date().getFullYear() - i)}
                                  >
                                    {new Date().getFullYear() - i}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className='space-y-4 pt-4 border-t'>
                    <h3 className='font-medium'>Detalles de la Asesoría</h3>
                    <FormField
                      control={form.control}
                      name='tipoAsesoria'
                      render={({ field }) => (
                        <FormItem className='space-y-3'>
                          <FormLabel>Tipo de Asesoría</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className='flex flex-col space-y-1'
                            >
                              <FormItem className='flex items-center space-x-3 space-y-0'>
                                <FormControl>
                                  <RadioGroupItem value='mecanica' />
                                </FormControl>
                                <FormLabel className='font-normal'>
                                  Asesoría Mecánica
                                </FormLabel>
                              </FormItem>
                              <FormItem className='flex items-center space-x-3 space-y-0'>
                                <FormControl>
                                  <RadioGroupItem value='electrica' />
                                </FormControl>
                                <FormLabel className='font-normal'>
                                  Asesoría Eléctrica
                                </FormLabel>
                              </FormItem>
                              <FormItem className='flex items-center space-x-3 space-y-0'>
                                <FormControl>
                                  <RadioGroupItem value='estetica' />
                                </FormControl>
                                <FormLabel className='font-normal'>
                                  Asesoría Estética
                                </FormLabel>
                              </FormItem>
                              <FormItem className='flex items-center space-x-3 space-y-0'>
                                <FormControl>
                                  <RadioGroupItem value='compra' />
                                </FormControl>
                                <FormLabel className='font-normal'>
                                  Asesoría de Compra
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className='grid md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='fecha'
                        render={({ field }) => (
                          <FormItem className='flex flex-col'>
                            <FormLabel>Fecha</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={'outline'}
                                    className={`w-full pl-3 text-left font-normal ${
                                      !field.value && 'text-muted-foreground'
                                    }`}
                                  >
                                    {field.value ? (
                                      format(field.value, 'PPP', { locale: es })
                                    ) : (
                                      <span>Seleccione una fecha</span>
                                    )}
                                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className='w-auto p-0'
                                align='start'
                              >
                                <Calendar
                                  mode='single'
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => {
                                    // Deshabilitar fechas pasadas y fines de semana
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    return (
                                      date < today ||
                                      date.getDay() === 0 ||
                                      date.getDay() === 6
                                    );
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='horario'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Horario</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Seleccione un horario' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {horarios.map((horario) => (
                                  <SelectItem key={horario} value={horario}>
                                    {horario}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name='descripcion'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Descripción del Problema o Consulta
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Describa detalladamente su consulta o el problema que presenta su vehículo'
                              className='min-h-[120px]'
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Incluya todos los detalles relevantes para que
                            nuestros técnicos puedan prepararse adecuadamente.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type='submit' className='w-full'>
                    Agendar Asesoría
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
