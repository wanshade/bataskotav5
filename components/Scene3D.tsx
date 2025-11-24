"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  PerspectiveCamera,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

const Football = (props: any) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x =
        Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3;
    }
  });

  return (
    <group ref={meshRef} {...props}>
      <Float speed={4} rotationIntensity={1} floatIntensity={2}>
        {/* Main Ball Body - Neon/Cyberpunk Style */}
        <mesh castShadow receiveShadow>
          <icosahedronGeometry args={[2, 1]} />
          <meshStandardMaterial
            color="#39ff14"
            emissive="#1a0033"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
            flatShading={true}
          />
        </mesh>

        {/* Neon Wireframe Glow */}
        <mesh>
          <icosahedronGeometry args={[2.05, 1]} />
          <meshBasicMaterial
            color="#00f3ff"
            wireframe
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Inner Glow Core */}
        <pointLight distance={3} intensity={2} color="#00f3ff" />
      </Float>
    </group>
  );
};

const Scene3D = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />

        {/* Lighting - Cyberpunk/Neon Setup */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00f3ff" />
        <pointLight position={[-10, -5, -10]} intensity={2} color="#ff00ff" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          color="#7000ff"
        />

        {/* Particles - Neon Energy */}
        <Sparkles
          count={50}
          scale={10}
          size={4}
          speed={0.4}
          opacity={0.8}
          color="#00f3ff"
        />

        {/* The Football */}
        <Football position={[3, 0, 0]} />

        {/* Environment Reflection */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default Scene3D;
