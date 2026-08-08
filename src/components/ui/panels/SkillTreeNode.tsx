import { useState, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { SkillNode, SKILL_TREE } from '@/data/skillTree';

interface Props {
  skill: SkillNode;
  cameraScale: number;
}

export default function SkillTreeNode({ skill, cameraScale }: Props) {
  const energy = useGameStore(state => state.energy);
  const skillLevels = useGameStore(state => state.skillLevels);
  const unlockSkill = useGameStore(state => state.unlockSkill);

  const [isHovered, setIsHovered] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsAnimatingOut(false);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsAnimatingOut(true);
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      setIsAnimatingOut(false);
    }, 200); 
  };

  const currentLevel = skillLevels[skill.id] || 0;
  const isMaxed = currentLevel >= skill.maxLevel;
  
  const isAvailable = skill.parentIds.length === 0 || skill.parentIds.every(id => (skillLevels[id] || 0) > 0);
  const isPadlock = !isAvailable && skill.parentIds.some(id => (skillLevels[id] || 0) > 0);

  if (currentLevel === 0 && !isAvailable) {
    if (!isPadlock) return null;
    return (
      <div className="absolute z-0 pointer-events-none" style={{ transform: `translate(${skill.gridX - 28}px, ${skill.gridY - 28}px)` }}>
        <div className="w-14 h-14 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center opacity-70">
          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-9h-1V6a5 5 0 10-10 0v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2zM9 6a3 3 0 116 0v2H9V6z"/>
          </svg>
        </div>
      </div>
    );
  }

  const currentCost = Math.floor(skill.baseCost * Math.pow(skill.costMultiplier, currentLevel));
  const canAfford = energy >= currentCost && !isMaxed;
  const stats = skill.getStats(currentLevel);

  let circleStyle = '';
  if (isMaxed) {
    circleStyle = 'bg-yellow-400 border-2 border-transparent shadow-[0_0_15px_rgba(250,204,21,0.6)]';
  } else if (currentLevel > 0) {
    circleStyle = canAfford ? 'bg-yellow-200 border-2 border-yellow-500 hover:scale-110 shadow-md' : 'bg-yellow-200 border-2 border-transparent hover:scale-110 shadow-sm';
  } else {
    circleStyle = canAfford ? 'bg-gray-100 border-2 border-yellow-400 hover:scale-110 shadow-md' : 'bg-gray-100 border-2 border-transparent hover:scale-110 shadow-sm opacity-90';
  }

  return (
    <div 
      className={`absolute pointer-events-auto transition-all ${isHovered || isAnimatingOut ? 'z-[100]' : 'z-10'}`}
      style={{ transform: `translate(${skill.gridX - 28}px, ${skill.gridY - 28}px)` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => { if (canAfford) unlockSkill(skill.id); }}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-200 cursor-pointer ${circleStyle}`}
      >
        {skill.icon}
        <div className="absolute -bottom-2 bg-gray-800 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
          {currentLevel}/{skill.maxLevel}
        </div>
      </button>

      {/* LE POP-UP (Ton design propre avec les données claires) */}
      <div 
        className={`absolute bottom-full left-1/2 pointer-events-none transition-opacity duration-200 z-[999]
          ${isHovered && !isAnimatingOut ? 'opacity-100' : 'opacity-0'}
        `}
        style={{ transform: `translate(-50%, -15px) scale(${1 / cameraScale})`, transformOrigin: 'bottom center' }}
      >
        <div className="bg-white border border-gray-200 p-3 rounded-xl shadow-2xl flex flex-col items-center w-56 text-center">
          
          {/* Titre et Explication */}
          <h3 className="font-bold text-sm text-gray-900">{skill.title}</h3>
          <p className="text-[11px] text-gray-500 font-medium leading-snug mt-0.5 mb-2">
            {skill.subtitle}
          </p>
          
          {/* Bloc de Données */}
          <div className="w-full bg-gray-50 rounded-lg p-2 border border-gray-100 flex flex-col items-center">
            {currentLevel === 0 ? (
              <>
                <div className="text-[12px] font-bold text-gray-700">{stats.current} ➔ {stats.next}</div>
                <div className="text-[10px] text-gray-500 font-medium mb-1.5">{stats.increment}</div>
                <div className="w-10 border-t border-gray-300 my-1.5" />
                <div className={`text-lg font-black tracking-tight ${canAfford ? 'text-gray-900' : 'text-red-500'}`}>
                  {currentCost} ⚡
                </div>
              </>
            ) : !isMaxed ? (
              <>
                <div className="text-[12px] font-bold text-gray-700 mb-1">Actuel : {stats.current}</div>
                <div className="text-[12px] font-semibold text-gray-600">
                  <span className={canAfford ? 'text-gray-900' : 'text-red-500'}>{currentCost} ⚡</span> : {stats.increment}
                </div>
              </>
            ) : (
              <>
                <div className="text-[12px] font-bold text-gray-700 mb-1">Actuel : {stats.current}</div>
                <div className="text-[12px] font-black text-green-600">
                  MAXIMUM
                </div>
              </>
            )}
          </div>

        </div>
        
        {/* La petite flèche du pop-up */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white drop-shadow-md" />
      </div>
    </div>
  );
}