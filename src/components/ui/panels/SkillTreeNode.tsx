import { useGameStore } from '@/store/gameStore';
import { SkillDef } from '@/game/skills';

interface Props {
  skill: SkillDef;
  cameraScale: number;
}

export default function SkillTreeNode({ skill, cameraScale }: Props) {
  const energy = useGameStore(state => state.energy);
  const unlockedSkills = useGameStore(state => state.unlockedSkills);
  const unlockSkill = useGameStore(state => state.unlockSkill);

  const isUnlocked = unlockedSkills.includes(skill.id);
  const isAvailable = skill.parent === null || unlockedSkills.includes(skill.parent);
  if (!isUnlocked && !isAvailable) return null;

  const canAfford = energy >= skill.cost;

  // L'application de tes règles de design :
  let circleStyle = '';
  let iconColor = '';
  
  if (isUnlocked) {
    // Acquis : Plein jaune, SANS BORDURE (transparent)
    circleStyle = 'bg-yellow-400 border-2 border-transparent shadow-[0_0_20px_rgba(250,204,21,0.6)]';
    iconColor = 'text-black';
  } else if (isAvailable && canAfford) {
    // Achetable : Fond gris clair, bord fin doré
    circleStyle = 'bg-gray-200 border-2 border-yellow-400 hover:scale-110 cursor-pointer shadow-md';
    iconColor = 'text-gray-700';
  } else {
    // Trop cher : Fond gris foncé, bord gris
    circleStyle = 'bg-gray-300 border-2 border-gray-400 opacity-80 cursor-not-allowed';
    iconColor = 'text-gray-500';
  }

  return (
    <div 
      // L'ajout de z-10 et group-hover:z-[100] règle définitivement le problème de superposition !
      className="absolute group pointer-events-auto z-10 group-hover:z-[100]"
      style={{ transform: `translate(${skill.x - 28}px, ${skill.y - 28}px)` }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!isUnlocked && canAfford) unlockSkill(skill.id, skill.cost);
        }}
        disabled={isUnlocked || !canAfford}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${circleStyle}`}
      >
        <div className={iconColor}>{skill.icon}</div>
      </button>

      {/* Pop-up avec la taille anti-zoom */}
      <div 
        className="absolute bottom-full left-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          transform: `translate(-50%, -15px) scale(${1 / cameraScale})`,
          transformOrigin: 'bottom center'
        }}
      >
        <div className="bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-xl flex flex-col gap-3 text-gray-800 w-56">
          <h3 className="font-bold text-sm">{skill.title}</h3>
          
          <div className="flex justify-between items-end border-t border-gray-300 pt-3">
            {/* Texte ultra court */}
            <span className="text-sm font-bold text-blue-600 leading-tight">
              {skill.effect}
            </span>
            
            {!isUnlocked ? (
              <span className={`text-sm font-black whitespace-nowrap ${canAfford ? 'text-gray-900' : 'text-red-500'}`}>
                {skill.cost} ⚡
              </span>
            ) : (
              <span className="text-xs font-black text-green-600">ACQUIS</span>
            )}
          </div>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-100" />
      </div>
    </div>
  );
}