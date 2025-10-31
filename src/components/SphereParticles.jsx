import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import styled from 'styled-components'

function SphereParticles({ pointCount = 2000, radius = 3 }) {
  const pointsRef = useRef()

  // Positions "de base" (pour reformer la sphère)
  const basePositions = useMemo(() => {
    const arr = new Float32Array(pointCount * 3)
    for (let i = 0; i < pointCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = 2 * Math.PI * Math.random()
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)
      arr[i * 3 + 0] = x
      arr[i * 3 + 1] = y
      arr[i * 3 + 2] = z
    }
    return arr
  }, [pointCount, radius])

  // Copie pour la géométrie Three.js
  const positions = useMemo(() => new Float32Array(basePositions), [basePositions])
  const positionAttribute = useMemo(
    () => new THREE.BufferAttribute(positions, 3),
    [positions]
  )

  // Tableau de vitesses (Vector3) pour chaque particule
  const velocities = useMemo(() => {
    const vels = []
    for (let i = 0; i < pointCount; i++) {
      vels.push(new THREE.Vector3(0, 0, 0))
    }
    return vels
  }, [pointCount])

  // État pour la souris
  const [pointerInside, setPointerInside] = useState(false)
  const [mouse3D, setMouse3D] = useState(new THREE.Vector3(0, 0, 0))

  // Pour déclencher l’explosion une seule fois quand la souris entre
  const hasExploded = useRef(false)

  useFrame(() => {
    if (!pointsRef.current) return

    // Fait tourner la sphère (et le nuage de particules) en continu
    pointsRef.current.rotation.y += 0.0015

    const attr = pointsRef.current.geometry.attributes.position

    // -- Paramètres à ajuster pour un rendu plus/moins agressif --
    const explodeForce = 0.7  // force initiale de l'explosion (réduit pour un effet plus doux)
    const followFactor = 0.06  // force d'attraction vers la souris (plus faible = plus lent)
    const returnFactor = 0.01  // retour vers la sphère quand la souris n’est pas là
    const friction = 0.98       // amortissement de la vitesse (plus proche de 1 => mouvement plus lent mais plus fluide)
    const maxSpeed = 0.35       // limite la vitesse max (réduit pour éviter des mouvements trop brusques)

    for (let i = 0; i < attr.count; i++) {
      // Position actuelle
      const px = attr.getX(i)
      const py = attr.getY(i)
      const pz = attr.getZ(i)

      // Vitesse actuelle
      const vx = velocities[i].x
      const vy = velocities[i].y
      const vz = velocities[i].z

      // Position de base
      const bx = basePositions[i * 3 + 0]
      const by = basePositions[i * 3 + 1]
      const bz = basePositions[i * 3 + 2]

      // Explosion douce (une seule fois quand la souris entre)
      if (pointerInside && !hasExploded.current) {
        const randomDir = new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize()
        velocities[i].addScaledVector(randomDir, explodeForce)
      }

      // Si la souris est dans le cadre => attraction vers la souris
      if (pointerInside) {
        const dx = mouse3D.x - px
        const dy = mouse3D.y - py
        const dz = mouse3D.z - pz
        velocities[i].x += dx * followFactor
        velocities[i].y += dy * followFactor
        velocities[i].z += dz * followFactor
      } else {
        // Sinon, retour vers la position de base
        const dx = bx - px
        const dy = by - py
        const dz = bz - pz
        velocities[i].x += dx * returnFactor
        velocities[i].y += dy * returnFactor
        velocities[i].z += dz * returnFactor
      }

      // Applique la friction (amortissement)
      velocities[i].multiplyScalar(friction)

      // Limite la vitesse max
      if (velocities[i].length() > maxSpeed) {
        velocities[i].setLength(maxSpeed)
      }

      // Mise à jour de la position
      attr.setXYZ(
        i,
        px + velocities[i].x,
        py + velocities[i].y,
        pz + velocities[i].z
      )
    }

    if (pointerInside && !hasExploded.current) {
      hasExploded.current = true
    }
    if (!pointerInside && hasExploded.current) {
      // On peut réarmer l'explosion pour la prochaine fois si on veut
      hasExploded.current = false
    }

    attr.needsUpdate = true
  })

  // -- Gestion de la souris --
  const handlePointerOver = () => setPointerInside(true)
  const handlePointerOut = () => setPointerInside(false)

  // e.pointer.x, e.pointer.y : coords normalisées (-1..+1) fournies par R3F
  const handlePointerMove = (e) => {
    setMouse3D(new THREE.Vector3(e.pointer.x * 5, e.pointer.y * 3, 0))
  }

  return (
    <points
      ref={pointsRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerMove={handlePointerMove}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          {...positionAttribute}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.03}
        sizeAttenuation
        opacity={0.9}
        transparent
      />
    </points>
  )
}
const CanvasContainer = styled.div`
  width: 30vw;
  height: 60vh;
  background: #000;

  /* Media query pour un écran max-width: 600px (smartphone) */
  @media (max-width: 600px) {
    width: 50vw;
    height: 30vh;
  }
`
export default function SphereAnimation() {
  // Détection de la taille d'écran avec state pour éviter les recalculs
  const [pointCount, setPointCount] = useState(() => {
    return window.innerWidth <= 768 ? 1000 : 3000;
  });

  useEffect(() => {
    // Déterminer le pointCount initial
    const updatePointCount = () => {
      const isMobile = window.innerWidth <= 768;
      setPointCount(isMobile ? 1000 : 3000);
    };

    // Mettre à jour au changement de taille
    window.addEventListener('resize', updatePointCount);
    
    // Nettoyage
    return () => {
      window.removeEventListener('resize', updatePointCount);
    };
  }, []);

  return (
    <CanvasContainer>
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <SphereParticles key={pointCount} pointCount={pointCount} radius={3} />
      </Canvas>
    </CanvasContainer>
  )
}