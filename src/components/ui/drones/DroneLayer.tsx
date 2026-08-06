'use client';

import { useGameStore } from '@/store/gameStore';

export default function DroneLayer() {
  const drones = useGameStore(state => state.drones);

  if (drones.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {drones.map(drone => (
        <div key={drone.id}>
          
          {/* L'Anneau Orbital (Le fin trait de trajectoire) */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1px] border-slate-300/40"
            style={{
              width: drone.orbitRadius * 2,
              height: drone.orbitRadius * 2
            }}
          />
          
          {/* Le Satellite (Voilier Solaire) */}
          <div
            className="absolute top-1/2 left-1/2 flex items-center justify-center"
            style={{
              // La magie de la trigonométrie appliquée au CSS :
              transform: `translate(-50%, -50%) translate(${Math.cos(drone.angle) * drone.orbitRadius}px, ${Math.sin(drone.angle) * drone.orbitRadius}px)`
            }}
          >
            {/* L'apparence du drone : Un losange technologique */}
            <div className="w-4 h-4 bg-slate-800 rotate-45 border border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)]" />
            
            {/* Le filet de collision invisible (Pour le debug ou l'esthétisme) */}
            <div 
              className="absolute rounded-full border border-blue-400/20 bg-blue-400/5"
              style={{ width: drone.collectionRadius * 2, height: drone.collectionRadius * 2 }}
            />
          </div>
          
        </div>
      ))}
    </div>
  );
}