// components/Car.tsx
'use client';

import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useFrame } from '@react-three/fiber';
import { MutableRefObject, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import Image from 'next/image';
import Link from 'next/link';

interface CarProps {
  mouseX: MutableRefObject<number>;
}

export default function CarSteeringAllWheels({ mouseX }: CarProps) {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const wheelsRef = useRef<THREE.Mesh[]>([]);
  const isLoading = useRef(false);

  // Memoizar la función de recorrido de la escena
  const traverseScene = useCallback(() => {
    if (!sceneRef.current) return;
    sceneRef.current.traverse(obj => {
      if ((obj as any).isMesh) {
        const m = obj as THREE.Mesh;
        if (m.name.toLowerCase().includes('wheel')) {
          wheelsRef.current.push(m);
        }
      }
    });
  }, []);

  // Cargar el modelo 3D
  const { scene } = useLoader(GLTFLoader, '/koennisegg.glb');

  // Efecto de detección de ruedas
  useEffect(() => {
    if (!scene) return;
    sceneRef.current = scene;
    wheelsRef.current = [];
    traverseScene();
  }, [scene, traverseScene]);

  // Efecto de rotación
  useFrame((_, delta) => {
    if (!sceneRef.current) return;
    const maxAngle = Math.PI / 6;
    const targetAngle = mouseX.current * maxAngle;
    
    if (wheelsRef.current.length > 0) {
      wheelsRef.current.forEach(wheel => {
        if (wheel) {
          wheel.rotation.y = THREE.MathUtils.damp(
            wheel.rotation.y,
            targetAngle,
            4,
            delta
          );
        }
      });
    }
  }, [wheelsRef, sceneRef]);

  return scene ? (
    <primitive object={scene} dispose={null} />
  ) : (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}
