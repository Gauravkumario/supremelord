import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

// Define theme presets - simplified to just two minimalist themes
export const themePresets = {
  light: {
    name: 'light',
    displayName: 'Light',
    mode: 'light',
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    accentColor: '#0ea5e9',
    bgPrimary: '#ffffff',
    bgSecondary: '#f8f9fa',
    bgAccent: '#e9ecef',
    textPrimary: '#1f2937',
    textSecondary: '#64748b',
    borderColor: '#e5e7eb',
  },
  dark: {
    name: 'dark',
    displayName: 'Dark',
    mode: 'dark',
    primaryColor: '#3b82f6',
    secondaryColor: '#94a3b8',
    accentColor: '#0ea5e9',
    bgPrimary: '#111827',
    bgSecondary: '#1f2937',
    bgAccent: '#374151',
    textPrimary: '#f3f4f6',
    textSecondary: '#d1d5db',
    borderColor: '#374151',
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themePresets.light);

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('portfolioTheme');
      const customThemeData = localStorage.getItem('portfolioCustomTheme');
      
      if (customThemeData) {
        try {
          const parsedCustomTheme = JSON.parse(customThemeData);
          setTheme(parsedCustomTheme);
        } catch (e) {
          console.error('Error parsing custom theme:', e);
        }
      } else if (savedTheme && themePresets[savedTheme]) {
        setTheme(themePresets[savedTheme]);
      } else {
        // Check user's system preference
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const defaultTheme = prefersDarkMode ? 'dark' : 'light';
        setTheme(themePresets[defaultTheme]);
      }
    }
  }, []);

  // Apply theme colors to CSS variables
  useEffect(() => {
    if (typeof window !== 'undefined' && theme) {
      const root = document.documentElement;
      
      // Set theme mode class
      if (theme.mode === 'dark') {
        root.classList.add('dark-theme');
      } else {
        root.classList.remove('dark-theme');
      }
      
      // Set color CSS variables
      root.style.setProperty('--primary-color', theme.primaryColor);
      root.style.setProperty('--primary-hover', adjustColor(theme.primaryColor, -15));
      root.style.setProperty('--secondary-color', theme.secondaryColor);
      root.style.setProperty('--accent-color', theme.accentColor);
      root.style.setProperty('--bg-primary', theme.bgPrimary);
      root.style.setProperty('--bg-secondary', theme.bgSecondary);
      root.style.setProperty('--bg-accent', theme.bgAccent);
      root.style.setProperty('--text-primary', theme.textPrimary);
      root.style.setProperty('--text-secondary', theme.textSecondary);
      root.style.setProperty('--border-color', theme.borderColor);
      
      // Store theme preference
      localStorage.setItem('portfolioTheme', theme.name);
      
      if (theme.name === 'custom') {
        localStorage.setItem('portfolioCustomTheme', JSON.stringify(theme));
      }
    }
  }, [theme]);
  
  // Helper to adjust color brightness for hover states
  const adjustColor = (hex, percent) => {
    // Convert hex to RGB
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    
    // Adjust brightness
    r = Math.max(0, Math.min(255, r + percent));
    g = Math.max(0, Math.min(255, g + percent));
    b = Math.max(0, Math.min(255, b + percent));
    
    // Convert back to hex
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  // Change theme
  const changeTheme = (themeKey) => {
    if (themePresets[themeKey]) {
      setTheme(themePresets[themeKey]);
    }
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme,
        changeTheme,
        themePresets
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
