// lib/ThemeContext.tsx
// Create this file at: lib/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'auto';

interface Theme {
  background: string;
  cardBackground: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryDark: string;
  border: string;
  success: string;
  error: string;
  warning: string;
  inputBackground: string;
  shadow: string;
}

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const lightTheme: Theme = {
  background: '#fff7e6',
  cardBackground: '#ffffff',
  text: '#000000',
  textSecondary: '#555555',
  primary: '#FFC107',
  primaryDark: '#F4B400',
  border: '#eeeeee',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  inputBackground: '#ffffff',
  shadow: '#000000',
};

const darkTheme: Theme = {
  background: '#121212',
  cardBackground: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  primary: '#FFC107',
  primaryDark: '#F4B400',
  border: '#333333',
  success: '#66BB6A',
  error: '#EF5350',
  warning: '#FFA726',
  inputBackground: '#2C2C2C',
  shadow: '#000000',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  const [isDark, setIsDark] = useState(false);

  // Load theme preference from AsyncStorage
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Update theme when mode or system preference changes
  useEffect(() => {
    if (themeMode === 'auto') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(themeMode === 'dark');
    }
  }, [themeMode, systemColorScheme]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@theme_mode');
      if (savedTheme) {
        setThemeModeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem('@theme_mode', mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};