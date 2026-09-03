import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getTheme, setTheme } from '../services/storageService';
import { useLocalStorage } from '../hooks/useLocalStorage';

// ===== CREATE CONTEXT =====
const ThemeContext = createContext(null);

// ===== PROVIDER COMPONENT =====
const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useLocalStorage('theme', 'system');
  const [systemTheme, setSystemTheme] = useState('light');

  // Detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e) => setSystemTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Calculate effective theme
  const effectiveTheme = theme === 'system' ? systemTheme : theme;

  // Apply theme class to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
  }, [effectiveTheme]);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    const newTheme = effectiveTheme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
  }, [effectiveTheme]);

  // Set theme
  const setThemeValue = useCallback((newTheme) => {
    setThemeState(newTheme);
  }, []);

  // Get theme
  const getThemeValue = useCallback(() => {
    return theme;
  }, [theme]);

  // Get effective theme
  const getEffectiveTheme = useCallback(() => {
    return effectiveTheme;
  }, [effectiveTheme]);

  // Check if dark mode
  const isDarkMode = useCallback(() => {
    return effectiveTheme === 'dark';
  }, [effectiveTheme]);

  // Value
  const value = {
    theme,
    effectiveTheme,
    systemTheme,
    toggleTheme,
    setTheme: setThemeValue,
    getTheme: getThemeValue,
    getEffectiveTheme,
    isDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// ===== CUSTOM HOOK =====
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// ===== EXPORT =====
export { ThemeProvider, useTheme };
export default ThemeContext;