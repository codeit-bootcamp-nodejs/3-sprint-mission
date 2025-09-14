import type { Socket } from "socket.io";

export const userRoom = (userId: number) => `user:${userId}`;

export const joinUserRoom = (socket: Socket, userId: number) => {
  socket.join(userRoom(userId));
};

export const leaveUserRoom = (socket: Socket, userId: number) => {
  socket.leave(userRoom(userId));
};
