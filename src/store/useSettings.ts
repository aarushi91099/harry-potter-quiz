import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HouseName } from '../engine/types';

interface SettingsState {
  darkMode: boolean;
  houseTheme: HouseName | null;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
  setHouseTheme: (house: HouseName | null) => void;
}

const prefersDark =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      darkMode: prefersDark ?? false,
      houseTheme: null,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setDarkMode: (value) => set({ darkMode: value }),
      setHouseTheme: (house) => set({ houseTheme: house }),
    }),
    { name: 'hp-quiz-settings' },
  ),
);
