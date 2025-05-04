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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Clock,
  Settings,
  PenToolIcon as Tool,
  Wrench,
} from 'lucide-react';

export default function ReparacionPage() {
  return (
    <div className='container mx-auto py-10 px-4'>
      <div className='flex flex-col md:flex-row items-center gap-6 mb-10'>
        <div className='flex-1'>
          <h1 className='text-3xl font-bold mb-4'>
            Servicios de Reparación Profesional
          </h1>
          <p className='text-gray-600 mb-6'>
            En AutoRepuestos contamos con técnicos certificados y equipamiento
            de última generación para ofrecer el mejor servicio de reparación
            para tu vehículo. Desde mantenimientos básicos hasta reparaciones
            complejas, estamos aquí para mantener tu auto en óptimas
            condiciones.
          </p>
          <div className='flex flex-wrap gap-4'>
            <Link href='/servicios/asesoria'>
              <Button size='lg' className='bg-red-600 hover:bg-red-700'>
                Agendar Servicio
              </Button>
            </Link>
            <Link href='#servicios'>
              <Button size='lg' variant='outline'>
                Ver Servicios
              </Button>
            </Link>
          </div>
        </div>
        <div className='relative w-full md:w-1/2 h-[300px] rounded-lg overflow-hidden'>
          <Image
            src='/placeholder.svg?height=300&width=500'
            alt='Servicio de Reparación'
            fill
            className='object-cover'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
        <Card className='text-center'>
          <CardHeader>
            <div className='mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 mb-4'>
              <Tool className='h-6 w-6' />
            </div>
            <CardTitle>Técnicos Certificados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-gray-600'>
              Nuestro equipo de técnicos cuenta con certificaciones y años de
              experiencia en todas las marcas y modelos.
            </p>
          </CardContent>
        </Card>
        <Card className='text-center'>
          <CardHeader>
            <div className='mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 mb-4'>
              <Settings className='h-6 w-6' />
            </div>
            <CardTitle>Equipamiento Avanzado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-gray-600'>
              Utilizamos herramientas y equipos de diagnóstico de última
              generación para identificar y solucionar problemas con precisión.
            </p>
          </CardContent>
        </Card>
        <Card className='text-center'>
          <CardHeader>
            <div className='mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 mb-4'>
              <CheckCircle className='h-6 w-6' />
            </div>
            <CardTitle>Garantía en Servicios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-gray-600'>
              Todos nuestros servicios de reparación incluyen garantía,
              asegurando la calidad y durabilidad de nuestro trabajo.
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue='mecanica' className='mb-12' id='servicios'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='mecanica'>Mecánica General</TabsTrigger>
          <TabsTrigger value='electrica'>Sistema Eléctrico</TabsTrigger>
          <TabsTrigger value='especializada'>
            Reparación Especializada
          </TabsTrigger>
        </TabsList>
        <TabsContent value='mecanica' className='p-6 border rounded-md mt-2'>
          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h3 className='text-xl font-bold mb-4'>
                Servicios de Mecánica General
              </h3>
              <p className='text-gray-600 mb-6'>
                Nuestros servicios de mecánica general cubren todas las
                necesidades básicas y avanzadas para mantener tu vehículo
                funcionando de manera óptima.
              </p>
              <ul className='space-y-2'>
                <li className='flex items-start gap-2'>
                  <Wrench className='h-5 w-5 text-red-600 mt-0.5' />
                  <div>
                    <h4 className='font-medium'>Cambio de Aceite y Filtros</h4>
                    <p className='text-sm text-gray-600'>
                      Mantenimiento esencial para prolongar la vida útil del
                      motor.
                    </p>
                  </div>
                </li>
                <li className='flex items-start gap-2'>
                  <Wrench className='h-5 w-5 text-red-600 mt-0.5' />
                  <div>
                    <h4 className='font-medium'>Sistema de Frenos</h4>
                    <p className='text-sm text-gray-600'>
                      Revisión y reemplazo de pastillas, discos, tambores y
                      líquido de frenos.
                    </p>
                  </div>
                </li>
                <li className='flex items-start gap-2'>
                  <Wrench className='h-5 w-5 text-red-600 mt-0.5' />
                  <div>
                    <h4 className='font-medium'>Suspensión y Dirección</h4>
                    <p className='text-sm text-gray-600'>
                      Diagnóstico y reparación de amortiguadores, resortes y
                      componentes de dirección.
                    </p>
                  </div>
                </li>
                <li className='flex items-start gap-2'>
                  <Wrench className='h-5 w-5 text-red-600 mt-0.5' />
                  <div>
                    <h4 className='font-medium'>Sistema de Refrigeración</h4>
                    <p className='text-sm text-gray-600'>
                      Mantenimiento de radiador, termostato y bomba de agua.
                    </p>
                  </div>
                </li>
                <li className='flex items-start gap-2'>
                  <Wrench className='h-5 w-5 text-red-600 mt-0.5' />
                  <div>
                    <h4 className='font-medium'>Transmisión</h4>
                    <p className='text-sm text-gray-600'>
                      Diagnóstico y reparación de transmisiones manuales y
                      automáticas.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className='relative h-[300px] rounded-lg overflow-hidden'>
              <Image
                src='/placeholder.svg?height=300&width=400'
                alt='Mecánica General'
                fill
                className='object-cover'
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value='electrica' className='p-6 border rounded-md mt-2'>
          <div className='grid md:grid-cols-2 gap-6'>
            <div className='relative h-[300px] rounded-lg overflow-hidden'>
              <Image
                src='/placeholder.svg?height=300&width=400'
                alt='Sistema Eléctrico'
                fill
                className='object-cover'
              />
            </div>
            <div>
              <h3 className='text-xl font-bold mb-4'>
                Servicios de Sistema Eléctrico
              </h3>
              <p className='text-gray-600 mb-6'>
                Diagnosticamos y reparamos todo tipo de problemas eléctricos en
                tu vehículo, desde lo más básico hasta sistemas complejos.
              </p>
              <ul className='space-y-2'>
                <li className='flex items-start gap-2'>
                  <Wrench className='h-5 w-5 text-red-600 mt-0.5' />
                  <div>
                    <h4 className='font-medium'>Batería y Sistema de Carga</h4>
                    <p className='text-sm text-gray-600'>
                      Diagnóstico, carga y reemplazo de baterías y alternadores.
                    </p>
                  </div>
                </li>
                <li className='flex items-start gap-2'>
                  <Wrench className='h-5 w-5 text-red-600 mt-0.5' />
                  <div>
                    <h4 className='font-medium'>Sistema de Arranque</h4>
                    <p className='text-sm text-gray-600'>
                      Reparación de motor de arranque y componentes
                      relacionados.
                    </p>
                  </div>
                </li>
                <li className='flex items-start gap-2'>
                  <Wrench className='h-5 w-5 text-red-600 mt-0.5' />
                  <div>
                    <h4 className='font-medium'>Iluminación</h4>
                    <p className='text-sm text-gray-600'>
                      Reparación y reemplazo de faros, luces traseras y sistema
                      eléctrico.
                    </p>
                  </div>
                </li>
                <li className='flex items-start gap-2'>
                  <Wrench className='h-5 w-5 text-red-600 mt-0.5' />
                  <div>
                    <h4 className='font-medium'>Diagnóstico Computarizado</h4>
                    <p className='text-sm text-gray-600'>
                      Lectura y solución de códigos de error en la computadora
                      del vehículo.
                    </p>
                  </div>
                </li>
                <li className='flex items-start gap-2'>
                  <Wrench className='h-5 w-5 text-red-600 mt-0.5' />
                  <div>
                    <h4 className='font-medium'>Sistemas de Confort</h4>
                    <p className='text-sm text-gray-600'>
                      Reparación de aire acondicionado, elevalunas y sistemas de
                      audio.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
        <TabsContent
          value='especializada'
          className='p-6 border rounded-md mt-2'
        >
          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h3 className='text-xl font-bold mb-4'>
                Servicios de Reparación Especializada
              </h3>
              <p className='text-gray-600 mb-6'>
                Contamos con técnicos especializados para reparaciones complejas
                que requieren conocimientos y herramientas específicas.
              </p>
              <ul className='space-y-2'>
                <li className='flex items-start gap-2'>
                  <Wrench className='h-5 w-5 text-red-600 mt-0.5' />
                  <div>
                    <h4 className='font-medium'>Reparación de Motor</h4>
                    <p className='text-sm text-gray-600'>
                      Reconstrucción y reparación completa de motores.
                    </p>
                  </div>
                </li>
                <li className='flex items-start gap-2'>
                  <Wrench className='h-5 w-5 text-red-600 mt-0.5' />
                  <div>
                    <h4 className='font-medium'>Sistemas de Inyección</h4>
                    <p className='text-sm text-gray-600'>
                      Diagnóstico y reparación de sistemas de inyección
                      electrónica.
                    </p>
                  </div>
                </li>
                <li className='flex items-start gap-2'>
                  <Wrench className='h-5 w-5 text-red-600 mt-0.5' />
                  <div>
                    <h4 className='font-medium'>Cajas de Cambio</h4>
                    <p className='text-sm text-gray-600'>
                      Reparación de cajas de cambio manuales y automáticas.
                    </p>
                  </div>
                </li>
                <li className='flex items-start gap-2'>
                  <Wrench className='h-5 w-5 text-red-600 mt-0.5' />
                  <div>
                    <h4 className='font-medium'>Sistemas Híbridos</h4>
                    <p className='text-sm text-gray-600'>
                      Mantenimiento y reparación de vehículos híbridos y
                      eléctricos.
                    </p>
                  </div>
                </li>
                <li className='flex items-start gap-2'>
                  <Wrench className='h-5 w-5 text-red-600 mt-0.5' />
                  <div>
                    <h4 className='font-medium'>Diagnóstico Avanzado</h4>
                    <p className='text-sm text-gray-600'>
                      Solución de problemas complejos mediante equipos de
                      diagnóstico especializados.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className='relative h-[300px] rounded-lg overflow-hidden'>
              <Image
                src='/placeholder.svg?height=300&width=400'
                alt='Reparación Especializada'
                fill
                className='object-cover'
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className='mb-12'>
        <h2 className='text-2xl font-bold mb-6'>
          Nuestro Proceso de Reparación
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <Card>
            <CardHeader>
              <div className='w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-4'>
                <span className='text-red-600 font-bold'>1</span>
              </div>
              <CardTitle>Diagnóstico</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-gray-600'>
                Realizamos un diagnóstico completo para identificar con
                precisión el problema de tu vehículo.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className='w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-4'>
                <span className='text-red-600 font-bold'>2</span>
              </div>
              <CardTitle>Presupuesto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-gray-600'>
                Te presentamos un presupuesto detallado y transparente antes de
                iniciar cualquier trabajo.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className='w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-4'>
                <span className='text-red-600 font-bold'>3</span>
              </div>
              <CardTitle>Reparación</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-gray-600'>
                Nuestros técnicos realizan la reparación utilizando repuestos de
                calidad y siguiendo los procedimientos adecuados.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className='w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-4'>
                <span className='text-red-600 font-bold'>4</span>
              </div>
              <CardTitle>Control de Calidad</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-gray-600'>
                Verificamos que todo funcione correctamente antes de entregar tu
                vehículo, garantizando la calidad del servicio.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
