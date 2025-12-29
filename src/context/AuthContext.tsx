import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { AppConfig } from '../constants/config';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log('Loading user data from storage' + AppConfig);
        const storedUser = await AsyncStorage.getItem(AppConfig.STORAGE_KEYS.USER_DATA);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, []);

  const login = async (userData: User) => {
    try {
      await AsyncStorage.setItem(AppConfig.STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AppConfig.STORAGE_KEYS.USER_DATA);
      setUser(null);
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  };

  const value = useMemo(() => ({ user, setUser, login, logout, isLoading }), [user, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
