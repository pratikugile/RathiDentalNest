import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig } from '../constants/config';

/**
 * Storage utility for AsyncStorage operations
 */

export const Storage = {
  /**
   * Set item in storage
   */
  setItem: async (key: string, value: any): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving to storage:', error);
      throw error;
    }
  },

  /**
   * Get item from storage
   */
  getItem: async <T>(key: string): Promise<T | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  },

  /**
   * Remove item from storage
   */
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
      throw error;
    }
  },

  /**
   * Clear all storage
   */
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },

  /**
   * Save user token
   */
  setUserToken: async (token: string): Promise<void> => {
    await Storage.setItem(AppConfig.STORAGE_KEYS.USER_TOKEN, token);
  },

  /**
   * Get user token
   */
  getUserToken: async (): Promise<string | null> => {
    return await Storage.getItem<string>(AppConfig.STORAGE_KEYS.USER_TOKEN);
  },

  /**
   * Save user data
   */
  setUserData: async (userData: any): Promise<void> => {
    await Storage.setItem(AppConfig.STORAGE_KEYS.USER_DATA, userData);
  },

  /**
   * Get user data
   */
  getUserData: async <T>(): Promise<T | null> => {
    return await Storage.getItem<T>(AppConfig.STORAGE_KEYS.USER_DATA);
  },

  /**
   * Save theme mode
   */
  setThemeMode: async (isDark: boolean): Promise<void> => {
    await Storage.setItem(AppConfig.STORAGE_KEYS.THEME_MODE, isDark);
  },

  /**
   * Get theme mode
   */
  getThemeMode: async (): Promise<boolean | null> => {
    return await Storage.getItem<boolean>(AppConfig.STORAGE_KEYS.THEME_MODE);
  },
};
