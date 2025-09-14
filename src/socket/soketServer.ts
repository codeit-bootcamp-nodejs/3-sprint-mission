import { Server, Socket } from "socket.io";
import http from "http";
import { authenticateTokenWithAuth } from "../middlewares/socketJwt";
import { EventType } from "./notification.dto";
import { notificationRead, setupNotificationEventBus } from "./notification.handler";


let io: Server | null = null;

export function createSocketServer(server: http.Server) {
  if (io) return io; 

  io = new Server(server, {
    path: "/notification",
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.use(authenticateTokenWithAuth);

  io.on(EventType.CONNECTION, (socket: Socket) => {
    const userId = socket.data.user.userId;
    console.log("사용자가 연결되었습니다:", userId);

    socket.join(`notification:${userId}`);
    notificationRead(socket);

    socket.on(EventType.DISCONNECT, () => {
      console.log("사용자가 연결을 끊었습니다:", userId);
    });
  });
  setupNotificationEventBus(io);

  console.log("Socket.IO 서버가 초기화되었습니다.");
  return io;
}