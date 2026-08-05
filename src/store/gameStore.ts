import { create } from 'zustand';

export type MouseMode = 'COLLECT' | 'BUILD' | 'DESTROY';

interface Photon {
  id: number;
  x: number; // Position X (en pourcentage d'écran)
  y: number; // Position Y (en pourcentage d'écran)
  vx: number; // Vitesse sur X
  vy: number; // Vitesse sur Y
}

interface GameState {
  energy: number;
  energyPerSecond: number;
  photons: Photon[];
  hasCollectedFirst: boolean;
  mouseMode: MouseMode;
  mouseX: number;
  mouseY: number;

  // Compteurs internes
  tickCount: number;
  energyLastSecond: number;
  photonIdCounter: number;

  setMousePosition: (x: number, y: number) => void;
  setMouseMode: (mode: MouseMode) => void;
  tick: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  energy: 0,
  energyPerSecond: 0,
  photons: [],
  hasCollectedFirst: false,
  mouseMode: 'COLLECT',
  mouseX: 50,
  mouseY: 50,
  tickCount: 0,
  energyLastSecond: 0,
  photonIdCounter: 0,

  setMousePosition: (x, y) => set({ mouseX: x, mouseY: y }),
  setMouseMode: (mode) => set({ mouseMode: mode }),

  tick: () => set((state) => {
    let newPhotons = [...state.photons];
    let newEnergy = state.energy;
    let collectedThisTick = 0;

    // 1. Déplacer les photons existants
    newPhotons = newPhotons.map(p => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy
    }));

    // 2. Nettoyer les photons qui sortent de l'écran (0 à 100%)
    newPhotons = newPhotons.filter(p => p.x >= 0 && p.x <= 100 && p.y >= 0 && p.y <= 100);

    // 3. Collision avec la souris (Uniquement en mode COLLECT)
    const COLLECTION_RADIUS = 3; // Rayon de capture (environ la taille du cercle)
    if (state.mouseMode === 'COLLECT') {
      newPhotons = newPhotons.filter(p => {
        const dx = p.x - state.mouseX;
        const dy = p.y - state.mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < COLLECTION_RADIUS) {
          newEnergy += 1;
          collectedThisTick += 1;
          return false; // Le photon est absorbé, on le retire du tableau
        }
        return true;
      });
    }

    // 4. Générer de nouveaux photons depuis le centre (50%, 50%)
    let newId = state.photonIdCounter;
    // ~20% de chance d'apparaître à chaque tick (soit ~2 photons par seconde)
    if (Math.random() < 0.2) {
      const angle = Math.random() * Math.PI * 2; // Direction aléatoire
      const speed = 0.6; // Vitesse de déplacement
      newPhotons.push({
        id: newId++,
        x: 50,
        y: 50,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed
      });
    }

    // 5. Calculer l'Énergie par Seconde (tous les 10 ticks = 1 seconde)
    let newTickCount = state.tickCount + 1;
    let newEps = state.energyPerSecond;
    let newEnergyLastSecond = state.energyLastSecond;

    if (newTickCount >= 10) {
      newEps = newEnergy - state.energyLastSecond;
      newEnergyLastSecond = newEnergy;
      newTickCount = 0;
    }

    return {
      photons: newPhotons,
      energy: newEnergy,
      photonIdCounter: newId,
      hasCollectedFirst: state.hasCollectedFirst || collectedThisTick > 0,
      tickCount: newTickCount,
      energyPerSecond: newEps,
      energyLastSecond: newEnergyLastSecond
    };
  })
}));