export default function GameCard({ initGame }: { initGame: () => void }) {
  return (
    <div className="p-8 max-w-sm mx-auto bg-white rounded-2xl shadow-xl space-y-6">
      <h2 className="text-center text-3xl font-bold text-gray-800">Game Initialization</h2>
      <p className="text-center text-lg text-gray-600">
        Click the button below to initialize the game.
      </p>
      <button
        onClick={initGame}
        className="w-full px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
      >
        Init Game
      </button>
    </div>
  );
}