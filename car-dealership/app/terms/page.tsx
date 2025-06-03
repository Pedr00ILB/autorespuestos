import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center py-8">
            <CardTitle className="text-3xl font-bold">Términos y Condiciones</CardTitle>
            <p className="text-muted-foreground mt-2">
              Última actualización: {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6 pb-8 px-8">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Aceptación de los Términos</h2>
              <p className="text-muted-foreground">
                Al acceder y utilizar el sitio web de Car Dealership, usted acepta cumplir con estos términos y condiciones de uso, 
                todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes locales aplicables. 
                Si no está de acuerdo con alguno de estos términos, tiene prohibido usar o acceder a este sitio.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">2. Uso de la Licencia</h2>
              <p className="text-muted-foreground">
                Se concede permiso para descargar temporalmente una copia de los materiales en el sitio web de Car Dealership 
                solo para visualización transitoria personal y no comercial. Esta es la concesión de una licencia, no una 
                transferencia de título, y bajo esta licencia no puede:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Modificar o copiar los materiales;</li>
                <li>Usar los materiales para ningún propósito comercial o para exhibición pública;</li>
                <li>Intentar descompilar o realizar ingeniería inversa en cualquier software contenido en el sitio web de Car Dealership;</li>
                <li>Eliminar cualquier derecho de autor u otras anotaciones de propiedad de los materiales; o</li>
                <li>Transferir los materiales a otra persona o "reflejar" los materiales en cualquier otro servidor.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">3. Privacidad</h2>
              <p className="text-muted-foreground">
                Su uso del sitio web de Car Dealership también está regido por nuestra 
                <Link href="/privacy" className="text-primary hover:underline ml-1">
                  Política de Privacidad
                </Link>. 
                Por favor, revise nuestra Política de Privacidad, que también rige el sitio e informa a los usuarios de nuestras 
                prácticas de recopilación de datos.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">4. Limitaciones</h2>
              <p className="text-muted-foreground">
                En ningún caso Car Dealership o sus proveedores serán responsables por ningún daño (incluyendo, sin limitación, 
                daños por pérdida de datos o beneficio, o debido a la interrupción del negocio) que surjan del uso o de la 
                imposibilidad de utilizar los materiales en el sitio web de Car Dealership, incluso si Car Dealership o un 
                representante autorizado de Car Dealership ha sido notificado oralmente o por escrito de la posibilidad de tales daños.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">5. Precisión de los Materiales</h2>
              <p className="text-muted-foreground">
                Los materiales que aparecen en el sitio web de Car Dealership podrían incluir errores técnicos, tipográficos o 
                fotográficos. Car Dealership no garantiza que ninguno de los materiales en su sitio web sea preciso, completo o actual. 
                Car Dealership puede realizar cambios en los materiales contenidos en su sitio web en cualquier momento sin previo aviso. 
                Sin embargo, Car Dealership no se compromete a actualizar los materiales.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">6. Enlaces</h2>
              <p className="text-muted-foreground">
                Car Dealership no ha revisado todos los sitios vinculados a su sitio web y no es responsable del contenido de dichos 
                sitios vinculados. La inclusión de cualquier enlace no implica la aprobación por parte de Car Dealership del sitio. 
                El uso de cualquier sitio web vinculado es bajo el propio riesgo del usuario.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">7. Modificaciones</h2>
              <p className="text-muted-foreground">
                Car Dealership puede revisar estos términos de servicio para su sitio web en cualquier momento sin previo aviso. 
                Al utilizar este sitio web, usted acepta estar sujeto a la versión actual de estos términos y condiciones de uso.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">8. Ley Aplicable</h2>
              <p className="text-muted-foreground">
                Estos términos y condiciones se rigen e interpretan de acuerdo con las leyes de España y usted se somete irrevocablemente 
                a la jurisdicción exclusiva de los tribunales en ese país o ubicación.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
