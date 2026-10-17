import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeColor } from '../types';

interface ThemeContextType {
  accentColor: ThemeColor;
  setAccentColor: (color: ThemeColor) => void;
  customCursor: boolean;
  setCustomCursor: (enabled: boolean) => void;
  colorClasses: {
    bg: string;
    bgHover: string;
    text: string;
    border: string;
    badge: string;
    glow: string;
    hex: string;
  };
}

const COLOR_MAP: Record<ThemeColor, {
  bg: string;
  bgHover: string;
  text: string;
  border: string;
  badge: string;
  glow: string;
  hex: string;
}> = {
  emerald: {
    bg: 'bg-emerald-500',
    bgHover: 'hover:bg-emerald-400',
    text: 'text-emerald-400',
    border: 'border-emerald-500',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500',
    glow: 'rgba(16, 185, 129, 0.4)',
    hex: '#10b981',
  },
  cyan: {
    bg: 'bg-cyan-500',
    bgHover: 'hover:bg-cyan-400',
    text: 'text-cyan-400',
    border: 'border-cyan-500',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500',
    glow: 'rgba(6, 182, 212, 0.4)',
    hex: '#06b6d4',
  },
  amber: {
    bg: 'bg-amber-500',
    bgHover: 'hover:bg-amber-400',
    text: 'text-amber-400',
    border: 'border-amber-500',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500',
    glow: 'rgba(245, 158, 11, 0.4)',
    hex: '#f59e0b',
  },
  pink: {
    bg: 'bg-pink-500',
    bgHover: 'hover:bg-pink-400',
    text: 'text-pink-400',
    border: 'border-pink-500',
    badge: 'bg-pink-500/20 text-pink-300 border-pink-500',
    glow: 'rgba(236, 72, 153, 0.4)',
    hex: '#ec4899',
  },
  purple: {
    bg: 'bg-purple-500',
    bgHover: 'hover:bg-purple-400',
    text: 'text-purple-400',
    border: 'border-purple-500',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500',
    glow: 'rgba(168, 85, 247, 0.4)',
    hex: '#a855f7',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accentColor, setAccentColor] = useState<ThemeColor>(() => {
    return (localStorage.getItem('kg_accent_color') as ThemeColor) || 'emerald';
  });
  const [customCursor, setCustomCursor] = useState<boolean>(() => {
    const saved = localStorage.getItem('kg_custom_cursor');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('kg_accent_color', accentColor);
  }, [accentColor]);

  useEffect(() => {
    localStorage.setItem('kg_custom_cursor', String(customCursor));
    if (customCursor) {
      document.documentElement.classList.add('custom-bio-cursor');
    } else {
      document.documentElement.classList.remove('custom-bio-cursor');
    }
  }, [customCursor]);

  const colorClasses = COLOR_MAP[accentColor] || COLOR_MAP.emerald;

  return (
    <ThemeContext.Provider
      value={{
        accentColor,
        setAccentColor,
        customCursor,
        setCustomCursor,
        colorClasses,
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
