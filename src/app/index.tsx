import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AppButton } from '@/components/ui/AppButton';
import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/app-store';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const setOnboarded = useAppStore((s) => s.setOnboarded);

  const handleStart = () => {
    setOnboarded(true);
    router.replace('/(tabs)/home');
  };

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.headerArea}>
        <View style={[styles.badge, { backgroundColor: colors.primaryMuted }]}>
          <Text style={[styles.badgeText, { color: colors.primary }]}>بِسْمِ اللَّهِ</Text>
        </View>

        <Text style={[styles.brandTitle, { color: colors.primary }]}>Quran First</Text>
        <Text style={[styles.tagline, { color: colors.textMuted }]}>
          Baca Al-Qur'an dulu,{"\n"}buka aplikasi kemudian.
        </Text>
      </View>

      <View style={styles.contentArea}>
        <Text style={[styles.welcomeTitle, { color: colors.text }]}>
          Selamat datang di{"\n"}Quran First
        </Text>

        <Text style={[styles.description, { color: colors.textMuted }]}>
          Bantu dirimu membangun kebiasaan membaca Al-Qur'an sebelum membuka aplikasi pilihanmu.
          {"\n\n"}
          Jadikan setiap kali membuka smartphone sebagai momen untuk mengingat Allah.
        </Text>
      </View>

      <View style={styles.actionArea}>
        <AppButton
          title="Mulai Sekarang"
          onPress={handleStart}
          variant="primary"
          style={styles.primaryButton}
        />
        <AppButton
          title="Masuk ke Beranda"
          onPress={handleStart}
          variant="ghost"
          style={styles.ghostButton}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
  },
  headerArea: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    marginBottom: Spacing.md,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  brandTitle: {
    ...Typography.headingLarge,
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  tagline: {
    ...Typography.bodyMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  contentArea: {
    paddingVertical: Spacing.lg,
  },
  welcomeTitle: {
    ...Typography.headingLarge,
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.body,
    fontSize: 16,
    lineHeight: 24,
  },
  actionArea: {
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  primaryButton: {
    width: '100%',
  },
  ghostButton: {
    width: '100%',
  },
});
