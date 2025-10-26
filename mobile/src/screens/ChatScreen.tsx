import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../styles/colors';
import { chatService, Message } from '../services/chatService';
import { useAuth } from '../contexts/AuthContext';

interface RouteParams {
  matchId: string;
  petName: string;
  petImage?: string;
}

export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { state } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const { matchId, petName, petImage } = (route.params as RouteParams) || {};

  useEffect(() => {
    if (matchId) {
      loadMessages();
    } else {
      setLoading(false);
    }
  }, [matchId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      console.log('Carregando mensagens para match:', matchId);
      const response = await chatService.getChatMessages(matchId);
      
      if (response && response.messages) {
        // Transformar mensagens do backend para o formato do frontend
        const transformedMessages = response.messages.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          senderId: msg.senderId,
          chatId: msg.chatId,
          createdAt: msg.createdAt,
          isFromUser: msg.senderId === state.user?.id,
          timestamp: new Date(msg.createdAt).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          senderName: msg.sender?.name || petName,
          senderImage: msg.sender?.avatar || petImage,
        }));
        
        setMessages(transformedMessages);
        console.log('Mensagens carregadas:', transformedMessages.length);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      Alert.alert('Erro', 'Não foi possível carregar as mensagens');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && matchId && !sending) {
      try {
        setSending(true);
        const messageContent = newMessage.trim();
        setNewMessage(''); // Limpar input imediatamente
        
        // Adicionar mensagem otimisticamente
        const optimisticMessage: Message = {
          id: `temp_${Date.now()}`,
          content: messageContent,
          senderId: state.user?.id || '',
          chatId: '',
          createdAt: new Date().toISOString(),
          isFromUser: true,
          timestamp: new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
        };
        
        setMessages(prev => [...prev, optimisticMessage]);
        
        // Enviar para o backend
        const response = await chatService.sendMessage(matchId, messageContent);
        
        if (response && response.message) {
          // Substituir mensagem temporária pela real
          setMessages(prev => prev.map(msg => 
            msg.id === optimisticMessage.id 
              ? {
                  ...response.message,
                  isFromUser: true,
                  timestamp: new Date(response.message.createdAt).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }),
                }
              : msg
          ));
        }
        
        // Scroll to bottom
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
        
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        Alert.alert('Erro', 'Não foi possível enviar a mensagem');
        
        // Remover mensagem otimista em caso de erro
        setMessages(prev => prev.filter(msg => msg.id !== `temp_${Date.now()}`));
        setNewMessage(messageContent); // Restaurar texto
      } finally {
        setSending(false);
      }
    }
  };

  const renderMessage = (message: Message) => (
    <View key={message.id} style={[
      styles.messageContainer,
      message.isFromUser ? styles.userMessageContainer : styles.matchMessageContainer
    ]}>
      {!message.isFromUser && (
        <Image
          source={{ uri: message.senderImage || 'https://via.placeholder.com/40' }}
          style={styles.senderAvatar}
        />
      )}
      
      <View style={[
        styles.messageBubble,
        message.isFromUser ? styles.userMessageBubble : styles.matchMessageBubble
      ]}>
        <Text style={[
          styles.messageText,
          message.isFromUser ? styles.userMessageText : styles.matchMessageText
        ]}>
          {message.content}
        </Text>
        <Text style={[
          styles.messageTime,
          message.isFromUser ? styles.userMessageTime : styles.matchMessageTime
        ]}>
          {message.timestamp}
        </Text>
      </View>

      {message.isFromUser && (
        <Image
          source={{ uri: 'https://via.placeholder.com/40' }} // Avatar do usuário
          style={styles.userAvatar}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundLight} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textLightPrimary} />
        </TouchableOpacity>
        
        <Image
          source={{ uri: petImage || 'https://via.placeholder.com/48' }}
          style={styles.headerAvatar}
        />
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{petName || 'Pet'}</Text>
          <Text style={styles.headerStatus}>
            Online
          </Text>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.messagesContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder={`Mande um latido para o ${petName || 'pet'}...`}
              placeholderTextColor={Colors.textLightSecondary}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={500}
              editable={!sending}
            />
            <View style={styles.inputActions}>
              <TouchableOpacity style={styles.inputActionButton}>
                <Ionicons name="add-circle" size={24} color={Colors.textLightSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputActionButton}>
                <Ionicons name="happy" size={24} color={Colors.textLightSecondary} />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.sendButton, (newMessage.trim() && !sending) ? styles.sendButtonActive : styles.sendButtonInactive]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim() || sending}
          >
            <Ionicons name={sending ? "hourglass" : "send"} size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(238, 124, 43, 0.1)',
    backgroundColor: Colors.backgroundLight,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textLightPrimary,
  },
  headerStatus: {
    fontSize: 14,
    color: Colors.textLightSecondary,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 24,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  matchMessageContainer: {
    justifyContent: 'flex-start',
  },
  senderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  userMessageBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  matchMessageBubble: {
    backgroundColor: '#f3ece7',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: Colors.white,
  },
  matchMessageText: {
    color: Colors.textLightPrimary,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  matchMessageTime: {
    color: Colors.textLightSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: 'rgba(238, 124, 43, 0.1)',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f3ece7',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textLightPrimary,
    maxHeight: 100,
    paddingVertical: 8,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  inputActionButton: {
    padding: 4,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: Colors.primary,
  },
  sendButtonInactive: {
    backgroundColor: Colors.textLightSecondary,
  },
});