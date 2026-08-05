'use client'; // Indispensable sur Next.js pour utiliser useEffect

import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

export function GameLoop() {
  const tick = useGameStore((state) => state.tick);

  useEffect(() => {
    // On crée une boucle qui s'exécute toutes les 100 millisecondes (10 fois par seconde)
    const interval = setInterval(() => {
      tick();
    }, 100);

    // Nettoyage au démontage pour éviter les fuites de mémoire
    return () => clearInterval(interval);
  }, [tick]);

  return null; // Ce composant est un fantôme, il n'affiche rien à l'écran
}