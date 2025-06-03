import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center py-8">
            <CardTitle className="text-3xl font-bold">Política de Privacidad</CardTitle>
            <p className="text-muted-foreground mt-2">
              Última actualización: {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6 pb-8 px-8">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Introducción</h2>
              <p className="text-muted-foreground">
                En Car Dealership, valoramos su privacidad y nos comprometemos a proteger su información personal. 
                Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información 
                cuando utiliza nuestro sitio web y servicios.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">2. Información que Recopilamos</h2>
              <p className="text-muted-foreground">
                Podemos recopilar varios tipos de información de y sobre los usuarios de nuestro sitio web, incluyendo:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Información de contacto (nombre, dirección de correo electrónico, número de teléfono)</li>
                <li>Información de la cuenta (nombre de usuario, contraseña, perfil)</li>
                <li>Información de transacciones (historial de compras, métodos de pago)</li>
                <li>Información de navegación (dirección IP, tipo de navegador, páginas visitadas)</li>
                <li>Cualquier otra información que elija proporcionar</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">3. Cómo Usamos su Información</h2>
              <p className="text-muted-foreground">
                Utilizamos la información que recopilamos para diversos fines, incluidos:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Proporcionar, operar y mantener nuestro sitio web</li>
                <li>Mejorar, personalizar y expandir nuestro sitio web</li>
                <li>Comprender y analizar cómo utiliza nuestro sitio web</li>
                <li>Desarrollar nuevos productos, servicios, características y funcionalidades</li>
                <li>Comunicarnos con usted, ya sea directamente o a través de uno de nuestros socios</li>
                <li>Enviarle correos electrónicos</li>
                <li>Encontrar y prevenir el fraude</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">4. Compartir su Información</h2>
              <p className="text-muted-foreground">
                Podemos compartir su información personal en las siguientes situaciones:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Con proveedores de servicios para monitorear y analizar el uso de nuestro sitio web</li>
                <li>Para el cumplimiento de la ley, para hacer cumplir nuestras políticas o para proteger nuestros derechos</li>
                <li>Con su consentimiento para cualquier otro propósito</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">5. Cookies y Tecnologías Similares</h2>
              <p className="text-muted-foreground">
                Utilizamos cookies y tecnologías de seguimiento similares para rastrear la actividad en nuestro sitio web y 
                almacenar cierta información. Las cookies son archivos con una pequeña cantidad de datos que pueden incluir 
                un identificador único anónimo. Puede configurar su navegador para que rechace todas las cookies o para 
                indicar cuándo se está enviando una cookie.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">6. Seguridad de su Información</h2>
              <p className="text-muted-foreground">
                La seguridad de sus datos es importante para nosotros, pero recuerde que ningún método de transmisión por 
                Internet o método de almacenamiento electrónico es 100% seguro. Si bien nos esforzamos por utilizar medios 
                comercialmente aceptables para proteger su información personal, no podemos garantizar su seguridad absoluta.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">7. Sus Derechos de Protección de Datos</h2>
              <p className="text-muted-foreground">
                Dependiendo de su ubicación, puede tener ciertos derechos con respecto a su información personal, que incluyen:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>El derecho a acceder, actualizar o eliminar la información que tenemos sobre usted</li>
                <li>El derecho de rectificación</li>
                <li>El derecho a oponerse</li>
                <li>El derecho a la portabilidad de los datos</li>
                <li>El derecho a retirar el consentimiento</li>
              </ul>
              <p className="text-muted-foreground">
                Para ejercer cualquiera de estos derechos, por favor contáctenos utilizando la información proporcionada a continuación.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">8. Cambios a esta Política de Privacidad</h2>
              <p className="text-muted-foreground">
                Podemos actualizar nuestra Política de Privacidad periódicamente. Le notificaremos de cualquier cambio publicando 
                la nueva Política de Privacidad en esta página y actualizando la fecha de "Última actualización" en la parte superior.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">9. Contáctenos</h2>
              <p className="text-muted-foreground">
                Si tiene alguna pregunta sobre esta Política de Privacidad, puede contactarnos:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Por correo electrónico: privacidad@cardealership.com</li>
                <li>Por teléfono: +34 123 456 789</li>
                <li>Por correo: Calle Falsa 123, 28001 Madrid, España</li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
