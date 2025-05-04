// components/CarSteeringAllWheels.tsx
'use client';

import { useGLTF }        from '@react-three/drei';
import { useFrame }       from '@react-three/fiber';
import { MutableRefObject, useRef, useEffect } from 'react';
import * as THREE         from 'three';

type CarProps = { mouseX: MutableRefObject<number> };

export default function CarSteeringAllWheels({ mouseX }: CarProps) {
  // 1) Carga tu GLB embebido
  const { scene } = useGLTF('/koennisegg.glb') as any;
  useGLTF.preload('/koennisegg.glb');

  // 2) Debug: lista todos los meshes
  useEffect(() => {
    console.log('--- Listado de meshes en la escena ---');
    scene.traverse(obj => {
      if ((obj as any).isMesh) {
        const m = obj as THREE.Mesh;
        console.log(
          'Mesh:',    m.name || '(sin nombre)',
          '| Mat:',   ((m.material as any).name) || '(sin nombre)',
          '| Pos:',   m.position.toArray().map(v => v.toFixed(2)).join(', ')
        );
      }
    });
    console.log('--- Fin del listado ---');
  }, [scene]);

  // 3) Captura **todas** las ruedas en un array
  const wheels = useRef<THREE.Mesh[]>([]);
  useEffect(() => {
    wheels.current = [];
    scene.traverse(obj => {
      if ((obj as any).isMesh) {
        const m = obj as THREE.Mesh;
        if (m.name.toLowerCase().includes('wheel')) {
          wheels.current.push(m);
        }
      }
    });
    console.log('Ruedas detectadas:', wheels.current.map(w => w.name));
  }, [scene]);

  // 4) En cada frame aplicamos damping para girarlas suavemente en Y
  useFrame((_, delta) => {
    const maxAngle    = Math.PI / 6;               // ±30°
    const targetAngle = mouseX.current * maxAngle; // de –30° a +30°
    wheels.current.forEach(wheel => {
      wheel.rotation.y = THREE.MathUtils.damp(
        wheel.rotation.y,   // rotación actual
        targetAngle,        // rotación deseada
        4,                  // damping factor (prueba 2–8)
        delta               // delta time
      );
    });
  });

  // 5) Renderiza todo el modelo de golpe
  return <primitive object={scene} dispose={null} />;
}
