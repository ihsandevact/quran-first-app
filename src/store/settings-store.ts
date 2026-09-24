import { create } from 'zustand';

interface SettingsState {
  themeMode: 'light' | 'dark' | 'system';
  defaultQuranPassMinutes: number;
  notificationsEnabled: boolean;

  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  setDefaultQuranPassMinutes: (minutes: number) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  themeMode: 'system',
  defaultQuranPassMinutes: 30,
  notificationsEnabled: true,

  setThemeMode: (mode) => set({ themeMode: mode }),
  setDefaultQuranPassMinutes: (minutes) => set({ defaultQuranPassMinutes: minutes }),
  setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
}));
