import { create } from 'zustand';
import type { Achievement } from '../scoring/AchievementSystem';

export interface Toast {
  id: string;
  achievement: Achievement;
}

interface ToastState {
  toasts: Toast[];
  pushToasts: (achievements: Achievement[]) => void;
  dismiss: (id: string) => void;
}

/** Transient (unpersisted) queue of achievement-unlock toasts, shown by AchievementToastHost. */
export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],

  pushToasts: (achievements) => {
    if (achievements.length === 0) return;
    const newToasts: Toast[] = achievements.map((achievement) => ({
      id: `${achievement.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      achievement,
    }));
    set((state) => ({ toasts: [...state.toasts, ...newToasts] }));
  },

  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
