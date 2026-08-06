'use client';

import { useMemo } from 'react';

export default function GridBackground() {
  // On utilise useMemo pour que la grille ne soit calculée qu'une seule fois 
  // au chargement, sinon ça ferait ramer React.
  const paths = useMemo(() => {
    const GRID_SIZE = 2000; // Une grille géante pour couvrir n'importe quel écran
    const STEP = 50; // L'espacement entre chaque ligne (la taille des carrés)
    const SEGMENT_LENGTH = 10; // Précision de la courbure (plus c'est bas, plus c'est fluide)
    
    // Les variables de notre trou noir
    const WARP_RADIUS = 400; // La zone d'effet en pixels
    const WARP_STRENGTH = 100; // La force d'aspiration
    const cx = GRID_SIZE / 2; // Centre de la grille
    const cy = GRID_SIZE / 2; // Centre de la grille

    // Fonction mathématique de courbure de l'espace
    const warpPoint = (x: number, y: number) => {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Si on est en dehors de la zone, la ligne reste droite
      if (dist >= WARP_RADIUS || dist === 0) return { x, y };

      // La formule d'attraction : plus on est proche, plus c'est fort.
      const intensity = Math.pow(1 - (dist / WARP_RADIUS), 2);
      // On s'assure que la force ne dépasse pas la distance (pour ne pas traverser le centre)
      const pull = Math.min(intensity * WARP_STRENGTH, dist);

      const angle = Math.atan2(dy, dx);
      return {
        x: x - Math.cos(angle) * pull,
        y: y - Math.sin(angle) * pull
      };
    };

    // Générateur de ligne (découpée en segments tordus)
    const generateLine = (isVertical: boolean, offset: number) => {
      let d = '';
      for (let i = 0; i <= GRID_SIZE; i += SEGMENT_LENGTH) {
        const px = isVertical ? offset : i;
        const py = isVertical ? i : offset;
        const { x, y } = warpPoint(px, py);
        
        // On arrondit (toFixed) pour bloquer l'erreur d'hydratation de Next.js
        d += `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)} `;
      }
      return d;
    };

    const newPaths = [];
    // On dessine toutes les lignes horizontales et verticales
    for (let i = 0; i <= GRID_SIZE; i += STEP) {
      newPaths.push(generateLine(true, i));
      newPaths.push(generateLine(false, i));
    }
    return newPaths;
  }, []);

  return (
    <div className="absolute inset-0 z-0 bg-white overflow-hidden pointer-events-none flex items-center justify-center">
      
      {/* Le SVG géant avec les vraies lignes courbées */}
      <svg 
        width="2000" 
        height="2000" 
        viewBox="0 0 2000 2000" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30"
      >
        {paths.map((d, idx) => (
          <path key={idx} d={d} fill="none" stroke="#9ca3af" strokeWidth="1" />
        ))}
      </svg>
    </div>
  );
}