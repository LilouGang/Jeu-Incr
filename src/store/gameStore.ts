import { create } from 'zustand';
import { processGameTick } from '@/game/engine';
import { SKILL_TREE } from '@/data/skillTree';

export type MouseMode = 'IDLE' | 'COLLECT' | 'BUILD' | 'DESTROY';

export interface Photon {
  id: number; x: number; y: number; vx: number; vy: number;
  isCollected?: boolean; collectionTicks?: number;
}

export interface Drone {
  id: number; orbitRadius: number; angle: number; speed: number; collectionRadius: number;
}

export interface GameState {
  photonSpawnDelayTicks: number;
  photonBaseSpeed: number;
  energyPerPhoton: number; 
  cursorSize: number; 
  
  energy: number;
  energyPerSecond: number;
  photons: Photon[];
  drones: Drone[];

  hasCollectedFirst: boolean;
  
  // --- NOUVEAU : GESTION DES NIVEAUX ---
  isSkillTreeOpen: boolean;
  skillLevels: Record<string, number>; // Ex: { nucleosynthese: 2, voilier_solaire: 1 }

  tickCount: number;
  mouseMode: MouseMode;
  mouseX: number; mouseY: number;

  setMousePosition: (x: number, y: number) => void;
  setMouseMode: (mode: MouseMode) => void;
  toggleSkillTree: () => void;
  
  unlockSkill: (skillId: string) => void;
  tick: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  photonSpawnDelayTicks: 120, 
  photonBaseSpeed: 0.1,
  energyPerPhoton: 1,
  cursorSize: 20, 

  energy: 0,
  energyPerSecond: 0,
  photons: [],
  drones: [],

  hasCollectedFirst: false,
  
  isSkillTreeOpen: false,
  skillLevels: {}, // Tout est à 0 au début

  tickCount: 0,
  mouseMode: 'IDLE',
  mouseX: 50, mouseY: 50,

  setMousePosition: (x, y) => set({ mouseX: x, mouseY: y }),
  setMouseMode: (mode) => set({ mouseMode: mode }),
  toggleSkillTree: () => set((state) => ({ isSkillTreeOpen: !state.isSkillTreeOpen })),

  unlockSkill: (skillId) => set((state) => {
    const skill = SKILL_TREE[skillId];
    if (!skill) return state;

    const currentLevel = state.skillLevels[skillId] || 0;
    if (currentLevel >= skill.maxLevel) return state; // Niveau max atteint

    // Calcul du coût dynamique : prix de base * (multiplicateur ^ niveau)
    const cost = Math.floor(skill.baseCost * Math.pow(skill.costMultiplier, currentLevel));
    if (state.energy < cost) return state;

    const newState = {
      energy: state.energy - cost,
      skillLevels: { ...state.skillLevels, [skillId]: currentLevel + 1 },
      photonSpawnDelayTicks: state.photonSpawnDelayTicks,
      photonBaseSpeed: state.photonBaseSpeed,
      energyPerPhoton: state.energyPerPhoton,
      cursorSize: state.cursorSize,
      drones: [...state.drones]
    };

    // === APPLICATION AUTOMATIQUE DES EFFETS ===
    const effects = skill.effectPerLevel;
    
    if (effects.spawnDelayMultiplier) {
      newState.photonSpawnDelayTicks = Math.max(1, Math.floor(state.photonSpawnDelayTicks * effects.spawnDelayMultiplier));
    }
    if (effects.energyValueAdder) {
      newState.energyPerPhoton += effects.energyValueAdder;
    }
    if (effects.speedMultiplier) {
      newState.photonBaseSpeed *= effects.speedMultiplier;
      // Supprime la ligne photonBurstSpeed ici !
    }
    if (effects.maxDronesAdded) {
      for(let i = 0; i < effects.maxDronesAdded; i++) {
        const droneCount = newState.drones.length;
        newState.drones.push({
          id: droneCount + 1,
          orbitRadius: 220, // Plus loin de l'étoile, tous sur la même orbite !
          angle: Math.random() * Math.PI * 2,
          speed: 0.002 + (Math.random() * 0.001), // Beaucoup plus lent
          collectionRadius: 30
        });
      }
    }
    if (effects.collectionRadiusAdder) {
      newState.cursorSize += effects.collectionRadiusAdder;
    }

    return newState;
  }),

  tick: () => set((state) => processGameTick(state))
}));