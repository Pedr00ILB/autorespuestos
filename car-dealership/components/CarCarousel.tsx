'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface CarCarouselProps {
  images: string[];
}

export default function CarCarousel({ images }: CarCarouselProps) {
  const [currentImage, setCurrentImage] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
        <div className="flex items-center justify-center h-full text-gray-500">
          Sin imágenes disponibles
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
      <Image
        src={images[currentImage]}
        alt={`Imagen ${currentImage + 1}`}
        fill
        className="object-cover"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrentImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-2 h-2 rounded-full border-2 ${
                currentImage === index
                  ? 'border-primary bg-primary/20'
                  : 'border-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
