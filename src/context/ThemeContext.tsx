import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Storage } from '../utils/storage';

interface ThemeContextType {
  toggleTheme: () => void;
  isDarkTheme: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [isDarkTheme, setIsDarkTheme] = useState(systemScheme === 'dark');

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await Storage.getThemeMode();
      if (savedTheme !== null) {
        setIsDarkTheme(savedTheme);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    await Storage.setThemeMode(newTheme);
  };

  const value = useMemo(() => ({ toggleTheme, isDarkTheme }), [isDarkTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
