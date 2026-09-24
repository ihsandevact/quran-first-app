import { create } from 'zustand';
import { ProtectedApp } from '@/types';
import { useAppStore } from './app-store';
import { setQuranPass as nativeSetQuranPass } from 'expo-app-gate';

interface GateState {
  isGateVisible: boolean;
  activeApp: ProtectedApp | null;
  versesRequired: number;
  versesCompleted: number;

  // Actions
  triggerGate: (app: ProtectedApp, requirement?: number) => void;
  incrementGateReading: () => void;
  deferGate: () => void; // "Baca Nanti"
  completeGate: (durationMinutes?: number) => void;
  closeGate: () => void;
}

export const useGateStore = create<GateState>((set, get) => ({
  isGateVisible: false,
  activeApp: null,
  versesRequired: 5,
  versesCompleted: 0,

  triggerGate: (app: ProtectedApp, requirement = 5) => {
    set({
      isGateVisible: true,
      activeApp: app,
      versesRequired: requirement,
      versesCompleted: 0,
    });
  },

  incrementGateReading: () => {
    const next = get().versesCompleted + 1;
    set({ versesCompleted: next });
    if (next >= get().versesRequired) {
      get().completeGate();
    }
  },

  deferGate: () => {
    const { activeApp, versesRequired, versesCompleted } = get();
    if (activeApp) {
      // Add to pending tilawah
      useAppStore.getState().addPendingTilawah({
        sourceAppId: activeApp.id,
        appName: activeApp.appName,
        versesRequired,
        versesCompleted,
      });

      // Temporary bypass for 5 minutes so user can complete urgent task
      useAppStore.getState().addQuranPass(activeApp.id, activeApp.packageName, 5);
      try {
        nativeSetQuranPass(activeApp.packageName, 5);
      } catch (e) {
        // Native module might be in development mode or not ready
      }
    }
    set({ isGateVisible: false, activeApp: null });
  },

  completeGate: (durationMinutes = 30) => {
    const { activeApp, versesRequired } = get();
    if (activeApp) {
      useAppStore.getState().addQuranPass(activeApp.id, activeApp.packageName, durationMinutes);
      useAppStore.getState().incrementVersesRead(versesRequired);
      try {
        nativeSetQuranPass(activeApp.packageName, durationMinutes);
      } catch (e) {
        // Native pass tracking
      }
    }
    set({ isGateVisible: false, activeApp: null });
  },

  closeGate: () => {
    set({ isGateVisible: false, activeApp: null });
  },
}));
