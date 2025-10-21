import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id?: string;
  senderId: string;
  content: string;
  timestamp: Date;
  matchId: string;
}

interface ChatInterfaceProps {
  matches: any[];
  currentUserId: string;
  token: string;
  onBack: () => void;
}

export default function ChatInterface({ matches, currentUserId, token, onBack }: ChatInterfaceProps) {
  const [selectedMatch, setSelectedMatch] = useState<any>(matches[0] || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Conectar ao Socket.IO
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const newSocket = io(API_URL, {
      auth: {
        token: token
      }
    });

    newSocket.on('connect', () => {
      console.log('✅ Conectado ao chat');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Desconectado do chat');
      setIsConnected(false);
    });

    newSocket.on('new_message', (message: Message) => {
      if (message.matchId === selectedMatch?.id) {
        setMessages(prev => [...prev, message]);
      }
    });

    newSocket.on('error', (error) => {
      console.error('Erro no socket:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token, selectedMatch]);

  // Entrar na sala do match selecionado
  useEffect(() => {
    if (socket && selectedMatch) {
      socket.emit('join_match', selectedMatch.id);
      loadMessages();
    }
  }, [selectedMatch, socket]);

  const loadMessages = async () => {
    if (!selectedMatch) return;
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/chats/${selectedMatch.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !socket || !selectedMatch) return;

    const messageData = {
      matchId: selectedMatch.id,
      content: newMessage.trim()
    };

    try {
      // Enviar via Socket.IO para tempo real
      socket.emit('send_message', messageData);
      
      // Também salvar no banco via API
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      await fetch(`${API_URL}/chats/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messageData)
      });

      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOtherUser = (match: any) => {
    const otherPet = match.petA?.ownerId === currentUserId ? match.petB : match.petA;
    return {
      id: otherPet?.ownerId,
      name: otherPet?.owner?.name,
      petName: otherPet?.name,
      petPhoto: otherPet?.photoUrl
    };
  };

  return (
    <div className="h-full flex bg-gray-100 rounded-2xl shadow-lg overflow-hidden">
      {/* Sidebar - Lista de conversas */}
      <div className={`${showSidebar ? 'w-full md:w-80' : 'hidden'} bg-white border-r border-gray-200 flex flex-col`}>
        {/* Header da sidebar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Conversas</h2>
            <button
              onClick={onBack}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700"
            >
              ←
            </button>
          </div>
        </div>

        {/* Lista de matches */}
        <div className="flex-1 overflow-y-auto">
          {matches.map((match) => {
            const otherUser = getOtherUser(match);
            const isSelected = selectedMatch?.id === match.id;
            
            return (
              <div
                key={match.id}
                onClick={() => setSelectedMatch(match)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={otherUser.petPhoto}
                      alt={otherUser.petName}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{otherUser.petName}</h3>
                    <p className="text-sm text-gray-500 truncate">Tutor: {otherUser.name}</p>
                    <p className="text-xs text-gray-400">Match realizado</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Área principal do chat */}
      <div className="flex-1 flex flex-col">
        {selectedMatch ? (
          <>
            {/* Header do chat */}
            <div className="bg-white p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="md:hidden p-2 text-gray-500 hover:text-gray-700"
                >
                  ☰
                </button>
                <img
                  src={getOtherUser(selectedMatch).petPhoto}
                  alt={getOtherUser(selectedMatch).petName}
                  className="w-10 h-10 object-cover rounded-full"
                />
                <div>
                  <h3 className="font-bold text-gray-800">{getOtherUser(selectedMatch).petName}</h3>
                  <p className="text-sm text-gray-500">{getOtherUser(selectedMatch).name}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-xs text-gray-500">{isConnected ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>

            {/* Área de mensagens */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p className="text-lg">🐾 Inicie uma conversa!</p>
                  <p className="text-sm">Que tal conversar sobre seus pets?</p>
                </div>
              ) : (
                messages.map((message, index) => {
                  const isCurrentUser = message.senderId === currentUserId;
                  return (
                    <div
                      key={index}
                      className={`flex items-end gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {!isCurrentUser && (
                        <img
                          src={getOtherUser(selectedMatch).petPhoto}
                          alt={getOtherUser(selectedMatch).petName}
                          className="w-8 h-8 object-cover rounded-full"
                        />
                      )}
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          isCurrentUser
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-sm'
                            : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          isCurrentUser ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      {isCurrentUser && (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          EU
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de mensagem */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!isConnected}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || !isConnected}
                  className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
              {!isConnected && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  🔌 Reconectando ao chat...
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg">Selecione uma conversa</p>
              <p className="text-sm">Escolha um match para começar a conversar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
