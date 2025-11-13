import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';
import { logger } from '../utils/logger';

interface UseSocketOptions {
  matchId?: string;
  onMessage?: (message: any) => void;
  onError?: (error: any) => void;
}

export function useSocket({ matchId, onMessage, onError }: UseSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let mounted = true;

    const connectSocket = async () => {
      try {
        setIsConnecting(true);
        const token = await AsyncStorage.getItem('token');
        
        if (!token) {
          logger.warn('Token não encontrado para conexão Socket.IO');
          setIsConnecting(false);
          return;
        }

        logger.info(`Conectando Socket.IO em: ${API_URL}`);

        // Criar conexão Socket.IO (usa a mesma URL HTTP/HTTPS, Socket.IO converte automaticamente)
        const socket = io(API_URL, {
          auth: {
            token: token,
          },
          transports: ['websocket', 'polling'], // Tentar websocket primeiro, depois polling
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socketRef.current = socket;

        // Eventos de conexão
        socket.on('connect', () => {
          logger.info('✅ Socket.IO conectado');
          if (mounted) {
            setIsConnected(true);
            setIsConnecting(false);
          }

          // Entrar na sala do match se fornecido
          if (matchId) {
            socket.emit('join_match', matchId);
            logger.info(`📱 Entrou na sala do match: ${matchId}`);
          }
        });

        socket.on('disconnect', (reason) => {
          logger.warn(`❌ Socket.IO desconectado: ${reason}`);
          if (mounted) {
            setIsConnected(false);
          }
        });

        socket.on('connect_error', (error) => {
          logger.error('❌ Erro ao conectar Socket.IO:', error);
          if (mounted) {
            setIsConnected(false);
            setIsConnecting(false);
            if (onError) {
              onError(error);
            }
          }
        });

        // Evento de nova mensagem
        socket.on('new_message', (message) => {
          logger.info('💬 Nova mensagem recebida:', message);
          if (mounted && onMessage) {
            onMessage(message);
          }
        });

        // Evento de erro
        socket.on('error', (error) => {
          logger.error('❌ Erro no Socket.IO:', error);
          if (mounted && onError) {
            onError(error);
          }
        });

      } catch (error) {
        logger.error('❌ Erro ao configurar Socket.IO:', error);
        if (mounted) {
          setIsConnecting(false);
          if (onError) {
            onError(error);
          }
        }
      }
    };

    connectSocket();

    // Cleanup
    return () => {
      mounted = false;
      if (socketRef.current) {
        if (matchId) {
          socketRef.current.emit('leave_match', matchId);
        }
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
      setIsConnecting(false);
    };
  }, [matchId]); // Reconectar se matchId mudar

  // Função para enviar mensagem
  const sendMessage = (matchId: string, content: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send_message', {
        matchId,
        content,
      });
      logger.info('📤 Mensagem enviada via Socket.IO');
    } else {
      logger.warn('⚠️ Socket.IO não conectado, mensagem não enviada');
    }
  };

  // Função para entrar em uma sala de match
  const joinMatch = (matchId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join_match', matchId);
      logger.info(`📱 Entrou na sala do match: ${matchId}`);
    }
  };

  // Função para sair de uma sala de match
  const leaveMatch = (matchId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('leave_match', matchId);
      logger.info(`📱 Saiu da sala do match: ${matchId}`);
    }
  };

  return {
    isConnected,
    isConnecting,
    sendMessage,
    joinMatch,
    leaveMatch,
    socket: socketRef.current,
  };
}

