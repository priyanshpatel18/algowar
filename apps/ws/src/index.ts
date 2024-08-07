import url from "url";
import { WebSocket, WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import { extractAuthUser } from "./utils/auth";
import { CONNECTED, HEARTBEAT } from "@repo/messages";

const wss = new WebSocketServer({ port: 8080 });
const gameManager = new GameManager();

wss.on("connection", (ws: WebSocket, req: Request) => {
  // Retrieve token from query params
  const queryParams = url.parse(req.url, true).query;
  // Check if token is provided
  const token: string | undefined = typeof queryParams.token === 'string' ? queryParams.token : undefined;

  if (!token) {
    ws.close(4001, 'Token not provided');
    return;
  }

  const user = extractAuthUser(token, ws);
  gameManager.addUser(user);
  ws.send(JSON.stringify({ type: CONNECTED, user: user.id }));

  // Heartbeat Algorithm
  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());

    if (message.type === HEARTBEAT) {
      ws.send(JSON.stringify({ type: HEARTBEAT }));
    }
  });

  ws.on("close", () => {
    gameManager.removeUser(ws);
  });
});

console.log("Listening on port 8080");