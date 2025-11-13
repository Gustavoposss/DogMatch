"use client";

import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ChatWindow } from "@/components/ChatWindow";
import { useAuth } from "@/contexts/AuthContext";
import { chatService } from "@/lib/services/chatService";
import { matchService } from "@/lib/services/matchService";
import { useSocket } from "@/hooks/useSocket";
import { Message } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { useEffect, useMemo, useState, use, useCallback } from "react";

interface MatchChatPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function MatchChatPage({ params }: MatchChatPageProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  
  // Unwrap params Promise usando React.use()
  const { id } = use(params);

  // Função helper para remover duplicatas (usando useCallback para estabilidade)
  const deduplicateMessages = useCallback((msgs: Message[]): Message[] => {
    const seen = new Set<string>();
    return msgs.filter((msg) => {
      if (seen.has(msg.id)) {
        console.warn('⚠️ Mensagem duplicada removida:', msg.id);
        return false;
      }
      seen.add(msg.id);
      return true;
    });
  }, []);

  const { data: matchData, isLoading: loadingMatch } = useQuery({
    queryKey: ['match', id],
    queryFn: () => matchService.getMatchById(id),
  });

  const { data: messagesData, isLoading: loadingMessages } = useQuery({
    queryKey: ['match-messages', id],
    queryFn: () => chatService.getChatMessages(id),
  });

  useEffect(() => {
    if (messagesData?.messages) {
      // Remover duplicatas ao carregar mensagens iniciais
      const uniqueMessages = deduplicateMessages(messagesData.messages);
      setMessages(uniqueMessages);
    }
  }, [messagesData?.messages]);

  const mutation = useMutation({
    mutationFn: (content: string) => chatService.sendMessage(id, content),
    onError: () => {
      setMessages((prev) => prev.slice(0, -1));
    },
    onSuccess: (response) => {
      // Remover mensagem temporária e garantir que a real não seja duplicada
      setMessages((prev) => {
        // Remover mensagens temporárias
        const withoutTemp = prev.filter((msg) => !msg.id.startsWith('temp-'));
        
        // Verificar se a mensagem real já existe (pode ter chegado via Socket.IO)
        const exists = withoutTemp.some((msg) => msg.id === response.message.id);
        if (exists) {
          console.log('⚠️ Mensagem já existe (chegou via Socket.IO), não adicionando novamente');
          return withoutTemp; // Já existe, não adicionar
        }
        
        // Adicionar a mensagem real e remover duplicatas
        return deduplicateMessages([...withoutTemp, response.message]);
      });
    },
  });

  const handleSocketMessage = useCallback((socketMessage: any) => {
    console.log('📨 ===== CALLBACK ONMESSAGE CHAMADO =====');
    console.log('📨 Nova mensagem recebida no chat (raw):', socketMessage);
    console.log('📨 Tipo:', typeof socketMessage);
    console.log('📨 Keys:', Object.keys(socketMessage || {}));
    
    // Normalizar a mensagem para o formato esperado
    const normalizedMessage: Message = {
      id: socketMessage.id,
      senderId: socketMessage.senderId,
      chatId: socketMessage.chatId || socketMessage.matchId || id,
      content: socketMessage.content,
      createdAt: socketMessage.createdAt || socketMessage.timestamp || new Date().toISOString(),
    };
    
    console.log('📨 Mensagem normalizada:', normalizedMessage);
    
    // Usar função de atualização para garantir que o estado seja atualizado
    setMessages((prev) => {
      console.log('📨 setMessages callback executado. Mensagens anteriores:', prev.length);
      
      // Remover mensagens temporárias com mesmo conteúdo (se houver)
      const withoutTemp = prev.filter((msg) => {
        // Se for temporária e tiver mesmo conteúdo, remover
        if (msg.id.startsWith('temp-') && msg.content === normalizedMessage.content) {
          console.log('🗑️ Removendo mensagem temporária:', msg.id);
          return false;
        }
        return true;
      });
      
      // Verificar se a mensagem já existe (evitar duplicatas)
      const exists = withoutTemp.some((msg) => msg.id === normalizedMessage.id);
      if (exists) {
        console.log('⚠️ Mensagem duplicada ignorada:', normalizedMessage.id);
        return withoutTemp;
      }
      
      console.log('✅ Adicionando nova mensagem ao estado. Total de mensagens:', withoutTemp.length + 1);
      const newMessages = deduplicateMessages([...withoutTemp, normalizedMessage]);
      console.log('📋 Todas as mensagens agora:', newMessages.map(m => ({ id: m.id, content: m.content.substring(0, 20) })));
      
      // Forçar re-render verificando se realmente mudou
      console.log('🔄 Estado atualizado, React deve re-renderizar');
      return newMessages;
    });
    
    console.log('📨 ===== FIM DO CALLBACK ONMESSAGE =====');
  }, [id]);

  const handleSocketError = useCallback((error: Error) => {
    console.error('❌ Erro no Socket.IO do chat:', error);
  }, []);

  useSocket({
    matchId: id,
    onMessage: handleSocketMessage,
    onError: handleSocketError,
  });

  const otherPet = useMemo(() => {
    if (!matchData || !user) return null;
    return matchData.petA?.ownerId === user.id ? matchData.petB : matchData.petA;
  }, [matchData, user]);

  if (!loadingMatch && !matchData) {
    notFound();
  }

  const handleSend = async (content: string) => {
    if (!user) return;

    // Criar ID temporário único baseado em timestamp e conteúdo
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const optimistic: Message = {
      id: tempId,
      chatId: id,
      senderId: user.id,
      content,
      createdAt: new Date().toISOString(),
    };
    
    console.log('📤 Enviando mensagem otimista com ID:', tempId);
    setMessages((prev) => [...prev, optimistic]);
    
    try {
      await mutation.mutateAsync(content);
    } catch (error) {
      // Em caso de erro, remover a mensagem otimista
      console.error('❌ Erro ao enviar mensagem, removendo otimista:', error);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    }
  };

  const title = otherPet?.name ? `Chat com ${otherPet.name}` : 'Chat';

  return (
    <ProtectedRoute>
      <Layout>
        <div className="mx-auto flex h-[calc(100vh-120px)] max-w-4xl flex-col">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              Conversem para combinar o melhor encontro para os pets.
            </p>
          </div>

          {loadingMatch || loadingMessages ? (
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-[var(--card-border)] bg-[var(--card-bg)]">
              <p className="text-[var(--foreground-secondary)]">Carregando conversa...</p>
            </div>
          ) : (
            <ChatWindow
              messages={messages}
              currentUserId={user?.id ?? ''}
              onSend={handleSend}
              sending={mutation.isPending}
              input={input}
              setInput={setInput}
            />
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
