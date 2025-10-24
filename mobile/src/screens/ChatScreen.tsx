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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
// Cores inline para evitar problemas de importação
const Colors = {
  primary: '#ee7c2b',
  backgroundLight: '#f8f7f6',
  textLightPrimary: '#1b130d',
  textLightSecondary: '#9a6c4c',
  white: '#FFFFFF',
  surfaceLight: '#ffffff',
  border: '#E1E5E9',
  success: '#4CAF50',
  error: '#F44336',
};
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  isFromUser: boolean;
  timestamp: string;
  senderName?: string;
  senderImage?: string;
}

export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [pet, setPet] = useState<any>(null);

  useEffect(() => {
    // Simular carregamento do pet e mensagens
    const mockPet = {
      id: '1',
      name: 'Bolinha',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQNkQGeH7wjv0EAy8FAiOycQPbQaJvQ-PSmfiTZ7-iqCyEzMn6ZtlBO741OaN4yyuoekijbnt12QwAUeiOm4JQlZ6dGhsnIZQArOS3VBwt6IEhb26KYEC9sKkNW86IwEFBJZMiBcwz9gaNF98NAlW0WhN3gAZvkpAZwKgjyYgOndzOGkdAntJU1JyVnVu6NKtnMUR4aCEhrmPYncjmLuMLrY07a6Xm48VufvBodecUHfARyUH6O_Kxr7mxVfbRgAotJl2QNfWN5DI',
      isOnline: true,
    };

    const mockMessages: Message[] = [
      {
        id: '1',
        text: 'Olá! A Mel viu a foto do Bolinha e abanou o rabo!',
        isFromUser: false,
        timestamp: '10:32 AM',
        senderName: 'Bolinha',
        senderImage: pet?.image,
      },
      {
        id: '2',
        text: 'Haha, que legal! Onde vocês costumam passear?',
        isFromUser: true,
        timestamp: '10:33 AM',
      },
      {
        id: '3',
        text: 'Nós gostamos muito do Parque Ibirapuera, tem bastante espaço pra correr!',
        isFromUser: false,
        timestamp: '10:35 AM',
        senderName: 'Bolinha',
        senderImage: pet?.image,
      },
      {
        id: '4',
        text: 'Ótima ideia! Que tal nos encontrarmos lá no sábado?',
        isFromUser: true,
        timestamp: '10:36 AM',
      },
    ];

    setPet(mockPet);
    setMessages(mockMessages);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        isFromUser: true,
        timestamp: new Date().toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
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
          {message.text}
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
          source={{ uri: pet?.image || 'https://via.placeholder.com/48' }}
          style={styles.headerAvatar}
        />
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{pet?.name || 'Bolinha'}</Text>
          <Text style={styles.headerStatus}>
            {pet?.isOnline ? 'Online' : 'Offline'}
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
              placeholder="Mande um latido para o Bolinha..."
              placeholderTextColor={Colors.textLightSecondary}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={500}
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
            style={[styles.sendButton, newMessage.trim() ? styles.sendButtonActive : styles.sendButtonInactive]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons name="send" size={24} color={Colors.white} />
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