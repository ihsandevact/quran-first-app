import React, { useState } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AppCard } from '@/components/ui/AppCard';
import { AppButton } from '@/components/ui/AppButton';
import { Spacing, Typography, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-theme';
import { useGateStore } from '@/store/gate-store';
import { useAppStore } from '@/store/app-store';

export default function GateScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ packageName?: string; appName?: string }>();
  const { colors } = useAppTheme();

  const appName = params.appName || 'Instagram';
  const packageName = params.packageName || 'com.instagram.android';

  const deferGate = useGateStore((s) => s.deferGate);
  const completeGate = useGateStore((s) => s.completeGate);
  const protectedApps = useAppStore((s) => s.protectedApps);
  const targetApp = protectedApps.find((a) => a.packageName === packageName) || {
    id: 'app_temp',
    packageName,
    appName,
    enabled: true,
    category: 'Social Media' as const,
  };

  const [simulatedRead, setSimulatedRead] = useState(0);
  const versesRequired = 5;

  // Handle "Baca Sekarang" / Read next ayah
  const handleReadVerse = () => {
    const next = simulatedRead + 1;
    setSimulatedRead(next);
  };

  // Handle "Selesaikan & Buka Aplikasi"
  const handleComplete = () => {
    completeGate(30);
    router.back();
  };

  // Handle "Baca Nanti" (deferral)
  const handleDefer = () => {
    deferGate();
    router.back();
  };

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.topBadgeArea}>
        <View style={[styles.badge, { backgroundColor: colors.accentGoldSoft }]}>
          <Text style={[styles.badgeText, { color: colors.accentGold }]}>
            [ APP DETECTED ]
          </Text>
        </View>
        <Text style={[styles.detectedTitle, { color: colors.text }]}>
          {appName} terdeteksi
        </Text>
        <Text style={[styles.detectedSubtitle, { color: colors.textMuted }]}>
          Aplikasi ini diproteksi oleh Quran First
        </Text>
      </View>

      {/* Gate Central Card */}
      <AppCard style={styles.gateCard}>
        <Text style={[styles.gateBrand, { color: colors.primary }]}>Quran First</Text>

        <Text style={[styles.gatePrompt, { color: colors.text }]}>
          Sebelum melanjutkan ke {appName}, luangkan sejenak untuk membaca:
        </Text>

        <View style={[styles.verseCounterBox, { backgroundColor: colors.primaryMuted }]}>
          <Text style={{ fontSize: 24 }}>📖</Text>
          <Text style={[styles.verseCounterText, { color: colors.primary }]}>
            {simulatedRead} / {versesRequired} Ayat
          </Text>
        </View>

        {simulatedRead >= versesRequired ? (
          <View style={styles.completedNotice}>
            <Text style={[styles.completedTitle, { color: colors.primary }]}>
              Alhamdulillah! 🤍
            </Text>
            <Text style={[styles.completedText, { color: colors.textMuted }]}>
              Kamu telah membaca {versesRequired} ayat. Quran Pass aktif selama 30 menit.
            </Text>
          </View>
        ) : (
          <View style={styles.mockAyahContainer}>
            <Text style={[styles.arabicAyah, { color: colors.text }]}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </Text>
            <Text style={[styles.translationAyah, { color: colors.textMuted }]}>
              "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang."
            </Text>
          </View>
        )}
      </AppCard>

      {/* Action Buttons */}
      <View style={styles.actionArea}>
        {simulatedRead < versesRequired ? (
          <>
            <AppButton
              title={`Baca Ayat (${simulatedRead + 1}/${versesRequired})`}
              onPress={handleReadVerse}
              variant="primary"
            />
            <AppButton
              title="Baca Nanti"
              onPress={handleDefer}
              variant="ghost"
            />
          </>
        ) : (
          <AppButton
            title={`Buka ${appName} Sekarang`}
            onPress={handleComplete}
            variant="gold"
          />
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    justifyContent: 'space-between',
    paddingVertical: Spacing.xl,
  },
  topBadgeArea: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    marginBottom: Spacing.sm,
  },
  badgeText: {
    ...Typography.caption,
    fontWeight: '700',
  },
  detectedTitle: {
    ...Typography.headingLarge,
    fontSize: 24,
  },
  detectedSubtitle: {
    ...Typography.bodyMuted,
    marginTop: 4,
  },
  gateCard: {
    padding: Spacing.xl,
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  gateBrand: {
    ...Typography.headingSmall,
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  gatePrompt: {
    ...Typography.body,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  verseCounterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    marginBottom: Spacing.lg,
  },
  verseCounterText: {
    ...Typography.headingMedium,
  },
  mockAyahContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  arabicAyah: {
    ...Typography.arabicText,
    fontSize: 22,
    lineHeight: 38,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  translationAyah: {
    ...Typography.bodyMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  completedNotice: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  completedTitle: {
    ...Typography.headingMedium,
    fontSize: 22,
  },
  completedText: {
    ...Typography.bodyMuted,
    textAlign: 'center',
  },
  actionArea: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
});
