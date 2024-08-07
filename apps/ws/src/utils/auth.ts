import jwt from 'jsonwebtoken';
import { User } from '../SocketManager';
import { WebSocket } from 'ws';
import "dotenv/config";

const SECRET_KEY = process.env.SECRET_KEY || "my_secret_key";

export interface userJwtClaims {
  userId: string;
  name: string;
  isGuest?: boolean;
}

export const extractAuthUser = (token: string, ws: WebSocket): User => {
  const decoded = jwt.verify(token, SECRET_KEY!) as userJwtClaims;
  return new User(ws, decoded);
};
