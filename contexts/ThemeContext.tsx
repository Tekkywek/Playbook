import React, { createContext, useContext, useMemo } from 'react';
import type { SportId } from '@/types';
import { brand, getSportAccent } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

interface ThemeCtx {
  accent: string;
  brand: typeof brand;
}

const ThemeContext = createContext<ThemeCtx | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const primary = profile?.primarySportId as SportId | undefined;

  const value = useMemo(
    () => ({
      accent: getSportAccent(primary),
      brand,
    }),
    [primary]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeCtx {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return { accent: brand.blue, brand };
  }
  return ctx;
}
