"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types";

interface ChatWindowProps {
  messages: Message[];
  currentUserId: string;
  onSend: (content: string) => Promise<void>;
  sending?: boolean;
  input: string;
  setInput: (value: string) => void;
}

export function ChatWindow({ messages, currentUserId, onSend, sending, input, setInput }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    await onSend(input.trim());
    setInput('');
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => {
          const isFromUser = message.senderId === currentUserId;
          const timestamp = new Date(message.createdAt).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={message.id}
              className={`flex ${isFromUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs rounded-2xl px-4 py-2 text-sm shadow-sm sm:max-w-md ${
                  isFromUser ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p>{message.content}</p>
                <span className={`mt-1 block text-xs ${isFromUser ? 'text-white/80' : 'text-gray-500'}`}>
                  {timestamp}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escreva uma mensagem..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
          >
            {sending ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </form>
    </div>
  );
}
