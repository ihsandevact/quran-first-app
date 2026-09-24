import { create } from 'zustand';
import { ProtectedApp, GateRule, PendingTilawah, QuranPass } from '@/types';

interface AppState {
  isOnboarded: boolean;
  protectedApps: ProtectedApp[];
  gateRules: GateRule[];
  pendingTilawah: PendingTilawah[];
  quranPasses: QuranPass[];
  todayVersesRead: number;
  streakDays: number;

  // Actions
  setOnboarded: (value: boolean) => void;
  toggleProtectedApp: (appId: string) => void;
  addProtectedApp: (app: ProtectedApp) => void;
  updateGateRule: (ruleId: string, requirementValue: number) => void;
  addPendingTilawah: (item: Omit<PendingTilawah, 'id' | 'createdAt' | 'status'>) => void;
  resolvePendingTilawah: (id: string) => void;
  addQuranPass: (appId: string, packageName: string, durationMinutes?: number) => void;
  isPassActive: (packageName: string) => boolean;
  incrementVersesRead: (count: number) => void;
}

const DEFAULT_APPS: ProtectedApp[] = [
  {
    id: 'app_ig',
    packageName: 'com.instagram.android',
    appName: 'Instagram',
    enabled: true,
    category: 'Social Media',
  },
  {
    id: 'app_tt',
    packageName: 'com.zhiliaoapp.musically',
    appName: 'TikTok',
    enabled: true,
    category: 'Social Media',
  },
  {
    id: 'app_yt',
    packageName: 'com.google.android.youtube',
    appName: 'YouTube',
    enabled: true,
    category: 'Entertainment',
  },
  {
    id: 'app_x',
    packageName: 'com.twitter.android',
    appName: 'X (Twitter)',
    enabled: false,
    category: 'Social Media',
  },
];

const DEFAULT_RULES: GateRule[] = [
  {
    id: 'rule_ig',
    protectedAppId: 'app_ig',
    requirementType: 'VERSE',
    requirementValue: 5,
    enabled: true,
  },
  {
    id: 'rule_tt',
    protectedAppId: 'app_tt',
    requirementType: 'VERSE',
    requirementValue: 5,
    enabled: true,
  },
  {
    id: 'rule_yt',
    protectedAppId: 'app_yt',
    requirementType: 'VERSE',
    requirementValue: 10,
    enabled: true,
  },
  {
    id: 'rule_x',
    protectedAppId: 'app_x',
    requirementType: 'VERSE',
    requirementValue: 5,
    enabled: false,
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  isOnboarded: false,
  protectedApps: DEFAULT_APPS,
  gateRules: DEFAULT_RULES,
  pendingTilawah: [
    {
      id: 'pending_1',
      sourceAppId: 'app_ig',
      appName: 'Instagram',
      versesRequired: 5,
      versesCompleted: 0,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
    }
  ],
  quranPasses: [],
  todayVersesRead: 25,
  streakDays: 7,

  setOnboarded: (value: boolean) => set({ isOnboarded: value }),

  toggleProtectedApp: (appId: string) => {
    set((state) => ({
      protectedApps: state.protectedApps.map((app) =>
        app.id === appId ? { ...app, enabled: !app.enabled } : app
      ),
    }));
  },

  addProtectedApp: (app: ProtectedApp) => {
    set((state) => ({
      protectedApps: [...state.protectedApps, app],
    }));
  },

  updateGateRule: (ruleId: string, requirementValue: number) => {
    set((state) => ({
      gateRules: state.gateRules.map((r) =>
        r.id === ruleId ? { ...r, requirementValue } : r
      ),
    }));
  },

  addPendingTilawah: (item) => {
    const newItem: PendingTilawah = {
      ...item,
      id: `pending_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
    };
    set((state) => ({
      pendingTilawah: [newItem, ...state.pendingTilawah],
    }));
  },

  resolvePendingTilawah: (id: string) => {
    set((state) => ({
      pendingTilawah: state.pendingTilawah.filter((p) => p.id !== id),
    }));
  },

  addQuranPass: (appId: string, packageName: string, durationMinutes = 30) => {
    const started = new Date();
    const expires = new Date(started.getTime() + durationMinutes * 60 * 1000);
    const newPass: QuranPass = {
      id: `pass_${Date.now()}`,
      appId,
      packageName,
      startedAt: started.toISOString(),
      expiresAt: expires.toISOString(),
    };
    set((state) => ({
      quranPasses: [...state.quranPasses.filter((p) => p.packageName !== packageName), newPass],
    }));
  },

  isPassActive: (packageName: string) => {
    const pass = get().quranPasses.find((p) => p.packageName === packageName);
    if (!pass) return false;
    return new Date(pass.expiresAt).getTime() > Date.now();
  },

  incrementVersesRead: (count: number) => {
    set((state) => ({
      todayVersesRead: state.todayVersesRead + count,
    }));
  },
}));
