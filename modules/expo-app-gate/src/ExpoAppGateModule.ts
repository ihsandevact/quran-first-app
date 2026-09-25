import { requireNativeModule } from 'expo-modules-core';

let nativeModule: any;

try {
  nativeModule = requireNativeModule('ExpoAppGate');
} catch {
  // Fallback for Expo Go or environments without custom native build
  nativeModule = {
    hasUsagePermission: () => false,
    requestUsagePermission: () => {},
    hasOverlayPermission: () => false,
    requestOverlayPermission: () => {},
    startMonitoring: () => {},
    stopMonitoring: () => {},
    isMonitoring: () => false,
    setQuranPass: () => {},
    clearQuranPass: () => {},
    addListener: () => {},
    removeListeners: () => {},
  };
}

export default nativeModule;
