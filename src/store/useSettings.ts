import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HouseName } from '../engine/types';

interface SettingsState {
  houseTheme: HouseName | null;
  setHouseTheme: (house: HouseName | null) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      houseTheme: null,
      setHouseTheme: (house) => set({ houseTheme: house }),
    }),
    { name: 'hp-quiz-settings' },
  ),
);
