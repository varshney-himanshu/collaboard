import { io } from "socket.io-client";
import keys from "./keys";

class Socket {
  static instances = new Map();

  static getInstance(boardId) {
    if (!Socket.instances.has(boardId)) {
      const socket = io(keys.socket_url, {
        query: { boardId },
        reconnectionDelay: 1000,
        reconnection: true,
        reconnectionAttempts: 10,
        transports: ["websocket"],
        agent: false,
        upgrade: false,
        rejectUnauthorized: false,
      });
      Socket.instances.set(boardId, socket);
    }
    return Socket.instances.get(boardId);
  }
}

export default Socket;
