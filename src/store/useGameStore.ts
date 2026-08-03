import { create } from 'zustand';

// 1. On définit la structure de nos données (le typage TypeScript)
interface GameState {
  money: number;
  moneyPerSecond: number;
  clickValue: number;
  
  // Les actions
  click: () => void;
  tick: () => void;
}

// 2. On crée le store
export const useGameStore = create<GameState>((set) => ({
  // Valeurs initiales
  money: 0,
  moneyPerSecond: 1, // Le joueur gagne 1 pièce par seconde passivement
  clickValue: 1,     // Le joueur gagne 1 pièce par clic
  
  // Fonction quand le joueur clique
  click: () => set((state) => ({ 
    money: state.money + state.clickValue 
  })),
  
  // Fonction appelée en boucle par le jeu
  // On divise par 10 car notre boucle tournera 10 fois par seconde (toutes les 100ms)
  tick: () => set((state) => ({ 
    money: state.money + (state.moneyPerSecond / 10) 
  })),
}));