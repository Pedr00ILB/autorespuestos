'use client';

import Scene from './Scene';
import { useRef, useEffect, useState } from 'react';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    const scene = sceneRef.current;
    
    if (!video || !container || !scene) return;

    const updateHeight = () => {
      const videoHeight = video.videoHeight;
      const videoWidth = video.videoWidth;
      const containerWidth = container.offsetWidth;
      const aspectRatio = videoHeight / videoWidth;
      const newHeight = containerWidth * aspectRatio;
      
      container.style.height = `${newHeight}px`;
      scene.style.height = `${newHeight}px`;
      
      // Ajuste para que ocupe todo el ancho de la ventana
      if (isInitialLoad) {
        container.style.width = '100%';
        container.style.margin = '0';
        container.style.maxWidth = '100%';
        container.style.position = 'relative';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        setIsInitialLoad(false);
        // Actualizar altura con el nuevo ancho
        requestAnimationFrame(updateHeight);
      }
    };

    // Actualizar cuando el video cargue
    video.addEventListener('loadedmetadata', updateHeight);
    // Actualizar cuando la ventana cambie de tamaño
    window.addEventListener('resize', updateHeight);

    // Llamar a updateHeight inicialmente
    updateHeight();

    // Asegurar que el video se reproduzca
    video.play().catch(console.error);

    return () => {
      video.removeEventListener('loadedmetadata', updateHeight);
      window.removeEventListener('resize', updateHeight);
    };
  }, [isInitialLoad]);

  return (
    <div
      ref={containerRef}
      className='relative w-full mx-auto max-w-6xl'
    >
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        muted
        loop
        playsInline
        autoPlay
        src="/Fondo hero.webm"
      />
      <div 
        ref={sceneRef}
        className='absolute top-0 left-0 w-full h-full z-10'
      >
        <Scene />
      </div>
    </div>
  );
}