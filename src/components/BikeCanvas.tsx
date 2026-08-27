'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import BikeModel from './BikeModel';

export default function BikeCanvas() {
  return (
    <div className="w-full h-full relative" style={{ width: '100%', height: '100%' }}>
      <Canvas
        shadows
        camera={{ position: [3, 1.6, 3.2], fov: 40 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        {/* Pitch black background matching UI mock */}
        <color attach="background" args={['#0a0a0c']} />
        
        {/* Ambient fill lighting */}
        <ambientLight intensity={0.4} />
        
        {/* Main studio spotlight for casting shadows */}
        <directionalLight
          position={[6, 8, 4]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        
        {/* Back fill light for rim reflections */}
        <directionalLight
          position={[-6, 5, -4]}
          intensity={0.7}
        />
        
        {/* Underbelly soft lighting */}
        <pointLight position={[0, -0.2, 0]} intensity={0.3} />

        <Suspense fallback={null}>
          <BikeModel />
          
          {/* Realistic outdoor environment reflection mappings */}
          <Environment preset="sunset" />
          
          {/* Shadow dropped onto the plinth */}
          <ContactShadows
            position={[0, -0.49, 0]}
            opacity={0.8}
            scale={4.5}
            blur={2.2}
            far={1.2}
          />
        </Suspense>

        {/* Orbit Controls to inspect bike */}
        <OrbitControls
          makeDefault
          enablePan={true}
          enableZoom={true}
          minDistance={1.6}
          maxDistance={6}
          maxPolarAngle={Math.PI / 2 - 0.05} // Constrain camera so it doesn't go below floor plinth
        />
      </Canvas>
    </div>
  );
}
