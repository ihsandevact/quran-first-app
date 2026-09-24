import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AppCard } from '@/components/ui/AppCard';
import { AppButton } from '@/components/ui/AppButton';
import { Spacing, Typography, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/app-store';
import { useGateStore } from '@/store/gate-store';
import {
  hasUsagePermission,
  requestUsagePermission,
  hasOverlayPermission,
  requestOverlayPermission,
  startMonitoring,
  stopMonitoring,
  isMonitoring,
} from 'expo-app-gate';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const todayVersesRead = useAppStore((s) => s.todayVersesRead);
  const streakDays = useAppStore((s) => s.streakDays);
  const pendingTilawah = useAppStore((s) => s.pendingTilawah);
  const protectedApps = useAppStore((s) => s.protectedApps);
  const triggerGate = useGateStore((s) => s.triggerGate);

  const [usageAllowed, setUsageAllowed] = useState(false);
  const [overlayAllowed, setOverlayAllowed] = useState(false);
  const [monitoringActive, setMonitoringActive] = useState(false);

  const refreshPermissions = () => {
    if (Platform.OS === 'android') {
      try {
        const u = hasUsagePermission();
        const o = hasOverlayPermission();
        const m = isMonitoring();
        setUsageAllowed(u);
        setOverlayAllowed(o);
        setMonitoringActive(m);
      } catch (e) {
        // Expo Go or web environment fallback
      }
    }
  };

  useEffect(() => {
    refreshPermissions();
  }, []);

  const totalPendingVerses = pendingTilawah.reduce(
    (acc, curr) => acc + (curr.versesRequired - curr.versesCompleted),
    0
  );

  const handleTestGateSpike = () => {
    const igApp = protectedApps.find((a) => a.packageName === 'com.instagram.android') || {
      id: 'app_ig',
      packageName: 'com.instagram.android',
      appName: 'Instagram',
      enabled: true,
      category: 'Social Media',
    };
    triggerGate(igApp, 5);
    router.push({
      pathname: '/gate',
      params: { packageName: igApp.packageName, appName: igApp.appName },
    });
  };

  const handleToggleMonitoring = () => {
    if (Platform.OS !== 'android') {
      Alert.alert('Info', 'Native app detection is available on Android.');
      return;
    }

    try {
      if (monitoringActive) {
        stopMonitoring();
        setMonitoringActive(false);
      } else {
        if (!usageAllowed) {
          Alert.alert(
            'Izin Diperlukan',
            'Aktifkan Akses Penggunaan (Usage Access) agar Quran First dapat mendeteksi aplikasi.',
            [
              { text: 'Buka Pengaturan', onPress: () => requestUsagePermission() },
              { text: 'Batal', style: 'cancel' },
            ]
          );
          return;
        }
        const activePackages = protectedApps
          .filter((a) => a.enabled)
          .map((a) => a.packageName);
        startMonitoring(activePackages);
        setMonitoringActive(true);
      }
    } catch (e) {
      Alert.alert('Error', 'Native monitoring service is starting or building.');
    }
  };

  return (
    <ScreenWrapper scrollable contentContainerStyle={styles.container}>
      {/* Greeting Header */}
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.textMuted }]}>Assalamu'alaikum 👋</Text>
        <Text style={[styles.title, { color: colors.text }]}>Al-Qur'an Sebelum Distraksi</Text>
      </View>

      {/* Habit Summary Card */}
      <AppCard style={styles.card}>
        <Text style={[styles.cardLabel, { color: colors.textMuted }]}>Tilawah Hari Ini</Text>
        <View style={styles.statsRow}>
          <Text style={[styles.statsMain, { color: colors.primary }]}>
            {todayVersesRead}{' '}
            <Text style={[styles.statsUnit, { color: colors.textMuted }]}>Ayat</Text>
          </Text>
          <View style={[styles.streakBadge, { backgroundColor: colors.accentGoldSoft }]}>
            <Text style={[styles.streakText, { color: colors.accentGold }]}>
              🔥 {streakDays} Hari
            </Text>
          </View>
        </View>
      </AppCard>

      {/* Pending Tilawah Section */}
      <AppCard style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardTitleGroup}>
            <Text style={{ fontSize: 20 }}>📖</Text>
            <View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Tilawah Tertunda</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                {totalPendingVerses > 0
                  ? `${totalPendingVerses} Ayat menunggu waktu luangmu`
                  : 'Tidak ada tilawah tertunda. Pertahankan kebiasaan baikmu. 🤍'}
              </Text>
            </View>
          </View>
          {totalPendingVerses > 0 && (
            <TouchableOpacity
              onPress={handleTestGateSpike}
              style={[styles.smallBtn, { backgroundColor: colors.primaryMuted }]}
            >
              <Text style={[styles.smallBtnText, { color: colors.primary }]}>Selesaikan</Text>
            </TouchableOpacity>
          )}
        </View>
      </AppCard>

      {/* Protected Apps List */}
      <AppCard style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Aplikasi Dilindungi</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
              {protectedApps.filter((a) => a.enabled).length} aplikasi aktif diproteksi
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/settings')}
            style={[styles.smallBtn, { backgroundColor: colors.primaryMuted }]}
          >
            <Text style={[styles.smallBtnText, { color: colors.primary }]}>Kelola</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.appList}>
          {protectedApps
            .filter((a) => a.enabled)
            .map((app) => (
              <View
                key={app.id}
                style={[styles.appItem, { borderColor: colors.cardBorder }]}
              >
                <View style={styles.appIconCircle}>
                  <Text style={{ fontSize: 16 }}>📱</Text>
                </View>
                <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                  <Text style={[styles.appName, { color: colors.text }]}>{app.appName}</Text>
                  <Text style={[styles.appRule, { color: colors.textMuted }]}>
                    5 Ayat sebelum buka
                  </Text>
                </View>
                <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
              </View>
            ))}
        </View>
      </AppCard>

      {/* Task 001: Android Gate Spike Control Panel */}
      <AppCard style={[styles.card, { borderColor: colors.accentGold, borderWidth: 1.5 }]}>
        <View style={styles.spikeHeader}>
          <Text style={[styles.spikeBadge, { color: colors.accentGold }]}>
            TASK 001 • FEASIBILITY SPIKE
          </Text>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Android Gate Monitor</Text>
          <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
            Target uji coba spike: Instagram (com.instagram.android)
          </Text>
        </View>

        {/* Permission Indicators */}
        <View style={styles.permissionBox}>
          <View style={styles.permissionItem}>
            <Text style={[styles.permissionLabel, { color: colors.text }]}>Akses Penggunaan:</Text>
            <TouchableOpacity onPress={requestUsagePermission}>
              <Text
                style={{
                  color: usageAllowed ? colors.success : colors.error,
                  fontWeight: '600',
                }}
              >
                {usageAllowed ? '✓ Diizinkan' : '⚠️ Buka Pengaturan'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.permissionItem}>
            <Text style={[styles.permissionLabel, { color: colors.text }]}>Tampil di Atas Aplikasi:</Text>
            <TouchableOpacity onPress={requestOverlayPermission}>
              <Text
                style={{
                  color: overlayAllowed ? colors.success : colors.warning,
                  fontWeight: '600',
                }}
              >
                {overlayAllowed ? '✓ Diizinkan' : '⚠️ Aktifkan Overlay'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ gap: Spacing.sm, marginTop: Spacing.sm }}>
          <AppButton
            title={monitoringActive ? 'Hentikan Monitor Background' : 'Mulai Monitor Background'}
            onPress={handleToggleMonitoring}
            variant={monitoringActive ? 'secondary' : 'primary'}
            size="medium"
          />
          <AppButton
            title="Test Trigger Gate (Simulasi Instagram)"
            onPress={handleTestGateSpike}
            variant="gold"
            size="medium"
          />
        </View>
      </AppCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  greeting: {
    ...Typography.bodyMuted,
    fontSize: 16,
  },
  title: {
    ...Typography.headingLarge,
    marginTop: 2,
  },
  card: {
    padding: Spacing.lg,
  },
  cardLabel: {
    ...Typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  statsMain: {
    ...Typography.headingLarge,
    fontSize: 36,
  },
  statsUnit: {
    ...Typography.body,
    fontSize: 18,
  },
  streakBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '700',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  cardTitle: {
    ...Typography.headingSmall,
  },
  cardSubtitle: {
    ...Typography.caption,
    marginTop: 2,
  },
  smallBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
  },
  smallBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  appList: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 0.5,
  },
  appIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F2ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    ...Typography.body,
    fontWeight: '600',
  },
  appRule: {
    ...Typography.caption,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  spikeHeader: {
    marginBottom: Spacing.sm,
  },
  spikeBadge: {
    ...Typography.caption,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  permissionBox: {
    backgroundColor: '#F3F5EF',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  permissionLabel: {
    ...Typography.bodyMuted,
    fontSize: 13,
  },
});
