import React, { useState, useEffect } from 'react';
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
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaces
interface UserProfile {
  name: string;
  email: string;
  city: string;
  phone?: string;
  avatar?: string;
}

interface NotificationSettings {
  newMatches: boolean;
  newMessages: boolean;
  newsAndPromotions: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
}

interface PrivacySettings {
  showOnlineStatus: boolean;
  showLastSeen: boolean;
  allowMessagesFromStrangers: boolean;
  shareLocation: boolean;
}

interface PetPreferences {
  maxDistance: number;
  ageRange: { min: number; max: number };
  preferredBreeds: string[];
  showOnlyNeutered: boolean;
}

// Componente de Item de Configuração
interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  destructive?: boolean;
  disabled?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
  destructive = false,
  disabled = false,
}) => (
  <TouchableOpacity
    style={[styles.settingItem, disabled && styles.disabledItem]}
    onPress={onPress}
    disabled={disabled}
  >
    <View style={styles.settingItemLeft}>
      <View style={[styles.settingIcon, destructive && styles.destructiveIcon]}>
        <Ionicons 
          name={icon as any} 
          size={24} 
          color={destructive ? Colors.error : disabled ? Colors.textLightSecondary : Colors.primary} 
        />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={[styles.settingTitle, destructive && styles.destructiveText, disabled && styles.disabledText]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, disabled && styles.disabledText]}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
    {rightElement || <Ionicons name="chevron-forward" size={20} color={Colors.textLightSecondary} />}
  </TouchableOpacity>
);

// Componente de Switch Item
interface SwitchItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

const SwitchItem: React.FC<SwitchItemProps> = ({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
  disabled = false,
}) => (
  <View style={[styles.settingItem, disabled && styles.disabledItem]}>
    <View style={styles.settingItemLeft}>
      <View style={[styles.settingIcon, disabled && styles.disabledIcon]}>
        <Ionicons 
          name={icon as any} 
          size={24} 
          color={disabled ? Colors.textLightSecondary : Colors.primary} 
        />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={[styles.settingTitle, disabled && styles.disabledText]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, disabled && styles.disabledText]}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#E0E0E0', true: Colors.primary }}
      thumbColor={value ? Colors.white : '#F4F3F4'}
      disabled={disabled}
    />
  </View>
);

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { signOut, state } = useAuth();
  
  // Estados
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: state.user?.name || '',
    email: state.user?.email || '',
    city: state.user?.city || '',
    phone: '',
    avatar: state.user?.avatar,
  });
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    newMatches: true,
    newMessages: true,
    newsAndPromotions: false,
    pushNotifications: true,
    emailNotifications: true,
  });
  
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    showOnlineStatus: true,
    showLastSeen: true,
    allowMessagesFromStrangers: false,
    shareLocation: false,
  });
  
  const [petPreferences, setPetPreferences] = useState<PetPreferences>({
    maxDistance: 50,
    ageRange: { min: 1, max: 15 },
    preferredBreeds: [],
    showOnlyNeutered: false,
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Carregar configurações salvas
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedNotifications = await AsyncStorage.getItem('notificationSettings');
      const savedPrivacy = await AsyncStorage.getItem('privacySettings');
      const savedPetPreferences = await AsyncStorage.getItem('petPreferences');
      
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
      if (savedPrivacy) {
        setPrivacy(JSON.parse(savedPrivacy));
      }
      if (savedPetPreferences) {
        setPetPreferences(JSON.parse(savedPetPreferences));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(notifications));
      await AsyncStorage.setItem('privacySettings', JSON.stringify(privacy));
      await AsyncStorage.setItem('petPreferences', JSON.stringify(petPreferences));
      
      setHasChanges(false);
      Alert.alert('Sucesso', 'Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      Alert.alert('Erro', 'Não foi possível salvar as configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleNotificationChange = (field: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handlePrivacyChange = (field: keyof PrivacySettings, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handlePetPreferenceChange = (field: keyof PetPreferences, value: any) => {
    setPetPreferences(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
            }
          },
        },
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
        {/* Profile Section */}
        {renderSection('Perfil', (
          <>
            <SettingItem
              icon="person-circle"
              title="Editar Perfil"
              subtitle={`${userProfile.name} • ${userProfile.city}`}
              onPress={() => setShowEditProfile(true)}
            />
            <SettingItem
              icon="paw"
              title="Meus Pets"
              subtitle="Gerenciar pets cadastrados"
              onPress={() => navigation.navigate('Pets' as never)}
            />
            <SettingItem
              icon="heart"
              title="Meus Matches"
              subtitle="Ver todos os matches"
              onPress={() => navigation.navigate('Matches' as never)}
            />
          </>
        ))}

        {/* Notifications Section */}
        {renderSection('Notificações', (
          <>
            <SwitchItem
              icon="notifications"
              title="Notificações Push"
              subtitle="Receber notificações no dispositivo"
              value={notifications.pushNotifications}
              onValueChange={(value) => handleNotificationChange('pushNotifications', value)}
            />
            <SwitchItem
              icon="heart"
              title="Novos Matches"
              subtitle="Notificar quando houver novos matches"
              value={notifications.newMatches}
              onValueChange={(value) => handleNotificationChange('newMatches', value)}
              disabled={!notifications.pushNotifications}
            />
            <SwitchItem
              icon="chatbubble"
              title="Novas Mensagens"
              subtitle="Notificar quando receber mensagens"
              value={notifications.newMessages}
              onValueChange={(value) => handleNotificationChange('newMessages', value)}
              disabled={!notifications.pushNotifications}
            />
            <SwitchItem
              icon="mail"
              title="Notificações por E-mail"
              subtitle="Receber notificações por e-mail"
              value={notifications.emailNotifications}
              onValueChange={(value) => handleNotificationChange('emailNotifications', value)}
            />
            <SwitchItem
              icon="megaphone"
              title="Notícias e Promoções"
              subtitle="Receber ofertas e novidades"
              value={notifications.newsAndPromotions}
              onValueChange={(value) => handleNotificationChange('newsAndPromotions', value)}
            />
          </>
        ))}

        {/* Privacy Section */}
        {renderSection('Privacidade', (
          <>
            <SwitchItem
              icon="eye"
              title="Mostrar Status Online"
              subtitle="Outros usuários podem ver quando você está online"
              value={privacy.showOnlineStatus}
              onValueChange={(value) => handlePrivacyChange('showOnlineStatus', value)}
            />
            <SwitchItem
              icon="time"
              title="Mostrar Última Vez Online"
              subtitle="Mostrar quando você esteve online pela última vez"
              value={privacy.showLastSeen}
              onValueChange={(value) => handlePrivacyChange('showLastSeen', value)}
            />
            <SwitchItem
              icon="chatbubbles"
              title="Mensagens de Estranhos"
              subtitle="Permitir mensagens de usuários não matchados"
              value={privacy.allowMessagesFromStrangers}
              onValueChange={(value) => handlePrivacyChange('allowMessagesFromStrangers', value)}
            />
            <SwitchItem
              icon="location"
              title="Compartilhar Localização"
              subtitle="Mostrar sua cidade para outros usuários"
              value={privacy.shareLocation}
              onValueChange={(value) => handlePrivacyChange('shareLocation', value)}
            />
          </>
        ))}

        {/* Pet Preferences Section */}
        {renderSection('Preferências de Pets', (
          <>
            <SettingItem
              icon="location"
              title="Distância Máxima"
              subtitle={`${petPreferences.maxDistance} km`}
              onPress={() => console.log('Ajustar distância')}
            />
            <SettingItem
              icon="calendar"
              title="Faixa Etária"
              subtitle={`${petPreferences.ageRange.min} - ${petPreferences.ageRange.max} anos`}
              onPress={() => console.log('Ajustar idade')}
            />
            <SettingItem
              icon="paw"
              title="Raças Preferidas"
              subtitle={petPreferences.preferredBreeds.length > 0 ? `${petPreferences.preferredBreeds.length} raças selecionadas` : 'Todas as raças'}
              onPress={() => console.log('Selecionar raças')}
            />
            <SwitchItem
              icon="medical"
              title="Apenas Castrados"
              subtitle="Mostrar apenas pets castrados"
              value={petPreferences.showOnlyNeutered}
              onValueChange={(value) => handlePetPreferenceChange('showOnlyNeutered', value)}
            />
          </>
        ))}

        {/* Support Section */}
        {renderSection('Suporte', (
          <>
            <SettingItem
              icon="help-circle"
              title="Central de Ajuda"
              subtitle="Perguntas frequentes e tutoriais"
              onPress={() => console.log('Central de ajuda')}
            />
            <SettingItem
              icon="mail"
              title="Fale Conosco"
              subtitle="Envie sua dúvida ou sugestão"
              onPress={() => console.log('Contato')}
            />
            <SettingItem
              icon="star"
              title="Avaliar App"
              subtitle="Deixe sua avaliação na loja"
              onPress={() => console.log('Avaliar app')}
            />
            <SettingItem
              icon="information-circle"
              title="Sobre o App"
              subtitle="Versão 1.0.0"
              onPress={() => console.log('Sobre')}
            />
          </>
        ))}

        {/* Legal Section */}
        {renderSection('Legal', (
          <>
            <SettingItem
              icon="shield-checkmark"
              title="Política de Privacidade"
              onPress={() => console.log('Política de privacidade')}
            />
            <SettingItem
              icon="document-text"
              title="Termos de Serviço"
              onPress={() => console.log('Termos de serviço')}
            />
            <SettingItem
              icon="lock-closed"
              title="Alterar Senha"
              onPress={() => console.log('Alterar senha')}
            />
          </>
        ))}

        {/* Account Management Section */}
        {renderSection('Gerenciar Conta', (
          <>
            <SettingItem
              icon="log-out"
              title="Sair da Conta"
              onPress={handleLogout}
            />
            <SettingItem
              icon="trash"
              title="Excluir Conta"
              subtitle="Esta ação não pode ser desfeita"
              onPress={handleDeleteAccount}
              destructive
            />
          </>
        ))}
      </ScrollView>

      {/* Save Button */}
      {hasChanges && (
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={saveSettings}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfile}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditProfile(false)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TouchableOpacity onPress={() => setShowEditProfile(false)}>
              <Text style={styles.modalSaveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: userProfile.avatar || 'https://via.placeholder.com/100' }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.avatarEditButton}>
                <Ionicons name="camera" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome</Text>
              <TextInput
                style={styles.modalInput}
                value={userProfile.name}
                onChangeText={(text) => handleProfileChange('name', text)}
                placeholder="Digite seu nome"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-mail</Text>
              <TextInput
                style={styles.modalInput}
                value={userProfile.email}
                onChangeText={(text) => handleProfileChange('email', text)}
                placeholder="Digite seu e-mail"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cidade</Text>
              <TextInput
                style={styles.modalInput}
                value={userProfile.city}
                onChangeText={(text) => handleProfileChange('city', text)}
                placeholder="Digite sua cidade"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefone</Text>
              <TextInput
                style={styles.modalInput}
                value={userProfile.phone}
                onChangeText={(text) => handleProfileChange('phone', text)}
                placeholder="Digite seu telefone"
                keyboardType="phone-pad"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    paddingBottom: 100,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.textLightSecondary,
    marginTop: 2,
  },
  destructiveIcon: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 20,
  },
  destructiveText: {
    color: Colors.error,
  },
  disabledItem: {
    opacity: 0.5,
  },
  disabledIcon: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 20,
  },
  disabledText: {
    color: Colors.textLightSecondary,
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
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  modalCancelText: {
    fontSize: 16,
    color: Colors.textLightSecondary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  modalSaveText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
  modalInput: {
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surfaceLight,
  },
});