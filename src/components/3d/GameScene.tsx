'use client';

import { Canvas } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';

// --- 1. LE DÉCOR : La Table ---
function Table() {
  return (
    // On descend un peu la table pour que le dessus soit à Y = 0
    <mesh position={[0, -0.5, 0]}>
      {/* args=[largeur, hauteur, profondeur] */}
      <boxGeometry args={[4, 1, 4]} />
      <meshStandardMaterial color="#3d3d42" /> {/* Une table de labo gris foncé */}
    </mesh>
  );
}

// --- 2. LA MACHINE (Niveau 1) : Le Bécher ---
function BeakerLevel1() {
  return (
    // On place le groupe juste au-dessus de la table
    <group position={[0, 0.5, 0]}>
      
      {/* Le verre du bécher */}
      <mesh>
        {/* Un cylindre : args=[rayonHaut, rayonBas, hauteur, segments] */}
        <cylinderGeometry args={[0.4, 0.4, 1, 16]} />
        <meshPhysicalMaterial 
          transparent 
          opacity={0.3} 
          roughness={0.1} 
          color="#ffffff" 
        />
      </mesh>

      {/* Le liquide chimique à l'intérieur */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.5, 16]} />
        <meshStandardMaterial color="#00ffcc" /> {/* Liquide cyan fluo */}
      </mesh>

    </group>
  );
}

// --- 3. L'ASSEMBLAGE : La Scène Principale ---
export default function GameScene() {
  return (
    <Canvas>
      {/* 
        La Caméra Orthographique : 
        On la place en diagonale (x:10, y:10, z:10) et on la fait regarder vers le centre.
        Le "zoom" permet de régler la taille de la carte à l'écran.
      */}
      <OrthographicCamera 
        makeDefault 
        position={[10, 10, 10]} 
        zoom={60} 
      />

      {/* Les Lumières pour donner du relief */}
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1.5} 
        castShadow 
      />

      {/* Les objets */}
      <Table />
      <BeakerLevel1 />
    </Canvas>
  );
}