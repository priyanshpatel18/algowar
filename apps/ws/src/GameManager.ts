import { db } from "@repo/database";
import { EXIT_GAME, GAME_ADDED, GAME_ALERT, GAME_ENDED, GAME_IN_PROGRESS, INIT_GAME, PLAYER_DISCONNECTED, PLAYER_RECONNECTED } from "@repo/messages";
import { WebSocket } from "ws";
import { Game } from "./Game";
import { socketManager, User } from "./SocketManager";

export class GameManager {
  private static instance: GameManager;
  private games: Game[] = [];
  private pendingGameId: String | null;
  private users: User[];

  constructor() {
    this.games = [];
    this.pendingGameId = null;
    this.users = [];
  }

  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  async addUser(user: User) {
    this.users.push(user);
    this.addHandler(user);
    await this.handleReconnection(user);
  }

  removeUser(ws: WebSocket) {
    const user = this.users.find((user) => user.socket === ws);
    if (!user) {
      // User Not Found
      return;
    }

    // Remove Pending Game
    if (this.pendingGameId) {
      const pendingGame = this.games.find(game => game.gameId === this.pendingGameId);
      if (pendingGame && pendingGame.player1 === user.userId) {
        this.pendingGameId = null;
      }
    }

    // Alert Other Users
    const existingGame = this.games.find((game) => game.player1 === user.userId || game.player2 === user.userId);

    if (existingGame) {
      socketManager.broadcast(existingGame.gameId, JSON.stringify({
        type: PLAYER_DISCONNECTED,
        message: {
          userId: user.userId,
          gameId: existingGame.gameId,
          name: user.name,
        }
      }));
    }
    this.users = this.users.filter((user) => user.socket !== ws);
    socketManager.removeUser(user);
  }

  removeGame(gameId: string) {
    this.games = this.games.filter((g) => g.gameId !== gameId);
  }

  private addHandler(user: User) {
    user.socket.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.type === INIT_GAME) {
        if (this.pendingGameId) {
          // Join Game
          const game = this.games.find(x => x.gameId === this.pendingGameId);
          if (!game) {
            // Game Not Found
            return;
          }

          if (user.userId === game.player1) {
            socketManager.broadcast(game.gameId, JSON.stringify({
              type: GAME_ALERT,
              message: "Trying to Connect with Yourself?"
            }));
            return;
          }

          socketManager.addUser(user, game.gameId);
          game.updateSecondPlayer(user.userId);
          this.pendingGameId = null;
        } else {
          const game = new Game(user.userId);
          this.games.push(game);
          this.pendingGameId = game.gameId;
          socketManager.addUser(user, game.gameId);
          socketManager.broadcast(game.gameId, JSON.stringify({ type: GAME_ADDED, gameId: game.gameId }));
        }
      }

      if (message.type === EXIT_GAME) {
        const gameId = message.payload.gameId;

        if (gameId) {
          const game = this.games.find(game => game.gameId === gameId);
          if (game) {
            game.exitGame(user);
            this.removeGame(gameId);
          }
        }
      }
    });
  }

  async handleReconnection(user: User) {
    const userInGame = this.games.find(game => game.player1 === user.userId || game.player2 === user.userId && game.status === "IN_PROGRESS");

    if (userInGame) {
      socketManager.addUser(user, userInGame.gameId);

      if (userInGame.cachedUsers.length > 0) {
        userInGame.sendGameMessage(GAME_IN_PROGRESS, userInGame.cachedUsers, userInGame.getStartTime());
      } else {
        const game = await db.game.findUnique({
          where: { id: userInGame.gameId },
          include: {
            players: true,
          },
        });
        if (game) {
          userInGame.cachedUsers = game.players;
          console.log(game.players);

          userInGame.sendGameMessage(GAME_IN_PROGRESS, game.players, game.startTime);
        }
      }
      socketManager.broadcast(userInGame.gameId, JSON.stringify({
        type: PLAYER_RECONNECTED,
        message: {
          userId: user.userId,
          gameId: userInGame.gameId,
          name: user.name,
        }
      }));
    }
  }
}