'use client';

import { useGameStore } from '../store/useGameStore';
import { GameLoop } from '../game/GameLoop';

export default function Game() {
  const money = useGameStore((state) => state.money);
  const moneyPerSecond = useGameStore((state) => state.moneyPerSecond);
  const click = useGameStore((state) => state.click);

  return (
    <main className="w-screen h-screen overflow-hidden bg-gray-900 text-white flex flex-col items-center justify-center relative">
      {/* 1. On lance le moteur du jeu en fond */}
      <GameLoop />

      {/* 2. L'interface temporaire */}
      <div className="z-10 flex flex-col items-center gap-6 p-8 bg-gray-800 rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-yellow-400">
            {/* On utilise Math.floor pour un affichage propre sans les décimales */}
            {Math.floor(money)} $
          </h1>
          <p className="text-gray-400 mt-2">{moneyPerSecond} $/sec</p>
        </div>

        <button 
          onClick={click}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all rounded-xl font-bold text-xl shadow-lg"
        >
          Travailler !
        </button>
      </div>

      {/* 3. Espace réservé pour la 3D plus tard */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        {/* Le Canvas React Three Fiber ira ici */}
      </div>
    </main>
  );
}