import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { ApiConfigDebug } from './src/components/ApiConfigDebug';

// Importar telas
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import PetsScreen from './src/screens/PetsScreen';
import SwipeScreen from './src/screens/SwipeScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import AddPetScreen from './src/screens/AddPetScreen';
import EditPetScreen from './src/screens/EditPetScreen';
import PlansScreen from './src/screens/PlansScreen';
import SubscriptionScreen from './src/screens/SubscriptionScreen';
import PaymentPixScreen from './src/screens/PaymentPixScreen';
import PaymentSuccessScreen from './src/screens/PaymentSuccessScreen';
import PaymentFailureScreen from './src/screens/PaymentFailureScreen';
import ChatScreen from './src/screens/ChatScreen';
import ConversationsScreen from './src/screens/ConversationsScreen';
import PetProfileScreen from './src/screens/PetProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Importar contexto
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { Colors } from './src/styles/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator para usuários autenticados
function MainTabNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.grayDark,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: Colors.grayDark,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontFamily: 'Montserrat',
          fontSize: 12,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Pets') {
            iconName = 'paw';
          } else if (route.name === 'Swipe') {
            iconName = 'heart';
          } else if (route.name === 'Matches') {
            iconName = 'chatbubbles';
          } else if (route.name === 'Plans') {
            iconName = 'wallet';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          } else {
            iconName = 'help-circle'; // Fallback icon
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Pets" component={PetsScreen} />
      <Tab.Screen name="Swipe" component={SwipeScreen} />
      <Tab.Screen name="Matches" component={MatchesScreen} />
      <Tab.Screen name="Plans" component={PlansScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// Componente principal da aplicação
function AppNavigator() {
  const { state } = useAuth();

  // Tela de loading
  if (state.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {state.isSignedIn ? (
          // Usuário autenticado - Mostrar tabs e telas modais
          <>
            <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} />
            <Stack.Screen name="AddPet" component={AddPetScreen} />
            <Stack.Screen name="EditPet" component={EditPetScreen} />
            <Stack.Screen name="Subscription" component={SubscriptionScreen} />
            <Stack.Screen name="PaymentPix" component={PaymentPixScreen} />
            <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
            <Stack.Screen name="PaymentFailure" component={PaymentFailureScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Conversations" component={ConversationsScreen} />
            <Stack.Screen name="PetProfile" component={PetProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </>
        ) : (
          // Usuário não autenticado - Mostrar telas de autenticação
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// App principal com AuthProvider
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
        <ApiConfigDebug />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

// Estilos
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.grayLight,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    fontFamily: 'Montserrat',
  },
});