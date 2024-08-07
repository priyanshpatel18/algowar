"use client";

import ConnectionStatus from '@/components/ConnectionStatus';
import Timer from '@/components/Timer';
import { Button } from '@/components/ui/button';
import useUserSocket from '@/hooks/useUserSocket';
import { CONNECTED, EXIT_GAME, GAME_ADDED, GAME_ENDED, GAME_IN_PROGRESS, INIT_GAME, PLAYER_DISCONNECTED, PLAYER_RECONNECTED } from "@repo/messages";
import { useEffect, useState } from 'react';

type BUTTON_TEXT = "Play a match" | "Waiting for Opponent" | "Game Started" | "Game Ended";
type GAME_RESULT = "WIN" | "LOSS" | "DRAW";

export default function Game() {
  const { socket, user, connectionType } = useUserSocket();
  const [buttonText, setButtonText] = useState<BUTTON_TEXT>("Play a match");
  const [gameId, setGameId] = useState<string>("");
  const [opponent, setOpponent] = useState<{ name: string, id: string } | null>(null);
  const [gameResult, setGameResult] = useState<GAME_RESULT>("DRAW");
  const [startTime, setStartTime] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case CONNECTED:
          break;
        case GAME_ADDED:
          setButtonText("Waiting for Opponent");
          setGameId(message.gameId);
          setOpponent(null);
          break;
        case GAME_IN_PROGRESS:
          setButtonText("Game Started");
          setGameId(message.payload.gameId);
          const startTime = message.payload.startTime;
          setStartTime(new Date(startTime).toISOString());

          const { player1, player2 } = message.payload;
          // Determine the opponent based on user ID
          if (user?.id === player1.id) {
            setOpponent(player2);
          } else if (user?.id === player2.id) {
            setOpponent(player1);
          }
          break;
        case GAME_ENDED:
          setButtonText("Game Ended");
          const result = message.payload.result;
          const player1Id = message.payload.player1.id;
          const player2Id = message.payload.player2.id;
          setStartTime(undefined);

          if (user?.id === player1Id) {
            setGameResult(result === "PLAYER_ONE_WINS" ? "WIN" : result === "PLAYER_TWO_WINS" ? "LOSS" : "DRAW");
          } else if (user?.id === player2Id) {
            setGameResult(result === "PLAYER_TWO_WINS" ? "WIN" : result === "PLAYER_ONE_WINS" ? "LOSS" : "DRAW");
          }
          break;
        case PLAYER_DISCONNECTED:
          console.log(message);
          break;
        case PLAYER_RECONNECTED:
          console.log(message);
          break;
        default:
          break;
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [socket, user]);

  function initGame() {
    if (!socket) {
      console.log("Socket not initialized");
      return;
    }

    socket.send(JSON.stringify({ type: INIT_GAME }));
  }

  function exitGame() {
    if (!socket) {
      console.log("Socket not initialized");
      return;
    }

    socket.send(JSON.stringify({
      type: EXIT_GAME,
      payload: {
        gameId
      }
    }));
  }

  function handleReset() {
    setButtonText("Play a match");
    setOpponent(null);
    setGameResult("DRAW");
  };

  const getOpponentName = () => opponent ? opponent.name : "?";

  return (
    <div className="text-primary-foreground relative flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <main className="flex-grow flex items-center justify-center">
        <div className="flex flex-col p-8 max-w-md mx-auto bg-white rounded-2xl shadow-xl space-y-6">
          <Timer startTime={startTime} />
          <h2 className="text-center text-3xl font-bold text-gray-800">
            {buttonText === "Play a match" ? "Game Initialization" : buttonText === "Waiting for Opponent" ? "Waiting for Opponent" : buttonText === "Game Started" ? "Game in Progress" : "Game Ended"}
          </h2>
          <h2 className="text-center text-2xl font-bold text-gray-800">Hey, {user?.name}</h2>
          {buttonText === "Waiting for Opponent" && (
            <div className="flex items-center justify-center space-x-4 mt-4">
              <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <p className="text-lg font-semibold">{user?.name}</p>
              </div>
              <p className="text-lg">VS</p>
              <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <p className="text-lg font-semibold">{getOpponentName()}</p>
              </div>
            </div>
          )}
          {buttonText !== "Waiting for Opponent" && (
            <p className="text-center text-lg text-gray-600">
              {buttonText === "Play a match" ? "Click the button below to initialize the game." : buttonText === "Game Started" ? `${user?.name} VS ${getOpponentName()}` : gameResult === "WIN" ? "You Won!" : gameResult === "LOSS" ? "You Lost!" : "Draw!"}
            </p>
          )}
          {buttonText === "Game Ended" && (
            <Button
              onClick={handleReset}
              className="w-full bg-blue-500 text-white font-semibold hover:bg-blue-600"
            >
              Start a New Game
            </Button>
          )}
          {buttonText === "Play a match" && (
            <Button
              disabled={!connectionType || connectionType === "offline"}
              onClick={initGame}
              className="w-full bg-blue-500 text-white font-semibold hover:bg-blue-600"
            >
              {buttonText}
            </Button>
          )}
          {buttonText === "Game Started" && (
            <Button
              disabled={connectionType === "offline"}
              onClick={exitGame}
              className="w-full bg-red-500 text-white font-semibold hover:bg-red-600"
            >
              Exit Game
            </Button>
          )}
        </div>
      </main>
      <ConnectionStatus connectionType={connectionType} />
    </div>
  );
}
