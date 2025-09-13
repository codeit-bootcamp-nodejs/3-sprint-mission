import 'socket.io';

declare module 'socket.io' {
  interface Socket {
    data: {
      user?: { id: number }
    }
  }
}
