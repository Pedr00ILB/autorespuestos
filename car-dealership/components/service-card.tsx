import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ServiceProps {
  service: {
    id: string     // debe coincidir con el nombre de la carpeta: "asesoria", "piezas" o "reparacion"
    title: string
    description: string
    icon: React.ReactNode
  }
}

export default function ServiceCard({ service }: ServiceProps) {
  // Ajusta la ruta a /servicios/[id]
  const href = `/servicios/${service.id}`

  return (
    <Card className="text-center">
      <CardHeader>
        <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          {service.icon}
        </div>
        <CardTitle>{service.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">{service.description}</CardDescription>
        <Button asChild variant="outline">
          <Link href={href}>Más información</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
