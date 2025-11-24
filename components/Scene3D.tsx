'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PerspectiveCamera, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const Football = (props: any) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <group ref={meshRef} {...props}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Main Ball Body - Realistic Style */}
        <mesh castShadow receiveShadow>
          <icosahedronGeometry args={[2, 1]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.4}
            metalness={0.1}
            flatShading={true}
          />
        </mesh>
        
        {/* Subtle Panel Outlines (simulated with slight wireframe scale) */}
        <mesh>
          <icosahedronGeometry args={[2.01, 1]} />
          <meshStandardMaterial
            color="#1a1a1a"
            wireframe
            transparent
            opacity={0.1}
          />
        </mesh>
      </Float>
    </group>
  );
};

const Scene3D = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        
        {/* Lighting - Natural Studio Setup */}
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1.5}
          color="#ffffff"
          castShadow
        />
        <pointLight position={[-10, -5, -10]} intensity={0.5} color="#ffffff" />
        <directionalLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" />

        {/* Particles - Subtle Dust */}
        <Sparkles 
          count={30} 
          scale={10} 
          size={2} 
          speed={0.2} 
          opacity={0.3}
          color="#ffffff" 
        />

        {/* The Football */}
        <Football position={[3, 0, 0]} />
        
        {/* Environment Reflection */}
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
};

export default Scene3D;
