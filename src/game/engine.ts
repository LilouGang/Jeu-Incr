import { GameState } from '@/store/gameStore';

export function processGameTick(state: GameState): Partial<GameState> {
  let newPhotons = [...state.photons];
  let newEnergy = state.energy;
  let collectedThisTick = 0;

  // 1. Déplacer et freiner
  newPhotons = newPhotons.map(p => {
    if (p.isCollected) {
      return { ...p, collectionTicks: (p.collectionTicks || 0) + 1 };
    }

    let newVx = p.vx;
    let newVy = p.vy;
    const currentSpeed = Math.sqrt(newVx * newVx + newVy * newVy);

    if (currentSpeed > state.photonBaseSpeed) {
      newVx *= 0.75;
      newVy *= 0.75;
      if (Math.sqrt(newVx * newVx + newVy * newVy) < state.photonBaseSpeed) {
        const angle = Math.atan2(newVy, newVx);
        newVx = Math.cos(angle) * state.photonBaseSpeed;
        newVy = Math.sin(angle) * state.photonBaseSpeed;
      }
    }

    return { ...p, x: p.x + newVx, y: p.y + newVy, vx: newVx, vy: newVy };
  });

  // 2. Collision avec la souris (Coupée si l'arbre est ouvert !)
  if (state.mouseMode === 'COLLECT' && !state.isSkillTreeOpen && typeof window !== 'undefined') {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    // Le centre visuel exact est la position brute de la souris
    const visualCenterX = (state.mouseX / 100) * screenW;
    const visualCenterY = (state.mouseY / 100) * screenH;
    
    // Le rayon de collision s'adapte à ta nouvelle compétence (Rayon du curseur + 15px d'aspiration)
    const COLLECTION_RADIUS_PX = (state.cursorSize / 2) + 5; 

    newPhotons = newPhotons.map(p => {
      if (p.isCollected) return p;

      const pPixelX = (p.x / 100) * screenW;
      const pPixelY = (p.y / 100) * screenH;

      const dx = pPixelX - visualCenterX;
      const dy = pPixelY - visualCenterY;
      
      if (Math.sqrt(dx * dx + dy * dy) < COLLECTION_RADIUS_PX) {
        newEnergy += state.energyPerPhoton; 
        collectedThisTick += 1;
        return { ...p, isCollected: true, collectionTicks: 0 };
      }
      return p;
    });
  }

  // 3. Nettoyage
  newPhotons = newPhotons.filter(p => {
    const isInside = p.x >= -5 && p.x <= 105 && p.y >= -5 && p.y <= 105;
    const isDoneDying = p.isCollected && (p.collectionTicks || 0) >= 3;
    return isInside && !isDoneDying;
  });

  // 4. Génération Organique
  let newId = state.photonIdCounter;
  let newTicksSince = state.ticksSinceLastSpawn + 1;

  if (newTicksSince >= state.photonSpawnDelayTicks) {
    newTicksSince = 0;
    const angle = Math.random() * Math.PI * 2;
    const spawnDist = 5 + (Math.random() * 15);
    const startX = 50 + Math.cos(angle) * spawnDist;
    const startY = 50 + Math.sin(angle) * spawnDist;
    
    newPhotons.push({
      id: newId++,
      x: startX,
      y: startY,
      vx: Math.cos(angle) * state.photonBurstSpeed,
      vy: Math.sin(angle) * state.photonBurstSpeed
    });
  }

  // 5. Calcul de l'EPS
  let newTickCount = state.tickCount + 1;
  let newEps = state.energyPerSecond;
  let newEnergyLastSecond = state.energyLastSecond;

  if (newTickCount >= 10) {
    newEps = newEnergy - state.energyLastSecond;
    newEnergyLastSecond = newEnergy;
    newTickCount = 0;
  }

  // On renvoie uniquement ce qui a changé
  return {
    photons: newPhotons,
    energy: newEnergy,
    photonIdCounter: newId,
    hasCollectedFirst: state.hasCollectedFirst || collectedThisTick > 0,
    tickCount: newTickCount,
    ticksSinceLastSpawn: newTicksSince,
    energyPerSecond: newEps,
    energyLastSecond: newEnergyLastSecond
  };
}