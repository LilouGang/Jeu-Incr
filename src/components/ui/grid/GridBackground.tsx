'use client';

export default function GridBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-white overflow-hidden pointer-events-none">
      {/* 1. La grille de base très discrète */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          backgroundPosition: 'center center'
        }}
      />
      
      {/* 2. L'attraction vers le centre (Illusion d'optique en SVG) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40">
        <svg width="600" height="600" viewBox="0 0 600 600" className="animate-spin-slow">
          {Array.from({ length: 36 }).map((_, i) => {
            // On calcule et on arrondit à 2 décimales pour éviter l'erreur d'hydratation
            const x2 = (300 + Math.cos((i * 10) * (Math.PI / 180)) * 300).toFixed(2);
            const y2 = (300 + Math.sin((i * 10) * (Math.PI / 180)) * 300).toFixed(2);
            
            return (
              <line 
                key={i}
                x1="300" y1="300" 
                x2={x2} 
                y2={y2} 
                stroke="#d1d5db" 
                strokeWidth="1"
              />
            );
          })}
        </svg>
      </div>

      {/* 3. Le point central (La singularité) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-400 rounded-full shadow-[0_0_10px_rgba(156,163,175,0.8)]" />
    </div>
  );
}