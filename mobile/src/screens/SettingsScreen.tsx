import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

interface UserData {
  name: string;
  email: string;
}

interface NotificationSettings {
  newMatches: boolean;
  newMessages: boolean;
  newsAndPromotions: boolean;
}

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { signOut, state } = useAuth();
  const [userData, setUserData] = useState<UserData>({
    name: state.user?.name || 'Usuário',
    email: state.user?.email || '',
  });
  const [notifications, setNotifications] = useState<NotificationSettings>({
    newMatches: true,
    newMessages: true,
    newsAndPromotions: false,
  });
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleNotificationChange = (field: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    // Implementar salvamento
    setHasChanges(false);
    Alert.alert('Sucesso', 'Alterações salvas com sucesso!');
  };

  const handleChangePassword = () => {
    // Implementar mudança de senha
    Alert.alert('Mudança de Senha', 'Funcionalidade em desenvolvimento');
  };

  const handlePrivacyPolicy = () => {
    // Implementar política de privacidade
    Alert.alert('Política de Privacidade', 'Funcionalidade em desenvolvimento');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              // A navegação será automática através do AuthContext
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
            }
          },
        },
      ]
    );
  };

  const handleTermsOfService = () => {
    // Implementar termos de serviço
    Alert.alert('Termos de Serviço', 'Funcionalidade em desenvolvimento');
  };

  const handleContactUs = () => {
    // Implementar contato
    Alert.alert('Contato', 'Funcionalidade em desenvolvimento');
  };

  const handleDeactivateAccount = () => {
    Alert.alert(
      'Desativar Conta',
      'Tem certeza que deseja desativar sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Desativar', style: 'destructive', onPress: () => console.log('Desativar conta') }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir sua conta permanentemente? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => console.log('Excluir conta') }
      ]
    );
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const renderInputField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder?: string,
    keyboardType?: 'default' | 'email-address'
  ) => (
    <View style={styles.inputField}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor={Colors.textLightSecondary}
      />
    </View>
  );

  const renderSwitchItem = (
    icon: string,
    title: string,
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => (
    <View style={styles.switchItem}>
      <View style={styles.switchItemLeft}>
        <View style={styles.switchIcon}>
          <Ionicons name={icon as any} size={24} color={Colors.textLightSecondary} />
        </View>
        <Text style={styles.switchItemText}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: Colors.primary }}
        thumbColor={value ? Colors.white : '#f4f3f4'}
      />
    </View>
  );

  const renderLinkItem = (
    icon: string,
    title: string,
    onPress: () => void,
    destructive?: boolean
  ) => (
    <TouchableOpacity style={styles.linkItem} onPress={onPress}>
      <View style={styles.linkItemLeft}>
        <View style={styles.linkIcon}>
          <Ionicons 
            name={icon as any} 
            size={24} 
            color={destructive ? '#F44336' : Colors.textLightSecondary} 
          />
        </View>
        <Text style={[styles.linkItemText, destructive && styles.destructiveText]}>
          {title}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textLightSecondary} />
    </TouchableOpacity>
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
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        {renderSection('Conta', (
          <>
            {renderInputField(
              'Nome',
              userData.name,
              (text) => handleInputChange('name', text),
              'Digite seu nome'
            )}
            {renderInputField(
              'E-mail',
              userData.email,
              (text) => handleInputChange('email', text),
              'Digite seu e-mail',
              'email-address'
            )}
            <TouchableOpacity style={styles.linkItem} onPress={handleChangePassword}>
              <View style={styles.linkItemLeft}>
                <View style={styles.linkIcon}>
                  <Ionicons name="lock-closed" size={24} color={Colors.textLightSecondary} />
                </View>
                <Text style={styles.linkItemText}>Alterar Senha</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textLightSecondary} />
            </TouchableOpacity>
          </>
        ))}

        {/* Notifications Section */}
        {renderSection('Notificações', (
          <>
            {renderSwitchItem(
              'heart',
              'Novos Matches',
              notifications.newMatches,
              (value) => handleNotificationChange('newMatches', value)
            )}
            {renderSwitchItem(
              'chatbubble',
              'Novas Mensagens',
              notifications.newMessages,
              (value) => handleNotificationChange('newMessages', value)
            )}
            {renderSwitchItem(
              'megaphone',
              'Notícias e Promoções',
              notifications.newsAndPromotions,
              (value) => handleNotificationChange('newsAndPromotions', value)
            )}
          </>
        ))}

        {/* Privacy and Support Section */}
        {renderSection('Privacidade e Suporte', (
          <>
            {renderLinkItem('shield-checkmark', 'Política de Privacidade', handlePrivacyPolicy)}
            {renderLinkItem('document-text', 'Termos de Serviço', handleTermsOfService)}
            {renderLinkItem('help-circle', 'Fale Conosco', handleContactUs)}
          </>
        ))}

        {/* Account Management Section */}
        {renderSection('Gerenciar Conta', (
          <>
            <TouchableOpacity style={styles.linkItem} onPress={handleDeactivateAccount}>
              <View style={styles.linkItemLeft}>
                <View style={styles.linkIcon}>
                  <Ionicons name="pause-circle" size={24} color={Colors.textLightSecondary} />
                </View>
                <Text style={styles.linkItemText}>Desativar Conta</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkItem} onPress={handleDeleteAccount}>
              <View style={styles.linkItemLeft}>
                <View style={styles.linkIcon}>
                  <Ionicons name="trash" size={24} color="#F44336" />
                </View>
                <Text style={styles.destructiveText}>Excluir Conta Permanentemente</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.linkItem, styles.logoutItem]} onPress={handleLogout}>
              <View style={styles.linkItemLeft}>
                <View style={styles.linkIcon}>
                  <Ionicons name="log-out" size={24} color={Colors.error} />
                </View>
                <Text style={[styles.linkItemText, styles.logoutText]}>Sair da Conta</Text>
              </View>
            </TouchableOpacity>
          </>
        ))}
      </ScrollView>

      {/* Save Button - Only show when there are changes */}
      {hasChanges && (
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveChanges}
          >
            <Text style={styles.saveButtonText}>
              Salvar Alterações
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingVertical: 8,
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
    paddingBottom: 100,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  inputField: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textLightSecondary,
    marginBottom: 8,
  },
  textInput: {
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  linkItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  linkIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  linkItemText: {
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
  },
  destructiveText: {
    color: '#F44336',
    fontWeight: '500',
  },
  logoutItem: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 8,
    paddingTop: 16,
  },
  logoutText: {
    color: Colors.error,
    fontWeight: '500',
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  switchItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  switchItemText: {
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});