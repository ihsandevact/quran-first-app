export interface AppDetectedEvent {
  packageName: string;
  appName: string;
  timestamp: number;
}

export interface PermissionStatus {
  hasUsageAccess: boolean;
  hasOverlayPermission: boolean;
}

export interface QuranPassConfig {
  packageName: string;
  durationMinutes: number;
}
