import { EventEmitter, type EventSubscription } from 'expo-modules-core';
import ExpoAppGateModule from './ExpoAppGateModule';
import { AppDetectedEvent, PermissionStatus } from './ExpoAppGate.types';

type ExpoAppGateEvents = {
  onAppDetected: (event: AppDetectedEvent) => void;
};

const emitter = new EventEmitter<ExpoAppGateEvents>(ExpoAppGateModule);

export function hasUsagePermission(): boolean {
  try {
    return ExpoAppGateModule.hasUsagePermission();
  } catch {
    return false;
  }
}

export function requestUsagePermission(): void {
  try {
    ExpoAppGateModule.requestUsagePermission();
  } catch {}
}

export function hasOverlayPermission(): boolean {
  try {
    return ExpoAppGateModule.hasOverlayPermission();
  } catch {
    return false;
  }
}

export function requestOverlayPermission(): void {
  try {
    ExpoAppGateModule.requestOverlayPermission();
  } catch {}
}

export function checkPermissions(): PermissionStatus {
  return {
    hasUsageAccess: hasUsagePermission(),
    hasOverlayPermission: hasOverlayPermission(),
  };
}

export function startMonitoring(protectedPackages: string[] = ['com.instagram.android']): void {
  try {
    ExpoAppGateModule.startMonitoring(protectedPackages);
  } catch {}
}

export function stopMonitoring(): void {
  try {
    ExpoAppGateModule.stopMonitoring();
  } catch {}
}

export function isMonitoring(): boolean {
  try {
    return ExpoAppGateModule.isMonitoring();
  } catch {
    return false;
  }
}

export function setQuranPass(packageName: string, durationMinutes: number = 30): void {
  try {
    ExpoAppGateModule.setQuranPass(packageName, durationMinutes);
  } catch {}
}

export function clearQuranPass(packageName: string): void {
  try {
    ExpoAppGateModule.clearQuranPass(packageName);
  } catch {}
}

export function addAppDetectedListener(
  listener: (event: AppDetectedEvent) => void
): EventSubscription {
  return emitter.addListener('onAppDetected', listener);
}

export * from './ExpoAppGate.types';
