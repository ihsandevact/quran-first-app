export default {
  hasUsagePermission(): boolean {
    return false;
  },
  requestUsagePermission(): void {},
  hasOverlayPermission(): boolean {
    return false;
  },
  requestOverlayPermission(): void {},
  startMonitoring(_protectedPackages: string[]): void {},
  stopMonitoring(): void {},
  isMonitoring(): boolean {
    return false;
  },
  setQuranPass(_packageName: string, _durationMinutes: number): void {},
  clearQuranPass(_packageName: string): void {},
  addListener(): void {},
  removeListeners(): void {},
};
