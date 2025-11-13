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
import { useEffect, useMemo, useState, use } from "react";

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
      setMessages(messagesData.messages);
    }
  }, [messagesData?.messages]);

  const mutation = useMutation({
    mutationFn: (content: string) => chatService.sendMessage(id, content),
    onError: () => {
      setMessages((prev) => prev.slice(0, -1));
    },
    onSuccess: (response) => {
      setMessages((prev) =>
        prev.map((message) =>
          message.id.startsWith('temp-') ? (response.message ?? message) : message
        )
      );
    },
  });

  useSocket({
    matchId: id,
    onMessage: (socketMessage) => {
      setMessages((prev) => {
        const exists = prev.some((msg) => msg.id === socketMessage.id);
        if (exists) return prev;
        return [...prev, socketMessage];
      });
    },
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

    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      chatId: id,
      senderId: user.id,
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    await mutation.mutateAsync(content);
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
