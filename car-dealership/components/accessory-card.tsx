import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import AddToCartButton from "@/components/add-to-cart-button"

interface AccessoryProps {
  accessory: {
    id: string
    name: string
    price: number
    image: string
    category: string
  }
}

export default function AccessoryCard({ accessory }: AccessoryProps) {
  return (
    <Card>
      <div className="relative h-40 w-full">
        <Image
          src={accessory.image || "/placeholder.svg?height=160&width=240"}
          alt={accessory.name}
          fill
          className="object-contain p-4"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium">{accessory.name}</h3>
        <p className="text-sm text-gray-500">{accessory.category}</p>
        <p className="font-bold mt-2">${accessory.price.toLocaleString()}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <AddToCartButton
          id={accessory.id}
          name={accessory.name}
          price={accessory.price}
          image={accessory.image}
          type="accessory"
          className="w-full"
        />
      </CardFooter>
    </Card>
  )
}
