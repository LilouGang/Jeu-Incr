import { GameState } from '@/store/gameStore';

let newId = 1000; // Pour générer des IDs uniques pour les photons
let newTicksSince = 0;

export function processGameTick(state: GameState): Partial<GameState> {
  let newPhotons = [...state.photons];
  let newEnergy = state.energy;
  let collectedThisTick = 0;

  // === 0. FAIRE TOURNER LES DRONES ===
  const newDrones = state.drones.map(drone => ({
    ...drone,
    angle: (drone.angle + drone.speed) % (Math.PI * 2) 
  }));

  // === Pré-calculs de l'écran ===
  const screenW = typeof window !== 'undefined' ? window.innerWidth : 1000;
  const screenH = typeof window !== 'undefined' ? window.innerHeight : 1000;
  const centerX = screenW / 2;
  const centerY = screenH / 2;

  // === 1. DÉPLACER LES PHOTONS ===
  newPhotons = newPhotons.map(p => {
    if (p.isCollected) {
      return { ...p, collectionTicks: (p.collectionTicks || 0) + 1 };
    }
    // Vitesse constante ! (Plus de freinage ni de burst)
    return {
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy
    };
  });

  // === 2. GESTION DES COLLISIONS ===
  newPhotons = newPhotons.map(p => {
    if (p.isCollected) return p;

    const pPixelX = (p.x / 100) * screenW;
    const pPixelY = (p.y / 100) * screenH;
    
    // Zone morte de l'étoile (80px de rayon) : les photons y sont intouchables
    const dxCenter = pPixelX - centerX;
    const dyCenter = pPixelY - centerY;
    const distFromCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
    if (distFromCenter < 80) return p; 

    let isCaught = false;

    // A. Collision avec la souris (si on est en mode récolte)
    if (state.mouseMode === 'COLLECT' && !state.isSkillTreeOpen && typeof window !== 'undefined') {
      const visualCenterX = (state.mouseX / 100) * screenW;
      const visualCenterY = (state.mouseY / 100) * screenH;
      const mouseRadius = (state.cursorSize / 2) + 10; 

      const dx = pPixelX - visualCenterX;
      const dy = pPixelY - visualCenterY;
      if (Math.sqrt(dx * dx + dy * dy) < mouseRadius) isCaught = true;
    }

    // B. Collision avec les drones en orbite
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

    // Si capturé : on ajoute l'énergie selon la valeur actuelle d'un photon
    if (isCaught) {
      newEnergy += state.energyPerPhoton; 
      collectedThisTick += 1;
      return { ...p, isCollected: true, collectionTicks: 0 };
    }
    
    return p;
  });

  // === 3. NETTOYAGE ET GÉNÉRATION ===
  
  // On supprime les photons hors écran ou dont l'animation de mort (240ms = 15 ticks) est terminée
  newPhotons = newPhotons.filter(p => {
    const isInside = p.x >= -5 && p.x <= 105 && p.y >= -5 && p.y <= 105;
    const isDoneDying = p.isCollected && (p.collectionTicks || 0) >= 15;
    return isInside && !isDoneDying;
  });

  // Génération d'un nouveau photon depuis le centre exact (50, 50)
  newTicksSince += 1;
  if (newTicksSince >= state.photonSpawnDelayTicks) {
    newTicksSince = 0;
    const angle = Math.random() * Math.PI * 2;
    
    newPhotons.push({
      id: newId++,
      x: 50,
      y: 50,
      vx: Math.cos(angle) * state.photonBaseSpeed,
      vy: Math.sin(angle) * state.photonBaseSpeed
    });
  }

  // === RETOUR AU STORE ===
  return {
    photons: newPhotons,
    drones: newDrones,
    energy: newEnergy,
    tickCount: state.tickCount + 1,
    // On passe hasCollectedFirst à true dès le premier gain d'énergie (pour afficher l'UI)
    ...(collectedThisTick > 0 && !state.hasCollectedFirst ? { hasCollectedFirst: true } : {})
  };
}