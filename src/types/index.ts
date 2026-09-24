export type RequirementType = 'VERSE';

export interface ProtectedApp {
  id: string;
  packageName: string;
  appName: string;
  icon?: string;
  enabled: boolean;
  category: 'Social Media' | 'Entertainment' | 'Games' | 'Other';
}

export interface GateRule {
  id: string;
  protectedAppId: string;
  requirementType: RequirementType;
  requirementValue: number; // 3, 5, or 10 in v0.1
  enabled: boolean;
}

export interface PendingTilawah {
  id: string;
  sourceAppId: string;
  appName: string;
  versesRequired: number;
  versesCompleted: number;
  createdAt: string;
  status: 'PENDING' | 'COMPLETED';
}

export interface QuranPass {
  id: string;
  appId: string;
  packageName: string;
  startedAt: string;
  expiresAt: string;
}

export interface ReadingSession {
  id: string;
  startedAt: string;
  completedAt?: string;
  versesRead: number;
  source: 'READER' | 'GATE' | 'PENDING';
}

export interface SurahSummary {
  number: number;
  nameArabic: string;
  nameLatin: string;
  meaning: string;
  numberOfAyahs: number;
  revelationType: 'Makkiyah' | 'Madaniyah';
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  textArabic: string;
  textTranslation: string;
  surahNumber: number;
}
