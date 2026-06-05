import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '../stores/scrollStore';

// ── Inline shaders ──

const vertexShader = `
uniform float uProgress;
uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;

attribute vec3 positionA;
attribute vec3 positionB;
attribute vec3 positionC;

varying vec3 vPosition;
varying float vAlpha;

void main() {
  vec3 pos;
  
  // On applique la même rotation que celle calculée en JS pour la sphère de base
  float c = cos(uTime * 0.3);
  float s = sin(uTime * 0.3);
  
  vec3 rotatedB = positionB;
  rotatedB.x = positionB.x * c - positionB.z * s;
  rotatedB.z = positionB.x * s + positionB.z * c;

  vec3 rotatedC = positionC;
  rotatedC.x = positionC.x * c - positionC.z * s;
  rotatedC.z = positionC.x * s + positionC.z * c;
  
  if (uProgress < 0.5) {
    float t = smoothstep(0.0, 0.5, uProgress);
    pos = mix(positionA, rotatedB, t);
  } else {
    float t = smoothstep(0.5, 1.0, uProgress);
    pos = mix(rotatedB, rotatedC, t);
  }
  
  vPosition = pos;
  float dist = length(pos);
  vAlpha = smoothstep(12.0, 0.0, dist) * 0.9 + 0.1;
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = uSize * uPixelRatio * (1.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
uniform float uProgress;
uniform float uTime;

varying vec3 vPosition;
varying float vAlpha;

void main() {
  float distToCenter = length(gl_PointCoord - vec2(0.5));
  if (distToCenter > 0.5) discard;
  
  float strength = 1.0 - smoothstep(0.15, 0.5, distToCenter);
  
  vec3 colorA = vec3(1.0, 1.0, 1.0);
  vec3 colorB = vec3(0.65, 0.68, 1.0);
  vec3 colorC = vec3(1.0, 0.95, 0.9);
  
  vec3 color;
  if (uProgress < 0.5) {
    float t = smoothstep(0.0, 0.5, uProgress);
    color = mix(colorA, colorB, t);
  } else {
    float t = smoothstep(0.5, 1.0, uProgress);
    color = mix(colorB, colorC, t);
  }
  
  float shimmer = sin(vPosition.x * 10.0 + uTime) * 0.05 + 0.95;
  
  gl_FragColor = vec4(color * shimmer, strength * vAlpha);
}
`;

// ── Shape generators ──

function generateSphere(count, radius) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }
  return positions;
}

function generateHelix(count, radius, height, turns) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const angle = t * Math.PI * 2 * turns;
    const strand = i % 2 === 0 ? 1 : -1;
    const r = radius * (0.7 + Math.random() * 0.3);
    positions[i * 3] = Math.cos(angle) * r * strand;
    positions[i * 3 + 1] = (t - 0.5) * height + (Math.random() - 0.5) * 0.2;
    positions[i * 3 + 2] = Math.sin(angle) * r;
  }
  return positions;
}

function generateColumns(count, spread) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const x = side * (spread * 1.5 + Math.random() * spread * 0.5);
    const y = (Math.random() - 0.5) * spread * 2.5;
    const z = (Math.random() - 0.5) * spread;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
}

// ── Particle system component ──

function ParticleField({ pointCount = 2500, radius = 3.5 }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const posARef = useRef();
  const targetActive = useRef(0);

  const progress = useScrollStore((state) => state.progress);
  const mousePos = useScrollStore((state) => state.mousePos);

  const { basePosA, posB, posC } = useMemo(() => ({
    basePosA: generateSphere(pointCount, radius),
    posB: generateHelix(pointCount, radius * 0.8, radius * 2.5, 4),
    posC: generateColumns(pointCount, radius * 1.2),
  }), [pointCount, radius]);

  const { currentPosA, velocities, randomSpeeds } = useMemo(() => {
    const current = new Float32Array(basePosA);
    const vel = new Float32Array(pointCount * 3);
    const speeds = new Float32Array(pointCount);
    for (let i = 0; i < pointCount; i++) {
      // Vitesses très disparates pour que chaque particule ait sa propre "volonté"
      speeds[i] = 0.01 + Math.random() * 0.06;
    }
    return { currentPosA: current, velocities: vel, randomSpeeds: speeds };
  }, [basePosA, pointCount]);


  const uniforms = useMemo(() => ({
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 24.0 },
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uProgress.value = progress;
    }
    
    // Au lieu de tourner le mesh (ce qui inversait les axes X/Y de la souris),
    // on va calculer la rotation de la sphère directement dans la physique.
    if (meshRef.current) {
      meshRef.current.rotation.y = 0; 
      meshRef.current.rotation.x = 0;
    }

    if (progress < 0.8) {
      const distFromCenter = Math.sqrt(mousePos.x * mousePos.x + mousePos.y * mousePos.y);
      const isMouseActive = distFromCenter < 0.65 ? 1.0 : 0.0;
      targetActive.current += (isMouseActive - targetActive.current) * 0.08;

      const mouseX = mousePos.x * 6.0;
      const mouseY = mousePos.y * 6.0;
      
      const time = state.clock.elapsedTime;
      const cosT = Math.cos(time * 0.3); // Vitesse de rotation de la sphère de base
      const sinT = Math.sin(time * 0.3);

      for (let i = 0; i < pointCount; i++) {
        const i3 = i * 3;
        
        const cx = currentPosA[i3];
        const cy = currentPosA[i3 + 1];
        const cz = currentPosA[i3 + 2];

        // Rotation manuelle de la sphère pour qu'elle tourne sur elle-même
        const bx0 = basePosA[i3];
        const by0 = basePosA[i3 + 1];
        const bz0 = basePosA[i3 + 2];

        const bx = bx0 * cosT - bz0 * sinT;
        const by = by0;
        const bz = bx0 * sinT + bz0 * cosT;

        // ── Effet "Anarchie" ──
        // Mouvements chaotiques adoucis (plus lents) autour de la souris
        const anarchyX = Math.sin(time * 1.5 + i) * 1.5;
        const anarchyY = Math.cos(time * 1.2 + i * 1.5) * 1.5;
        const anarchyZ = Math.sin(time * 1.8 + i * 2.0) * 1.5;

        // Cible quand l'essaim suit la souris
        const swarmX = mouseX + anarchyX;
        const swarmY = mouseY + anarchyY;
        const swarmZ = anarchyZ;

        // Interpolation
        const tx = bx + (swarmX - bx) * targetActive.current;
        const ty = by + (swarmY - by) * targetActive.current;
        const tz = bz + (swarmZ - bz) * targetActive.current;

        const dx = tx - cx;
        const dy = ty - cy;
        const dz = tz - cz;

        const speed = randomSpeeds[i];

        velocities[i3] += dx * speed;
        velocities[i3 + 1] += dy * speed;
        velocities[i3 + 2] += dz * speed;

        velocities[i3] *= 0.85;
        velocities[i3 + 1] *= 0.85;
        velocities[i3 + 2] *= 0.85;

        currentPosA[i3] += velocities[i3];
        currentPosA[i3 + 1] += velocities[i3 + 1];
        currentPosA[i3 + 2] += velocities[i3 + 2];
      }

      if (posARef.current) {
        posARef.current.needsUpdate = true;
      }
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        {/* Position principale utilisée par React Three Fiber (initialement posA) */}
        <bufferAttribute
          attach="attributes-position"
          array={currentPosA}
          count={pointCount}
          itemSize={3}
        />
        {/* L'attribut dynamique qui est mis à jour par la physique */}
        <bufferAttribute
          ref={posARef}
          attach="attributes-positionA"
          array={currentPosA}
          count={pointCount}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-positionB"
          array={posB}
          count={pointCount}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-positionC"
          array={posC}
          count={pointCount}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── Background Canvas (fixed, full-screen) ──

export default function ParticleBackground() {
  const setMousePos = useScrollStore((state) => state.setMousePos);

  const [pointCount, setPointCount] = React.useState(() =>
    window.innerWidth <= 768 ? 1200 : 2500
  );

  useEffect(() => {
    const handleResize = () => {
      setPointCount(window.innerWidth <= 768 ? 1200 : 2500);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [setMousePos]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 9], fov: 60 }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <ParticleField key={pointCount} pointCount={pointCount} radius={3.5} />
      </Canvas>
    </div>
  );
}