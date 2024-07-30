import { v4 as uuidv4 } from "uuid";
import { INIT_GAME, START_GAME } from "@repo/messages";
import { socketManager } from "./SocketManager";

type GAME_STATUS = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "PLAYER_DISCONNECTED" | "TIMEOUT";
type GAME_RESULT = "DRAW" | "PLAYER_1" | "PLAYER_2";

export class Game {
  public gameId: string;
  public player1: string;
  public player2: string | null;
  public status: GAME_STATUS;
  public result: GAME_RESULT | null;
  private startTime: Date;

  constructor(player1: string, player2?: string) {
    this.gameId = uuidv4();
    this.player1 = player1;
    this.player2 = player2 ?? null;
    this.startTime = new Date();

    this.status = "PENDING";
    this.result = null;

    socketManager.broadcast(this.gameId, JSON.stringify({ type: INIT_GAME, game_id: this.gameId }));
  }

  updateSecondPlayer(player2: string) {
    this.player2 = player2;
    socketManager.broadcast(this.gameId, JSON.stringify({ type: START_GAME, game_id: this.gameId }));
  }
}