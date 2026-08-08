import React from 'react';

export interface SkillEffect {
  spawnDelayMultiplier?: number;
  energyValueAdder?: number;
  speedMultiplier?: number;
  maxDronesAdded?: number;
  collectionRadiusAdder?: number;
  gravitationalPull?: number;
}

export interface SkillNode {
  id: string;
  icon: React.ReactNode;
  gridX: number; 
  gridY: number;
  baseCost: number; 
  costMultiplier: number; 
  maxLevel: number;
  parentIds: string[]; 
  effectPerLevel: SkillEffect;
  
  // --- LE NOUVEAU FORMAT MIXTE ---
  title: string;       // Fait scientifique
  subtitle: string;    // Explication simple (1 ligne)
  getStats: (level: number) => { current: string; next: string; increment: string };
}

export const SKILL_TREE: Record<string, SkillNode> = {
  nucleosynthese: {
    id: 'nucleosynthese',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-700"><circle cx="12" cy="12" r="6"/><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>,
    gridX: 0, gridY: -150,
    baseCost: 20, costMultiplier: 1.6, maxLevel: 10,
    parentIds: [],
    effectPerLevel: { spawnDelayMultiplier: 0.8 },
    title: "Fusion nucléaire",
    subtitle: "Augmente l'émission de photons de l'étoile",
    getStats: (level) => ({
      current: `${100 + level * 20}%`, next: `${100 + (level + 1) * 20}%`, increment: '+20%'
    })
  },
  equivalence_masse: {
    id: 'equivalence_masse',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-700"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    gridX: -150, gridY: -300,
    baseCost: 50, costMultiplier: 2.0, maxLevel: 5,
    parentIds: ['nucleosynthese'],
    effectPerLevel: { energyValueAdder: 1, speedMultiplier: 1.2 },
    title: "Équivalence masse-énergie",
    subtitle: "Augmente la valeur et la vitesse des photons",
    getStats: (level) => ({
      current: `${1 + level} ⚡`, next: `${1 + (level + 1)} ⚡`, increment: '+1 ⚡, Vitesse x1.2'
    })
  },
  voilier_solaire: {
    id: 'voilier_solaire',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-gray-700"><path d="M12 2L2 22l10-4 10 4L12 2z"/></svg>,
    gridX: 150, gridY: -300,
    baseCost: 150, costMultiplier: 1.0, maxLevel: 1,
    parentIds: ['nucleosynthese'],
    effectPerLevel: { maxDronesAdded: 1 },
    title: "Voilier solaire",
    subtitle: "Déploie un drone de collecte autonome",
    getStats: (level) => ({
      current: `${level} Drone`, next: `${level + 1} Drone`, increment: '+1 Drone'
    })
  },
  points_lagrange: {
    id: 'points_lagrange',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-gray-700"><circle cx="12" cy="12" r="3"/><circle cx="4" cy="12" r="2"/><circle cx="20" cy="12" r="2"/><path d="M6 12h3m6 0h3"/></svg>,
    gridX: 150, gridY: -450,
    baseCost: 500, costMultiplier: 2.5, maxLevel: 3, 
    parentIds: ['voilier_solaire'],
    effectPerLevel: { maxDronesAdded: 2 },
    title: "Points de Lagrange",
    subtitle: "Débloque de nouvelles orbites stables",
    getStats: (level) => ({
      current: `${1 + level * 2} Orbites`, next: `${1 + (level + 1) * 2} Orbites`, increment: '+2 Orbites'
    })
  },
  lentille_gravitationnelle: {
    id: 'lentille_gravitationnelle',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-gray-700"><path d="M12 4a8 8 0 00-8 8 8 8 0 008 8 8 8 0 008-8 8 8 0 00-8-8zm0 4v8m-4-4h8"/></svg>,
    gridX: 300, gridY: -450,
    baseCost: 2500, costMultiplier: 3.0, maxLevel: 3,
    parentIds: ['points_lagrange'],
    effectPerLevel: { gravitationalPull: 1.5 },
    title: "Lentille gravitationnelle",
    subtitle: "Les drones attirent les photons proches",
    getStats: (level) => ({
      current: `${level * 50}G`, next: `${(level + 1) * 50}G`, increment: '+50G Attraction'
    })
  }
};