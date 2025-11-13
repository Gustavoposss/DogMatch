import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Fonts, Spacing, BorderRadius } from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';

const SUPPORT_EMAIL = 'pardepatasapp@gmail.com';

export default function SupportScreen() {
  const navigation = useNavigation();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSendEmail = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos');
      return;
    }

    const emailSubject = encodeURIComponent(subject);
    const emailBody = encodeURIComponent(message);
    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${emailSubject}&body=${emailBody}`;

    Linking.canOpenURL(mailtoUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(mailtoUrl);
        } else {
          Alert.alert(
            'Erro',
            'Não foi possível abrir o aplicativo de e-mail. Por favor, envie um e-mail manualmente para ' + SUPPORT_EMAIL
          );
        }
      })
      .catch((err) => {
        console.error('Erro ao abrir e-mail:', err);
        Alert.alert(
          'Erro',
          'Não foi possível abrir o aplicativo de e-mail. Por favor, envie um e-mail manualmente para ' + SUPPORT_EMAIL
        );
      });
  };

  const handleCopyEmail = () => {
    // Em React Native, precisamos usar Clipboard
    Alert.alert(
      'E-mail de Suporte',
      `E-mail: ${SUPPORT_EMAIL}\n\nCopie este e-mail para entrar em contato conosco.`,
      [
        { text: 'OK' },
        {
          text: 'Copiar',
          onPress: () => {
            // Em produção, usar @react-native-clipboard/clipboard
            Alert.alert('E-mail copiado!', SUPPORT_EMAIL);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundLight} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suporte</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="help-circle" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.infoTitle}>Precisa de Ajuda?</Text>
          <Text style={styles.infoText}>
            Estamos aqui para ajudar! Entre em contato conosco através do e-mail abaixo e responderemos o mais rápido possível.
          </Text>
        </View>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Entre em Contato</Text>
          
          <TouchableOpacity
            style={styles.emailButton}
            onPress={handleCopyEmail}
          >
            <View style={styles.emailButtonContent}>
              <Ionicons name="mail" size={24} color={Colors.primary} />
              <View style={styles.emailButtonText}>
                <Text style={styles.emailLabel}>E-mail de Suporte</Text>
                <Text style={styles.emailValue}>{SUPPORT_EMAIL}</Text>
              </View>
            </View>
            <Ionicons name="copy-outline" size={20} color={Colors.textLightSecondary} />
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Enviar Mensagem</Text>
          <Text style={styles.formSubtitle}>
            Preencha o formulário abaixo para enviar uma mensagem diretamente para nosso e-mail de suporte.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Assunto</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Problema ao fazer login"
              placeholderTextColor={Colors.textLightSecondary}
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mensagem</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva seu problema ou dúvida..."
              placeholderTextColor={Colors.textLightSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendEmail}
          >
            <Ionicons name="send" size={20} color={Colors.white} />
            <Text style={styles.sendButtonText}>Enviar E-mail</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Perguntas Frequentes</Text>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Como faço para cadastrar meu pet?</Text>
            <Text style={styles.faqAnswer}>
              Vá até a aba "Pets" e clique no botão "+" para adicionar um novo pet. Preencha todas as informações solicitadas.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Como funciona o sistema de matches?</Text>
            <Text style={styles.faqAnswer}>
              Quando você e outro usuário dão like no pet um do outro, ocorre um match! Você poderá então conversar através do chat.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Como altero meu plano?</Text>
            <Text style={styles.faqAnswer}>
              Vá até a aba "Planos" e escolha o plano desejado. Você pode atualizar ou cancelar sua assinatura a qualquer momento.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Geralmente respondemos em até 24 horas úteis.
          </Text>
        </View>
      </ScrollView>
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
    backgroundColor: Colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingBottom: 24,
  },
  infoSection: {
    alignItems: 'center',
    padding: 24,
    marginTop: 16,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(238, 124, 43, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: Colors.textLightSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  contactSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  formSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  faqSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  formSubtitle: {
    fontSize: 14,
    color: Colors.textLightSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceLight,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(238, 124, 43, 0.2)',
  },
  emailButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emailButtonText: {
    marginLeft: 12,
    flex: 1,
  },
  emailLabel: {
    fontSize: 12,
    color: Colors.textLightSecondary,
    marginBottom: 4,
  },
  emailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surfaceLight,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  sendButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  faqItem: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: Colors.textLightSecondary,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.textLightSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

