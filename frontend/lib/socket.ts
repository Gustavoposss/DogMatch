import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

let socket: Socket | null = null;

export const getSocket = (token?: string): Socket => {
  // Se já existe um socket conectado, reutilizar
  if (socket?.connected) {
    console.log('♻️ Reutilizando socket existente');
    return socket;
  }

  // Se existe mas não está conectado, reconectar
  if (socket && !socket.connected) {
    console.log('🔄 Reconectando socket existente');
    socket.connect();
    return socket;
  }

  // Criar novo socket
  console.log('🆕 Criando novo socket');
  const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  
  socket = io(SOCKET_URL, {
    auth: {
      token: authToken,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
    forceNew: false, // Reutilizar conexão se possível
  });

  // Adicionar listeners globais (apenas uma vez por socket)
  socket.on('connect', () => {
    console.log('✅ Socket.IO conectado com sucesso');
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket.IO desconectado:', reason);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log(`🔄 Socket.IO reconectado após ${attemptNumber} tentativas`);
  });

  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log(`🔄 Tentativa de reconexão ${attemptNumber}...`);
  });

  socket.on('reconnect_error', (error) => {
    console.error('❌ Erro ao reconectar Socket.IO:', error);
  });

  socket.on('reconnect_failed', () => {
    console.error('❌ Falha ao reconectar Socket.IO após várias tentativas');
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

