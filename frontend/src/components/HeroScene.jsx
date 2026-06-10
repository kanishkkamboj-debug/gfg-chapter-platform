import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float, MeshDistortMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import * as THREE from 'three';

const ParticleField = (props) => {
  const ref = useRef();
  
  const sphere = useMemo(() => {
    return random.inSphere(new Float32Array(3000 * 3), { radius: 2 });
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#00FF88"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
};

const FloatingGeometry = () => {
  return (
    <group>
      {/* Center glowing sphere */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 64, 64]} />
          <MeshDistortMaterial
            color="#00FF88"
            emissive="#00FF88"
            emissiveIntensity={2}
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            wireframe
          />
        </mesh>
      </Float>

      {/* Orbiting elements */}
      <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
        <mesh position={[1.5, 1, -1]}>
          <icosahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial
            color="#00D4FF"
            emissive="#00D4FF"
            emissiveIntensity={0.5}
            wireframe
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1.5}>
        <mesh position={[-1.2, -0.8, -0.5]}>
          <torusGeometry args={[0.2, 0.05, 16, 32]} />
          <meshStandardMaterial
            color="#2F8D46"
            emissive="#2F8D46"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={2.5} floatIntensity={1.8}>
        <mesh position={[0.8, -1.2, 0.5]}>
          <octahedronGeometry args={[0.25, 0]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#FFFFFF"
            emissiveIntensity={0.2}
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
      </Float>
    </group>
  );
};

const MouseParallax = ({ children }) => {
  const group = useRef();
  const { mouse } = useThree();

  useFrame(() => {
    if (group.current) {
      // Smooth interpolation towards mouse position
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, (mouse.x * 0.5), 0.05);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, (mouse.y * 0.5), 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, (mouse.y * 0.2), 0.05);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, (mouse.x * 0.2), 0.05);
    }
  });

  return <group ref={group}>{children}</group>;
};

const HeroScene = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} color="#00FF88" intensity={1} />
          <pointLight position={[-10, -10, -10]} color="#00D4FF" intensity={0.5} />
          
          <MouseParallax>
            <ParticleField />
            <FloatingGeometry />
          </MouseParallax>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene;
