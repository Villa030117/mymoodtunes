import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const themes = {
  light: {
    name: 'light',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    primary: '#6200EE',
    secondary: '#03DAC6',
    text: '#333333',
    textSecondary: '#666666',
    accent: '#FF5252',
    border: '#E0E0E0',
    card: '#FFFFFF',
    icon: '#757575',
    statusBar: 'dark-content',
  },
  dark: {
    name: 'dark',
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#BB86FC',
    secondary: '#03DAC6',
    text: '#E1E1E1',
    textSecondary: '#B0B0B0',
    accent: '#CF6679',
    border: '#2D2D2D',
    card: '#2D2D2D',
    icon: '#ADADAD',
    statusBar: 'light-content',
  },
  blue: {
    name: 'blue',
    background: '#E3F2FD',
    surface: '#F5F9FF',
    primary: '#1976D2',
    secondary: '#00ACC1',
    text: '#0D47A1',
    textSecondary: '#1565C0',
    accent: '#FF4081',
    border: '#BBDEFB',
    card: '#FFFFFF',
    icon: '#1976D2',
    statusBar: 'dark-content',
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.light);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  // Load saved theme from AsyncStorage
  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setTheme(themes[savedTheme]);
      }
    } catch (error) {
      console.error('Error loading theme', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between light and dark themes
  const toggleTheme = async () => {
    const newTheme = theme.name === 'light' ? themes.dark : themes.light;
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme.name);
    } catch (error) {
      console.error('Error saving theme', error);
    }
  };

  // Set specific theme
  const setSpecificTheme = async (themeName) => {
    if (themes[themeName]) {
      setTheme(themes[themeName]);
      try {
        await AsyncStorage.setItem('theme', themeName);
      } catch (error) {
        console.error('Error saving theme', error);
      }
    }
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        toggleTheme, 
        setTheme: setSpecificTheme,
        isLoading 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
