import { GameState } from '@/store/gameStore';

export function processGameTick(state: GameState): Partial<GameState> {
  let newPhotons = [...state.photons];
  let newEnergy = state.energy;
  let collectedThisTick = 0;

  const newDrones = state.drones.map(drone => ({
    ...drone,
    // On augmente l'angle. Le modulo (Math.PI * 2) évite que le chiffre ne devienne infini.
    angle: (drone.angle + drone.speed) % (Math.PI * 2) 
  }));

  const screenW = typeof window !== 'undefined' ? window.innerWidth : 1000;
  const screenH = typeof window !== 'undefined' ? window.innerHeight : 1000;
  const centerX = screenW / 2;
  const centerY = screenH / 2;

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

  // 2. Collision (Souris + Drones)
  newPhotons = newPhotons.map(p => {
    if (p.isCollected) return p;

    const pPixelX = (p.x / 100) * screenW;
    const pPixelY = (p.y / 100) * screenH;
    
    // --- NOUVEAU : LA ZONE MORTE DE L'ÉTOILE ---
    const dxCenter = pPixelX - centerX;
    const dyCenter = pPixelY - centerY;
    const distFromCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
    
    // Le cœur de l'étoile fait 160px de diamètre (80px de rayon).
    // Si le photon est à l'intérieur, il est invincible.
    if (distFromCenter < 80) return p; 
    // -------------------------------------------

    let isCaught = false;

    // A. Vérification de la souris
    if (state.mouseMode === 'COLLECT' && !state.isSkillTreeOpen) {
      const visualCenterX = (state.mouseX / 100) * screenW;
      const visualCenterY = (state.mouseY / 100) * screenH;
      const mouseRadius = (state.cursorSize / 2) + 10; 

      const dx = pPixelX - visualCenterX;
      const dy = pPixelY - visualCenterY;
      if (Math.sqrt(dx * dx + dy * dy) < mouseRadius) isCaught = true;
    }

    // B. Vérification des Drones
    if (!isCaught) {
      for (const drone of newDrones) {
        const droneX = centerX + Math.cos(drone.angle) * drone.orbitRadius;
        const droneY = centerY + Math.sin(drone.angle) * drone.orbitRadius;

        const dx = pPixelX - droneX;
        const dy = pPixelY - droneY;
        
        if (Math.sqrt(dx * dx + dy * dy) < drone.collectionRadius) {
          isCaught = true;
          break;
        }
      }
    }

    if (isCaught) {
      newEnergy += state.energyPerPhoton; 
      collectedThisTick += 1;
      return { ...p, isCollected: true, collectionTicks: 0 };
    }
    
    return p;
  });

  // 3. Nettoyage
 newPhotons = newPhotons.filter(p => {
    const isInside = p.x >= -5 && p.x <= 105 && p.y >= -5 && p.y <= 105;
    
    // CORRECTION : 15 ticks à 60FPS = 240 millisecondes. 
    // La transition CSS a enfin le temps de se terminer !
    const isDoneDying = p.isCollected && (p.collectionTicks || 0) >= 15;
    
    return isInside && !isDoneDying;
  });

  // 4. Génération Organique
  let newId = state.photonIdCounter;
  let newTicksSince = state.ticksSinceLastSpawn + 1;

  if (newTicksSince >= state.photonSpawnDelayTicks) {
      newTicksSince = 0;
      const angle = Math.random() * Math.PI * 2;
      
      // On retire le "spawnDist". Ils partent tous de la coordonnée exacte (50, 50)
      newPhotons.push({
        id: newId++,
        x: 50,
        y: 50,
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
    drones: newDrones,
    energy: newEnergy,
    photonIdCounter: newId,
    hasCollectedFirst: state.hasCollectedFirst || collectedThisTick > 0,
    tickCount: newTickCount,
    ticksSinceLastSpawn: newTicksSince,
    energyPerSecond: newEps,
    energyLastSecond: newEnergyLastSecond
  };
}