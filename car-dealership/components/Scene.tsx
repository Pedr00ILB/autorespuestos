// components/Scene.tsx
'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  OrbitControls,
  Loader,
  Html,
  PerspectiveCamera,
  Stage,
} from '@react-three/drei';
import { ErrorBoundary } from 'react-error-boundary';

const CarEmbedded = dynamic(() => import('./Car'), { ssr: false });

function ErrorFallback({ error }: { error: Error }) {
  return (
    <Html center style={{ color: 'red', fontSize: '1.25rem' }}>
      <div>😞 Oops, algo salió mal:</div>
      <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
    </Html>
  );
}

// Component que fija la cámara en su posición inicial
function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(5, 1, 10); // más abajo en Y (1 en lugar de 2)
    camera.lookAt(0, 0.5, 0);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

export default function Scene() {
  const mouseX = useRef(0);
  const onPointerMove = (e: React.PointerEvent) =>
    (mouseX.current = (e.clientX / window.innerWidth) * 2 - 1);

  return (
    <div onPointerMove={onPointerMove} className='w-full h-full relative'>
      <Canvas shadows>
        {/* Cámara */}
        <PerspectiveCamera makeDefault fov={30} />
        <CameraSetup />

        {/* Stage para iluminación y environment (sin ajustar cámara) */}
        <Suspense fallback={null}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Stage
              environment='city'
              intensity={0.7}
              shadows={{ type: 'contact', opacity: 0.4, blur: 2 }}
              adjustCamera={false} // evita el “auto‐frame” de Stage
            >
              {/* Bajar el coche 0.3 unidades en Y y girarlo -15° en Y */}
              <group position={[0, -0.3, 0]} rotation={[0, -Math.PI / 12, 0]}>
                <CarEmbedded mouseX={mouseX} />
              </group>
            </Stage>
          </ErrorBoundary>
        </Suspense>

        {/* Controles sin zoom ni paneo */}
        <OrbitControls enablePan={false} enableZoom={false} maxZoom={2} />
      </Canvas>

      {/* Loader de progreso */}
      <Loader
        containerStyles={{ zIndex: 100 }}
        barStyles={{ background: '#111' }}
        dataStyles={{ color: '#111' }}
      />
    </div>
  );
}
