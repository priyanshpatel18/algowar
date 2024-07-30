import { useEffect, useRef } from 'react';

const WS_URL = 'ws://localhost:8080';

interface useSocketProps {
  token: string | null;
}

export function useSocket({ token }: useSocketProps) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (token) {
      const ws = new WebSocket(`${WS_URL}?token=${token}`);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("Connected");
      };

      ws.onclose = () => {
        console.log("Disconnected");
      };

      return () => {
        console.log("Disconnecting");
        ws.close();
      };
    }
  }, [token]);

  return socketRef.current;
}
