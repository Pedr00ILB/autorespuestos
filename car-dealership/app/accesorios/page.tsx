import { accessories } from "@/lib/data"
import AccessoryCard from "@/components/accessory-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"

// Categorías de accesorios
const categories = ["Todos", "Interior", "Exterior", "Electrónica", "Rendimiento", "Seguridad"]

// Accesorios adicionales para tener más ejemplos
const moreAccessories = [
  {
    id: "5",
    name: "Organizador de Maletero",
    price: 45,
    image: "/placeholder.svg?height=160&width=240",
    category: "Interior",
  },
  {
    id: "6",
    name: "Cargador Inalámbrico",
    price: 65,
    image: "/placeholder.svg?height=160&width=240",
    category: "Electrónica",
  },
  {
    id: "7",
    name: "Luces LED Ambientales",
    price: 35,
    image: "/placeholder.svg?height=160&width=240",
    category: "Interior",
  },
  {
    id: "8",
    name: "Sensores de Estacionamiento",
    price: 120,
    image: "/placeholder.svg?height=160&width=240",
    category: "Seguridad",
  },
  {
    id: "9",
    name: "Deflectores de Ventana",
    price: 55,
    image: "/placeholder.svg?height=160&width=240",
    category: "Exterior",
  },
  {
    id: "10",
    name: "Kit de Admisión de Aire",
    price: 180,
    image: "/placeholder.svg?height=160&width=240",
    category: "Rendimiento",
  },
  {
    id: "11",
    name: "Cámara de Retroceso",
    price: 150,
    image: "/placeholder.svg?height=160&width=240",
    category: "Seguridad",
  },
  {
    id: "12",
    name: "Fundas para Asientos",
    price: 95,
    image: "/placeholder.svg?height=160&width=240",
    category: "Interior",
  },
]

// Combinar los accesorios originales con los adicionales
const allAccessories = [...accessories, ...moreAccessories]

export default function AccesoriosPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Accesorios para Vehículos</h1>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full md:w-auto md:flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input placeholder="Buscar accesorios..." className="pl-9" />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
              <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
              <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
              <SelectItem value="name-desc">Nombre: Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="Todos" className="mb-8">
        <TabsList className="flex flex-wrap h-auto">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="mb-1">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="Todos" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allAccessories.map((accessory) => (
              <div key={`${accessory.id}-${accessory.name}-${accessory.category}`} className="h-full">
                <AccessoryCard accessory={accessory} />
              </div>
            ))}
          </div>
        </TabsContent>

        {categories.slice(1).map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {allAccessories
                .filter((accessory) => accessory.category === category)
                .map((accessory) => (
                  <div key={`${accessory.id}-${accessory.name}-${accessory.category}`} className="h-full">
                    <AccessoryCard accessory={accessory} />
                  </div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-center gap-2">
        <Button variant="outline" size="sm" disabled>
          Anterior
        </Button>
        <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
        <Button variant="outline" size="sm">
          Siguiente
        </Button>
      </div>
    </div>
  )
}
