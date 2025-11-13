import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

let socket: Socket | null = null;

export const getSocket = (token?: string): Socket => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token: token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null),
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
  });

  socket.on('connect', () => {
    console.log('✅ Socket.IO conectado');
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket.IO desconectado');
  });

  socket.on('error', (error) => {
    console.error('❌ Erro no Socket.IO:', error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default getSocket;

