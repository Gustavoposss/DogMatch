import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

// Tipos para o contexto
interface User {
  id: string;
  name: string;
  email: string;
  city: string;
}

interface AuthState {
  isLoading: boolean;
  isSignedIn: boolean;
  userToken: string | null;
  user: User | null;
}

interface AuthContextType {
  state: AuthState;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  restoreToken: () => Promise<void>;
}

// Estado inicial
const initialState: AuthState = {
  isLoading: true,
  isSignedIn: false,
  userToken: null,
  user: null,
};

// Actions
type AuthAction =
  | { type: 'RESTORE_TOKEN'; token: string | null; user: User | null }
  | { type: 'SIGN_IN'; token: string; user: User }
  | { type: 'SIGN_OUT' };

// Reducer
const authReducer = (prevState: AuthState, action: AuthAction): AuthState => {
  console.log('AuthReducer: Action:', action.type);
  if ('user' in action) {
    console.log('AuthReducer: User:', action.user);
  }
  
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        userToken: action.token,
        user: action.user,
        isSignedIn: !!action.token,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignedIn: true,
        userToken: action.token,
        user: action.user,
        isLoading: false,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignedIn: false,
        userToken: null,
        user: null,
        isLoading: false,
      };
    default:
      return prevState;
  }
};

// Criar contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restaurar token ao inicializar
  const restoreToken = async () => {
    try {
      const userToken = await authService.getToken();
      const user = await authService.getCurrentUser();
      
      console.log('RestoreToken: userToken:', userToken);
      console.log('RestoreToken: user:', user);
      
      if (userToken && user) {
        dispatch({ type: 'RESTORE_TOKEN', token: userToken, user });
      } else {
        dispatch({ type: 'RESTORE_TOKEN', token: null, user: null });
      }
    } catch (error) {
      console.error('Erro ao restaurar token:', error);
      dispatch({ type: 'RESTORE_TOKEN', token: null, user: null });
    }
  };

  // Sign in
  const signIn = async (token: string, user: User) => {
    try {
      console.log('AuthContext: Fazendo sign in com user:', user);
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'SIGN_IN', token, user });
      console.log('AuthContext: Sign in concluído');
    } catch (error) {
      console.error('Erro ao fazer sign in:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'SIGN_OUT' });
    } catch (error) {
      console.error('Erro ao fazer sign out:', error);
      // Mesmo com erro, forçar sign out
      dispatch({ type: 'SIGN_OUT' });
    }
  };

  // Efeito para restaurar token
  useEffect(() => {
    restoreToken();
  }, []);

  const value: AuthContextType = {
    state,
    signIn,
    signOut,
    restoreToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
