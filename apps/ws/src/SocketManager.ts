import { randomUUID } from "crypto";
import { WebSocket } from "ws";
import { userJwtClaims } from "./utils/auth";

export class User {
  public socket: WebSocket;
  public userId: string;
  public id: string;
  public name: string;
  public isGuest?: boolean;

  constructor(socket: WebSocket, userJwtClaims: userJwtClaims) {
    this.socket = socket;
    this.userId = userJwtClaims.userId;
    this.id = randomUUID();
    this.name = userJwtClaims.name;
    this.isGuest = userJwtClaims.isGuest;
  }
}

class SocketManager {
  private static instance: SocketManager;
  public roomUserMap: Map<string, User[]>;
  public userRoomMap: Map<string, string>;

  constructor() {
    this.roomUserMap = new Map();
    this.userRoomMap = new Map();
  }

  static getInstance() {
    if (SocketManager.instance) {
      return SocketManager.instance;
    }
    return new SocketManager();
  }

  addUser(user: User, roomId: string) {
    this.roomUserMap.set(roomId, [
      ...(this.roomUserMap.get(roomId) || []),
      user,
    ]);
    this.userRoomMap.set(user.id, roomId);
  }

  broadcast(roomId: string, message: string) {
    const users = this.roomUserMap.get(roomId);
    console.log(users);
    if (!users) {
      console.error("Room not found");
      return;
    }

    users.forEach((user) => {
      user.socket.send(message);
    });
  }
}

export const socketManager = SocketManager.getInstance();