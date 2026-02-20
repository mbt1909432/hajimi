import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  language: 'en' | 'zh';
  soundEnabled: boolean;
  musicEnabled: boolean;
}

interface SettingsStore extends SettingsState {
  setLanguage: (language: 'en' | 'zh') => void;
  toggleSound: () => void;
  toggleMusic: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      language: 'zh',
      soundEnabled: true,
      musicEnabled: true,

      setLanguage: (language) => set({ language }),

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled }))
    }),
    {
      name: 'cat-game-settings'
    }
  )
);
