'use client';

export default function CentralStar() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex items-center justify-center">
      
      {/* 1. Halo Gigantesque (L'éclat lointain dans le vide) */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full opacity-40 animate-[pulse_6s_ease-in-out_infinite]"
        style={{ 
          background: 'radial-gradient(circle, rgba(251,146,60,0.2) 0%, rgba(234,88,12,0.05) 40%, rgba(0,0,0,0) 70%)' 
        }} 
      />
      
      {/* 2. La Couronne Solaires & Éruptions (Couche tournante asymétrique) */}
      <div 
        className="absolute w-[220px] h-[220px] rounded-full opacity-70 mix-blend-screen animate-[spin_30s_linear_infinite]"
        style={{ 
          background: 'conic-gradient(from 0deg, transparent 0%, rgba(253,224,71,0.6) 15%, transparent 25%, rgba(245,158,11,0.5) 45%, transparent 55%, rgba(250,204,21,0.7) 75%, transparent 85%, rgba(234,88,12,0.4) 95%, transparent 100%)',
          filter: 'blur(12px)'
        }} 
      />
      
      {/* 3. La Chromosphère (Bordure de flamme vibrante) */}
      <div 
        className="absolute w-44 h-44 rounded-full opacity-90 animate-[pulse_2s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0) 60%, rgba(249,115,22,0.8) 80%, rgba(234,88,12,0) 100%)',
          filter: 'blur(4px)'
        }}
      />

      {/* 4. Le Corps de l'Étoile (La Photosphère avec effet 3D "Limb Darkening") */}
      <div 
        className="absolute w-40 h-40 rounded-full"
        style={{ 
          // Dégradé radial pour le volume : Blanc (Hyper chaud) -> Jaune -> Orange brûlé
          background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #fef08a 30%, #f59e0b 70%, #9a3412 100%)',
          // Ombre interne pour creuser les bords + Ombre externe pour l'éclat de contact
          boxShadow: 'inset 0 0 25px rgba(0,0,0,0.6), 0 0 50px rgba(253,224,71,0.6)'
        }} 
      />
      
    </div>
  );
}