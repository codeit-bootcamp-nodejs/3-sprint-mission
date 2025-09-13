import type { Socket } from 'socket.io';
import { verifyAccessToken } from '../auth/tokenUtils.js';

const extractToken = (socket: Socket): string | null => {
  const queryToken =
    typeof socket.handshake.query?.token === "string"
      ? socket.handshake.query.token
      : null;

  const headerAuth = socket.handshake.headers?.authorization;
  const headerToken = typeof headerAuth === "string" && headerAuth.startsWith("Bearer ")
    ? headerAuth.slice("Bearer ".length).trim()
    : null;

  return queryToken ?? headerToken ?? null;
};

export const socketAuth = () => async (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = extractToken(socket);
    if (!token) return next(new Error('unauthorized'));

    const payload = verifyAccessToken(token);
    if (!payload?.id) return next(new Error('unauthorized'));

    socket.data.user = { id: payload.id };
    next();
  } catch {
    next(new Error('unauthorized'));
  }
};
