'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
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
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);

  // Atualizar refs quando callbacks mudarem
  useEffect(() => {
    onMessageRef.current = onMessage;
    onErrorRef.current = onError;
  }, [onMessage, onError]);

  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      console.warn('⚠️ Token não encontrado para Socket.IO');
      return;
    }

    setIsConnecting(true);
    const socket = getSocket(token);
    socketRef.current = socket;

    const handleConnect = () => {
      console.log('✅ Socket.IO conectado');
      console.log('✅ Socket ID:', socket.id);
      setIsConnected(true);
      setIsConnecting(false);
      
      // Entrar na sala do match se fornecido (mesmo se já estiver conectado)
      if (matchId) {
        console.log(`📱 Emitindo join_match para matchId: ${matchId}`);
        socket.emit('join_match', matchId, (response: any) => {
          console.log('📱 Resposta do join_match:', response);
        });
      }
    };

    const handleDisconnect = () => {
      console.log('❌ Socket.IO desconectado');
      setIsConnected(false);
    };

    const handleNewMessage = (message: any) => {
      console.log('💬 ===== NOVA MENSAGEM RECEBIDA VIA SOCKET.IO =====');
      console.log('💬 Mensagem completa:', message);
      console.log('💬 Tipo da mensagem:', typeof message);
      console.log('💬 Estrutura da mensagem:', JSON.stringify(message, null, 2));
      console.log('💬 matchId da mensagem:', message.matchId);
      console.log('💬 matchId esperado:', matchId);
      
      // Verificar se a mensagem é para este match
      if (matchId && message.matchId && message.matchId !== matchId) {
        console.log('⚠️ Mensagem ignorada - não é para este match');
        return;
      }
      
      if (onMessageRef.current) {
        console.log('💬 Callback onMessage existe, chamando...');
        try {
          onMessageRef.current(message);
          console.log('✅ Callback onMessage executado com sucesso');
        } catch (error) {
          console.error('❌ Erro ao executar callback onMessage:', error);
        }
      } else {
        console.warn('⚠️ Callback onMessage não existe!');
      }
      console.log('💬 ===== FIM DO HANDLER DE MENSAGEM =====');
    };

    const handleError = (error: any) => {
      console.error('❌ Erro no Socket.IO:', error);
      if (onErrorRef.current) {
        onErrorRef.current(new Error(error.message || 'Erro no Socket.IO'));
      }
    };

    // Adicionar listeners (remover antes para evitar duplicatas)
    socket.off('connect', handleConnect);
    socket.off('disconnect', handleDisconnect);
    socket.off('new_message', handleNewMessage);
    socket.off('error', handleError);
    
    // Adicionar listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('new_message', handleNewMessage);
    socket.on('error', handleError);
    
    console.log('👂 Listeners do Socket.IO registrados para matchId:', matchId);
    console.log('📡 Socket conectado?', socket.connected);
    console.log('📡 Socket ID:', socket.id);

    // Se já estiver conectado, entrar na sala imediatamente
    if (socket.connected) {
      console.log('✅ Socket já está conectado, entrando na sala...');
      handleConnect();
    } else {
      console.log('⏳ Aguardando conexão do socket...');
    }
    
    // Adicionar listener de teste para debug (remover depois)
    (socket as any).once('new_message', (testMsg: any) => {
      console.log('🧪 TESTE: Mensagem recebida no listener de teste:', testMsg);
    });

    return () => {
      console.log('🧹 Limpando Socket.IO...');
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('new_message', handleNewMessage);
      socket.off('error', handleError);
      
      if (matchId) {
        console.log(`📱 Saindo da sala do match: ${matchId}`);
        socket.emit('leave_match', matchId);
      }
      // Não desconectar completamente, apenas remover listeners
      // disconnectSocket();
    };
  }, [matchId]); // Removido onMessage e onError das dependências

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

