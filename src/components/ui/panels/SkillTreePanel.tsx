'use client';

import { useState, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { SKILLS } from '@/game/skills';
import SkillTreeNode from './SkillTreeNode';

export default function SkillTreePanel() {
  const isOpen = useGameStore(state => state.isSkillTreeOpen);
  const unlockedSkills = useGameStore(state => state.unlockedSkills);

  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 1 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    setCamera(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
  };

  const handleMouseUp = () => isDragging.current = false;

  const handleWheel = (e: React.WheelEvent) => {
    const zoomDirection = e.deltaY > 0 ? -1 : 1;
    setCamera(prev => {
      const newScale = Math.max(0.3, Math.min(2, prev.scale + (zoomDirection * 0.05)));
      
      // FORMULE DE ZOOM SUR CURSEUR
      const ratio = newScale / prev.scale;
      
      // On trouve le centre exact de l'écran
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // On calcule la distance de la souris par rapport au centre
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // On translate la grille en sens inverse pour garder le point sous la souris
      const newX = prev.x * ratio - mouseX * (ratio - 1);
      const newY = prev.y * ratio - mouseY * (ratio - 1);

      return { x: newX, y: newY, scale: newScale };
    });
  };

  return (
    <div 
      // L'animation de glissement : Si fermé, -translate-x-full (caché à gauche)
      className={`fixed inset-0 z-30 bg-slate-50 overflow-hidden select-none cursor-grab active:cursor-grabbing transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
      }`}
      style={{
        backgroundImage: 'radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px)',
        // Le secret d'une grille synchro : elle s'adapte à la caméra !
        backgroundSize: `${80 * camera.scale}px ${80 * camera.scale}px`,
        backgroundPosition: `calc(50% + ${camera.x}px) calc(50% + ${camera.y}px)`
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      
      <div 
        className="absolute top-1/2 left-1/2 w-0 h-0 pointer-events-none"
        style={{ transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})` }}
      >
        {/* Les traits */}
        <svg className="absolute overflow-visible z-0 pointer-events-none">
          {SKILLS.map(skill => {
            if (!skill.parent) return null;
            const parentSkill = SKILLS.find(s => s.id === skill.parent);
            if (!parentSkill || !unlockedSkills.includes(parentSkill.id)) return null;

            return (
              <line 
                key={`line-${skill.id}`}
                x1={parentSkill.x} y1={parentSkill.y} 
                x2={skill.x} y2={skill.y} 
                stroke="#94a3b8" strokeWidth="3" strokeDasharray="6 8"
                className="animate-in fade-in duration-500"
              />
            );
          })}
        </svg>

        {/* L'appel à notre nouveau composant Nœud allégé */}
        {SKILLS.map(skill => (
          <SkillTreeNode 
            key={skill.id} 
            skill={skill} 
            cameraScale={camera.scale} 
          />
        ))}
      </div>
    </div>
  );
}