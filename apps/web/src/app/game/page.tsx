"use client";

import useUserSocket from '@/hooks/useUserSocket';
import { useEffect } from 'react';
import { CONNECTED, INIT_GAME, START_GAME } from "@repo/messages";

function Footer() {
  return (
    <footer className="w-full bg-gray-800 py-4 mt-8">
      <div className="container mx-auto text-center text-gray-400">
        © 2024 Game Platform. All rights reserved.
      </div>
    </footer>
  );
}

function GameCard({ initGame }: { initGame: () => void }) {
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

export default function Game() {
  const { socket, user } = useUserSocket();

  useEffect(() => {
    if (!socket) {
      console.log("Socket not initialized");
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      console.log('Message received:', message);

      switch (message.type) {
        case CONNECTED:
          console.log(CONNECTED);
          break;
        case START_GAME:
          console.log(START_GAME);
          break;
        default:
          break;
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [socket]);

  function initGame() {
    if (!socket) {
      console.log("Socket not initialized");
      return;
    }

    socket.send(JSON.stringify({ type: INIT_GAME }));
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <main className="flex-grow flex items-center justify-center">
        <GameCard initGame={initGame} />
      </main>
      <Footer />
    </div>
  );
}
