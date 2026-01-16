import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

const darkTheme = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  subText: '#888888',
  border: '#333333',
  icon: '#FFFFFF',
  status: 'light'
};

const lightTheme = {
  background: '#F2F2F2',
  card: '#FFFFFF',
  text: '#000000',
  subText: '#555555',
  border: '#E0E0E0',
  icon: '#333333',
  status: 'dark'
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  // 1. Load saved theme when app starts
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('userTheme');
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (e) {
      console.log("Failed to load theme");
    }
  };

  // 2. Save theme when user toggles it
  const toggleTheme = async () => {
    const newMode = !isDark;
    setIsDark(newMode);
    try {
      await AsyncStorage.setItem('userTheme', newMode ? 'dark' : 'light');
    } catch (e) {
      console.log("Failed to save theme");
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);