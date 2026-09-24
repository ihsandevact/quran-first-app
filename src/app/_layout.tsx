import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { initDatabase } from '@/database';
import { addAppDetectedListener, hasUsagePermission, startMonitoring } from 'expo-app-gate';
import { useAppStore } from '@/store/app-store';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const protectedApps = useAppStore((s) => s.protectedApps);
  const isPassActive = useAppStore((s) => s.isPassActive);

  useEffect(() => {
    async function prepare() {
      try {
        await initDatabase();
      } catch (e) {
        console.warn('Error initializing database', e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync().catch(() => {});
      }
    }

    prepare();
  }, []);

  // Listen to native Android background detection events
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    let subscription: any;
    try {
      subscription = addAppDetectedListener((event) => {
        // Double check Quran Pass validity
        if (!isPassActive(event.packageName)) {
          router.push({
            pathname: '/gate',
            params: {
              packageName: event.packageName,
              appName: event.appName,
            },
          });
        }
      });

      // Auto-start monitoring if usage permission is already granted
      if (hasUsagePermission()) {
        const activePackages = protectedApps
          .filter((a) => a.enabled)
          .map((a) => a.packageName);
        startMonitoring(activePackages);
      }
    } catch (e) {
      // Native module not loaded or running on simulator/web
    }

    return () => {
      subscription?.remove?.();
    };
  }, [protectedApps, isPassActive]);

  if (!isReady) {
    return null;
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="gate"
          options={{
            presentation: 'fullScreenModal',
            animation: 'fade',
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
