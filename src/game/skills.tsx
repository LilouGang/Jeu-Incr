import { ReactNode } from 'react';

export interface SkillDef {
  id: string; x: number; y: number; cost: number;
  title: string; effect: string; icon: ReactNode; parent: string | null;
}

export const SKILLS: SkillDef[] = [
  // --- RACINE ---
  { 
    id: 'spawn_1', x: 0, y: 300, cost: 10, 
    title: 'Excitation Primaire', 
    effect: 'Fréquence : 2/s', 
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><circle cx="12" cy="12" r="6" /></svg>,
    parent: null
  },
  
  // --- BRANCHE GAUCHE (Valeur & Machines) ---
  { 
    id: 'energy_1', x: -150, y: 150, cost: 30, 
    title: 'Densification', 
    effect: 'Valeur ⚡ = x2', 
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    parent: 'spawn_1' 
  },
  { 
    id: 'machine_1', x: -150, y: 0, cost: 200, 
    title: 'Canalisateur', 
    effect: 'Débloque les machines', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /></svg>,
    parent: 'energy_1' 
  },

  // --- NOUVELLE BRANCHE CENTRALE (Taille du Collecteur) ---
  { 
    id: 'radius_1', x: 0, y: 150, cost: 40, 
    title: 'Champ Étendu', 
    effect: 'Zone de récolte x2', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><circle cx="12" cy="12" r="8" strokeDasharray="3 3"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>,
    parent: 'spawn_1' 
  },
  { 
    id: 'radius_2', x: 0, y: 0, cost: 120, 
    title: 'Trou Noir Local', 
    effect: 'Zone de récolte x4', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="5" fill="currentColor"/></svg>,
    parent: 'radius_1' 
  },

  // --- BRANCHE DROITE (Vitesse) ---
  { 
    id: 'spawn_2', x: 150, y: 150, cost: 60, 
    title: 'Résonance', 
    effect: 'Fréquence : 3.3/s', 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v8l9-11h-7z" /></svg>,
    parent: 'spawn_1' 
  },
  { 
    id: 'spawn_3', x: 150, y: 0, cost: 150, 
    title: 'Fission', 
    effect: 'Fréquence : 5/s', 
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11H7v2h4v4h2v-4h4v-2h-4V7h-2v4z"/></svg>,
    parent: 'spawn_2' 
  }
];