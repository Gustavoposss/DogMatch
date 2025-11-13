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
    <div className="flex h-full flex-col rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)]">
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
                  isFromUser 
                    ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary-glow)]' 
                    : 'bg-[var(--input-bg)] text-white border border-[var(--input-border)]'
                }`}
              >
                <p>{message.content}</p>
                <span className={`mt-1 block text-xs ${isFromUser ? 'text-white/80' : 'text-[var(--foreground-secondary)]'}`}>
                  {timestamp}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-[var(--card-border)] p-4">
        <div className="flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Envie uma mensagem..."
            className="flex-1 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-2 text-white placeholder:text-[var(--foreground-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-glow)]"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 font-semibold text-white transition-all hover:bg-[var(--primary-dark)] hover:shadow-lg hover:shadow-[var(--primary-glow)] disabled:opacity-60"
          >
            {sending ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </form>
    </div>
  );
}
