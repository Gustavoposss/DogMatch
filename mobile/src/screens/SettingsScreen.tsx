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
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../services/userService';

// Interfaces
interface UserProfile {
  name: string;
  email: string;
  city: string;
  phone?: string;
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

  // Carregar configurações salvas e perfil do usuário
  useEffect(() => {
    loadSettings();
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await userService.getMyProfile();
      if (profile) {
        setUserProfile({
          name: profile.name || state.user?.name || '',
          email: profile.email || state.user?.email || '',
          city: profile.city || state.user?.city || '',
          phone: profile.phone || '',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      // Usar dados do contexto se falhar
      setUserProfile({
        name: state.user?.name || '',
        email: state.user?.email || '',
        city: state.user?.city || '',
        phone: '',
      });
    }
  };

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
      
      // Salvar perfil no backend se houver mudanças
      if (hasChanges) {
        try {
          await userService.updateProfile({
            name: userProfile.name,
            city: userProfile.city,
            phone: userProfile.phone,
          });
        } catch (error: any) {
          Alert.alert('Erro', error.message || 'Não foi possível atualizar o perfil');
          return;
        }
      }
      
      // Salvar configurações locais
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
          <SettingItem
            icon="person-circle"
            title="Editar Perfil"
            subtitle={`${userProfile.name} • ${userProfile.city}`}
            onPress={() => setShowEditProfile(true)}
          />
        ))}

        {/* Support Section */}
        {renderSection('Suporte', (
          <SettingItem
            icon="help-circle"
            title="Suporte"
            subtitle="Entre em contato conosco"
            onPress={() => navigation.navigate('Support' as never)}
          />
        ))}

        {/* Account Management Section */}
        {renderSection('Gerenciar Conta', (
          <SettingItem
            icon="log-out"
            title="Sair da Conta"
            onPress={handleLogout}
          />
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
        onRequestClose={() => setShowEditProfile(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowEditProfile(false)}
              style={styles.modalBackButton}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TouchableOpacity 
              onPress={async () => {
                try {
                  setLoading(true);
                  await userService.updateProfile({
                    name: userProfile.name,
                    city: userProfile.city,
                    phone: userProfile.phone,
                  });
                  setShowEditProfile(false);
                  setHasChanges(false);
                  Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
                  // Recarregar perfil
                  await loadUserProfile();
                } catch (error: any) {
                  Alert.alert('Erro', error.message || 'Não foi possível atualizar o perfil');
                } finally {
                  setLoading(false);
                }
              }}
              style={styles.modalSaveButton}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.primary} size="small" />
              ) : (
                <Text style={styles.modalSaveText}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.modalContent}
            contentContainerStyle={styles.modalContentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Avatar removido - sistema não suporta avatar de usuário */}
            
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
                style={[styles.modalInput, styles.modalInputDisabled]}
                value={userProfile.email}
                editable={false}
                placeholder="Digite seu e-mail"
                keyboardType="email-address"
                placeholderTextColor={Colors.textLightSecondary}
              />
              <Text style={styles.inputHint}>O e-mail não pode ser alterado</Text>
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
    minHeight: 56,
  },
  modalBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  modalSaveButton: {
    minWidth: 60,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
  },
  modalContentContainer: {
    padding: 16,
    paddingBottom: 32,
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
    minHeight: 48,
  },
  modalInputDisabled: {
    backgroundColor: Colors.backgroundLight,
    color: Colors.textLightSecondary,
    opacity: 0.6,
  },
  inputHint: {
    fontSize: 12,
    color: Colors.textLightSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
});