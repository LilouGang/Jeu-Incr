import { create } from 'zustand';
import { processGameTick } from '@/game/engine';

export type MouseMode = 'IDLE' | 'COLLECT' | 'BUILD' | 'DESTROY';

export interface Photon {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isCollected?: boolean;
  collectionTicks?: number;
}

export interface GameState {
  photonSpawnDelayTicks: number;
  photonBaseSpeed: number;
  photonBurstSpeed: number;
  
  energyPerPhoton: number; 
  energy: number;
  energyPerSecond: number;
  cursorSize: number;
  photons: Photon[];
  hasCollectedFirst: boolean;
  mouseMode: MouseMode;
  mouseX: number;
  mouseY: number;

  // --- NOUVEL ARBRE DE COMPÉTENCES ---
  isSkillTreeOpen: boolean;
  unlockedSkills: string[]; // Ex: ['spawn_1', 'machine_1']

  tickCount: number;
  ticksSinceLastSpawn: number;
  energyLastSecond: number;
  photonIdCounter: number;

  setMousePosition: (x: number, y: number) => void;
  setMouseMode: (mode: MouseMode) => void;
  toggleSkillTree: () => void;
  
  // La nouvelle fonction universelle d'achat
  unlockSkill: (skillId: string, cost: number) => void;
  
  tick: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  photonSpawnDelayTicks: 10,
  photonBaseSpeed: 0.6,
  photonBurstSpeed: 6.0,

  energyPerPhoton: 1,
  cursorSize: 20,
  energy: 0,
  energyPerSecond: 0,
  photons: [],
  hasCollectedFirst: false,
  mouseMode: 'IDLE',
  mouseX: 50,
  mouseY: 50,
  
  isSkillTreeOpen: false,
  unlockedSkills: [], // Au début, l'arbre est vide

  tickCount: 0,
  ticksSinceLastSpawn: 0,
  energyLastSecond: 0,
  photonIdCounter: 0,

  setMousePosition: (x, y) => set({ mouseX: x, mouseY: y }),
  setMouseMode: (mode) => set({ mouseMode: mode }),
  toggleSkillTree: () => set((state) => ({ isSkillTreeOpen: !state.isSkillTreeOpen })),

  unlockSkill: (skillId, cost) => set((state) => {
    if (state.energy >= cost && !state.unlockedSkills.includes(skillId)) {
      const newState = {
        energy: state.energy - cost,
        unlockedSkills: [...state.unlockedSkills, skillId],
        photonSpawnDelayTicks: state.photonSpawnDelayTicks,
        energyPerPhoton: state.energyPerPhoton,
        cursorSize: state.cursorSize // On le propage
      };

      // === LE CÂBLAGE DIRECT ET EFFICACE ===
      if (skillId === 'spawn_1') newState.photonSpawnDelayTicks = 5;
      if (skillId === 'spawn_2') newState.photonSpawnDelayTicks = 3;
      if (skillId === 'spawn_3') newState.photonSpawnDelayTicks = 2;
      
      if (skillId === 'energy_1') newState.energyPerPhoton = 2;
      
      // La nouvelle branche !
      if (skillId === 'radius_1') newState.cursorSize = 40; // Double la taille
      if (skillId === 'radius_2') newState.cursorSize = 80; // Quadruple
      
      return newState;
    }
    return state;
  }),

  tick: () => set((state) => processGameTick(state))
}));