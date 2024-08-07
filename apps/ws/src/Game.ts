import { AUTH_PROVIDER, db, User as DBUser, GAME_RESULT, GAME_STATUS } from "@repo/database";
import { GAME_ADDED, GAME_ENDED, GAME_IN_PROGRESS } from "@repo/messages";
import { v4 as uuidv4 } from "uuid";
import { socketManager, User } from "./SocketManager";
import { GameManager } from "./GameManager";

export class Game {
  public gameId: string;
  public player1: string;
  public player2: string | null;
  public status: GAME_STATUS;
  public result: GAME_RESULT | null;
  private startTime: Date;
  private timeOutTime: Date;
  public cachedUsers: DBUser[] = [];
  public timeOutHandle: NodeJS.Timeout | null;

  constructor(player1: string, player2?: string) {
    this.gameId = uuidv4();
    this.player1 = player1;
    this.player2 = player2 ?? null;
    this.startTime = new Date();
    this.timeOutTime = new Date(this.startTime.getTime() + 1 * 60 * 1000);

    this.timeOutHandle = null;
    this.handleSetTimeout();

    this.status = "WAITING_FOR_OPPONENT";
    this.result = null;

    socketManager.broadcast(this.gameId, JSON.stringify({ type: GAME_ADDED, gameId: this.gameId }));
  }

  private handleSetTimeout() {
    const timeLeft = this.getTimeOutTime().getTime() - new Date().getTime();
    this.timeOutHandle = setTimeout(() => {
      this.endGame("TIMEOUT", "DRAW");
      GameManager.getInstance().removeGame(this.gameId);
      this.clearTimeOutHandle();
    }, timeLeft);
  }

  clearTimeOutHandle() {
    if (this.timeOutHandle) {
      clearTimeout(this.timeOutHandle);
    }
  }

  getStartTime() {
    return this.startTime;
  }

  getTimeOutTime() {
    return this.timeOutTime;
  }

  async updateSecondPlayer(playerTwo: string) {
    this.player2 = playerTwo;

    const users = await db.user.findMany({ where: { id: { in: [this.player1, this.player2 ?? ""] } } });
    if (!users) {
      console.log("Player 2 not found");
      return;
    }

    try {
      const game = await this.createGameInDB();

      this.sendGameMessage(GAME_IN_PROGRESS, users, game.startTime);
    } catch (error) {
      console.error(error);
      return;
    }

  }

  sendGameMessage(type: string, users: DBUser[], startTime: Date) {
    const player1 = users.find(user => user.id === this.player1);
    const player2 = users.find(user => user.id === this.player2);

    socketManager.broadcast(this.gameId, JSON.stringify({
      type: type,
      payload: {
        gameId: this.gameId,
        status: type,
        player1: {
          name: player1?.name,
          id: this.player1,
          isGuest: player1?.provider === AUTH_PROVIDER.GUEST,
        },
        player2: {
          name: player2?.name,
          id: this.player2,
          isGuest: player2?.provider === AUTH_PROVIDER.GUEST,
        },
        startTime
      }
    }));
  }

  async createGameInDB() {
    this.startTime = new Date(Date.now());

    const game = await db.game.create({
      data: {
        id: this.gameId,
        status: "IN_PROGRESS",
        players: {
          connect: [
            { id: this.player1 },
            { id: this.player2 ?? "" }
          ]
        },
        timeOutTime: this.timeOutTime,
      },
      include: {
        players: true,
      },
    });
    this.gameId = game.id;
    this.cachedUsers = game.players;
    this.status = "IN_PROGRESS";

    return game;
  }

  exitGame(user: User) {
    this.endGame("PLAYER_EXIT", user.userId === this.player1 ? "PLAYER_TWO_WINS" : "PLAYER_ONE_WINS");
  }

  async endGame(status: GAME_STATUS, result: GAME_RESULT) {
    const updatedGame = await db.game.update({
      where: { id: this.gameId },
      data: {
        status: status,
        result: result,
        endTime: new Date(),
      },
      include: {
        players: true,
      },
    });

    const player1 = updatedGame.players.find(user => user.id === this.player1);
    const player2 = updatedGame.players.find(user => user.id === this.player2);

    socketManager.broadcast(
      this.gameId,
      JSON.stringify({
        type: GAME_ENDED,
        payload: {
          result,
          status,
          player1: {
            id: player1?.id,
            name: player1?.name,
          },
          player2: {
            id: player2?.id,
            name: player2?.name,
          },
        },
      }),
    );
  }
}