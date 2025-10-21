import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface UseSocketOptions {
  onNewMatch?: (data: any) => void;
  onPetCreated?: (data: any) => void;
  onPetUpdated?: (data: any) => void;
  onPetDeleted?: (data: any) => void;
}

export function useSocket(options: UseSocketOptions = {}) {
  const socketRef = useRef<Socket | null>(null);
  const {
    onNewMatch,
    onPetCreated,
    onPetUpdated,
    onPetDeleted
  } = options;

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return;
    }

    // Conectar ao Socket.IO com autenticação
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    // Eventos de conexão
    socket.on('connect', () => {
      console.log('✅ Conectado ao Socket.IO');
    });

    socket.on('disconnect', () => {
      console.log('❌ Desconectado do Socket.IO');
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Erro de conexão:', error.message);
    });

    // Eventos personalizados
    if (onNewMatch) {
      socket.on('new_match', onNewMatch);
    }

    if (onPetCreated) {
      socket.on('pet_created', onPetCreated);
    }

    if (onPetUpdated) {
      socket.on('pet_updated', onPetUpdated);
    }

    if (onPetDeleted) {
      socket.on('pet_deleted', onPetDeleted);
    }

    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, [onNewMatch, onPetCreated, onPetUpdated, onPetDeleted]);

  return socketRef.current;
}

