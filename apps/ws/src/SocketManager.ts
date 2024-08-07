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
    this.userRoomMap.set(user.userId, roomId);
  }

  broadcast(roomId: string, message: string) {
    const users = this.roomUserMap.get(roomId);

    if (!users) {
      // Room Not Found
      return;
    }

    users.forEach((user) => {
      user.socket.send(message);
    });
  }

  removeUser(user: User) {
    const roomId = this.userRoomMap.get(user.userId);
    if (!roomId) {
      // User not in any Room/Game
      return;
    }

    const room = this.roomUserMap.get(roomId) || [];
    const remainingUsers = room.filter(u => u.userId !== user.userId);
    this.roomUserMap.set(roomId, remainingUsers);
    if (this.roomUserMap.get(roomId)?.length === 0) {
      this.roomUserMap.delete(roomId);
    }
    this.userRoomMap.delete(user.userId);
  }
}

export const socketManager = SocketManager.getInstance();