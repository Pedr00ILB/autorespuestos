'use client';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('../../components/Scene'), { ssr: false });

export default function CarPage() {
  return (
    <div className='flex items-center justify-center w-screen h-screen bg-gray-100'>
      {/* Contenedor 16:9 responsive */}
      <div className='w-11/12 max-w-5xl aspect-video rounded-xl overflow-hidden  bg-white'>
        <Scene />
      </div>
    </div>
  );
}
