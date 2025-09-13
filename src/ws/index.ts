import { Server } from 'socket.io';
import { socketAuth } from './socketAuth.js';
import { joinUserRoom } from './rooms.js';

const { BASE_URL } = process.env;
let ioRef: Server | null = null;

export const initWs = (httpServer: any) => {
  if (ioRef) return ioRef;

  const io = new Server(httpServer, {
    path: '/ws',
    cors: { origin: BASE_URL },
  });

  io.use(socketAuth());

  io.on('connection', (socket) => {
    const userId = socket.data?.user.id;
    if (typeof userId === 'number') joinUserRoom(socket, userId);
  });

  ioRef = io;
  return io;
};

export const getIO = () => {
  if (!ioRef) throw new Error('[WS] Ws not initialized');
  return ioRef;
};
