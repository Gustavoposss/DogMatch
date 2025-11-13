'use client';

import { useEffect, useRef, useState } from 'react';
import { getSocket, disconnectSocket } from '@/lib/socket';
import { Message } from '@/types';
import { authService } from '@/lib/auth';

interface UseSocketOptions {
  matchId?: string;
  onMessage?: (message: Message) => void;
  onError?: (error: Error) => void;
}

export function useSocket({ matchId, onMessage, onError }: UseSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);

  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      return;
    }

    setIsConnecting(true);
    const socket = getSocket(token);
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setIsConnecting(false);
      
      // Entrar na sala do match se fornecido
      if (matchId) {
        socket.emit('join_match', matchId);
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('new_message', (message: Message) => {
      if (onMessage) {
        onMessage(message);
      }
    });

    socket.on('error', (error: any) => {
      if (onError) {
        onError(new Error(error.message || 'Erro no Socket.IO'));
      }
    });

    return () => {
      if (matchId) {
        socket.emit('leave_match', matchId);
      }
      disconnectSocket();
    };
  }, [matchId, onMessage, onError]);

  const sendMessage = (matchId: string, content: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send_message', {
        matchId,
        content,
      });
    }
  };

  return {
    isConnected,
    isConnecting,
    sendMessage,
  };
}

