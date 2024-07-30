import { WebSocket } from "ws";
import { Game } from "./Game";
import { GAME_ADDED, INIT_GAME } from "@repo/messages";
import { socketManager, User } from "./SocketManager";

export class GameManager {
  private games: Game[] = [];
  private pendingGameId: String | null;
  private users: User[];

  constructor() {
    this.games = [];
    this.pendingGameId = null;
    this.users = [];
  }

  addUser(user: User) {
    this.users.push(user);
    this.addHandler(user);
  }

  removeUser(ws: WebSocket) {
    this.users.filter(user => user.socket !== ws);
  }

  private addHandler(user: User) {
    user.socket.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.type === INIT_GAME) {
        if (this.pendingGameId) {
          // Join Game
          const game = this.games.find(x => x.gameId === this.pendingGameId);
          if (!game) {
            // console.error("Game not found");
            return;
          }

          if (user.id === game.player1) {
            // console.log("Trying to Connect with Yourself?");
          }

          socketManager.addUser(user, game.gameId);
          game.updateSecondPlayer(user.id);
          this.pendingGameId = null;
        } else {
          const game = new Game(user.id);
          this.games.push(game);
          this.pendingGameId = game.gameId;
          socketManager.addUser(user, game.gameId);
          socketManager.broadcast(game.gameId, JSON.stringify({ type: GAME_ADDED, game_id: game.gameId }));
        }
      }
    });
  }
}