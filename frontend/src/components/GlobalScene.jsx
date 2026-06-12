import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const colorA = new THREE.Color('#00FF88');
const colorB = new THREE.Color('#00D4FF');
const tempColor = new THREE.Color();

const NeuralNetwork = () => {
  const linesRef = useRef();
  const particlesRef = useRef();
  const { mouse, viewport } = useThree();

  const particleCount = 100; // Reduced from 150 for better performance
  const maxDistance = 2.5;
  const maxDistanceSq = maxDistance * maxDistance;

  // Generate random positions and velocities
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = [];
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20; // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5; // z
      
      vel.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        )
      );
    }
    return [pos, vel];
  }, []);

  // Pre-allocate memory for lines
  const maxLines = (particleCount * (particleCount - 1)) / 2;
  const linePositions = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);
  const lineColors = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);

  useFrame(() => {
    if (!particlesRef.current || !linesRef.current) return;

    // Parallax effect with mouse
    particlesRef.current.rotation.y = THREE.MathUtils.lerp(particlesRef.current.rotation.y, (mouse.x * Math.PI) / 10, 0.05);
    particlesRef.current.rotation.x = THREE.MathUtils.lerp(particlesRef.current.rotation.x, (mouse.y * Math.PI) / 10, 0.05);
    linesRef.current.rotation.y = particlesRef.current.rotation.y;
    linesRef.current.rotation.x = particlesRef.current.rotation.x;

    // Update positions
    for (let i = 0; i < particleCount; i++) {
      let x = positions[i * 3];
      let y = positions[i * 3 + 1];
      let z = positions[i * 3 + 2];
      const v = velocities[i];

      x += v.x;
      y += v.y;
      z += v.z;

      // Bounce off boundaries
      if (x > 10 || x < -10) v.x *= -1;
      if (y > 10 || y < -10) v.y *= -1;
      if (z > 5 || z < -15) v.z *= -1;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;

    // Update lines connecting nearby particles
    let lineIdx = 0;
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < maxDistanceSq) {
          linePositions[lineIdx * 6] = positions[i * 3];
          linePositions[lineIdx * 6 + 1] = positions[i * 3 + 1];
          linePositions[lineIdx * 6 + 2] = positions[i * 3 + 2];
          linePositions[lineIdx * 6 + 3] = positions[j * 3];
          linePositions[lineIdx * 6 + 4] = positions[j * 3 + 1];
          linePositions[lineIdx * 6 + 5] = positions[j * 3 + 2];

          // Use distance ratio for a smooth color transition instead of creating new Color objects per frame
          const ratio = distSq / maxDistanceSq;
          tempColor.copy(colorA).lerp(colorB, ratio);
          
          lineColors[lineIdx * 6] = tempColor.r;
          lineColors[lineIdx * 6 + 1] = tempColor.g;
          lineColors[lineIdx * 6 + 2] = tempColor.b;
          lineColors[lineIdx * 6 + 3] = tempColor.r;
          lineColors[lineIdx * 6 + 4] = tempColor.g;
          lineColors[lineIdx * 6 + 5] = tempColor.b;

          lineIdx++;
        }
      }
    }

    linesRef.current.geometry.setDrawRange(0, lineIdx * 2);
    linesRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.08} 
          color="#00FF88" 
          transparent 
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={maxLines * 2}
            array={linePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={maxLines * 2}
            array={lineColors}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          vertexColors 
          transparent 
          opacity={0.3} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </>
  );
};

export default function GlobalScene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-background-base">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 1.5]}>
        <color attach="background" args={['#060c09']} />
        
        {/* Core lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00FF88" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00D4FF" />

        {/* Floating Neural Network System */}
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={2}>
          <NeuralNetwork />
        </Float>
      </Canvas>
    </div>
  );
}
