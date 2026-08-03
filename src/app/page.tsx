export default function Game() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-gray-900 text-white">
      {/* C'est ici que nous viendrons insérer le Canvas 3D de React Three Fiber */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1>Chargement du jeu...</h1>
      </div>
    </main>
  );
}