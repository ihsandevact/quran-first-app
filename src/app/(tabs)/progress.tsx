import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AppCard } from '@/components/ui/AppCard';
import { Spacing, Typography, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/app-store';

export default function ProgressScreen() {
  const { colors } = useAppTheme();

  const todayVerses = useAppStore((s) => s.todayVersesRead);
  const streakDays = useAppStore((s) => s.streakDays);

  return (
    <ScreenWrapper scrollable contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Progres Kebiasaan</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Refleksi perjalanan tilawahmu
        </Text>
      </View>

      {/* Streak Card */}
      <AppCard style={[styles.card, { backgroundColor: colors.accentGoldSoft }]}>
        <View style={styles.streakHeader}>
          <Text style={{ fontSize: 28 }}>🔥</Text>
          <View style={{ flex: 1, marginLeft: Spacing.sm }}>
            <Text style={[styles.streakTitle, { color: colors.accentGold }]}>
              {streakDays} Hari Berturut-turut
            </Text>
            <Text style={[styles.streakSubtitle, { color: colors.text }]}>
              MasyaAllah, teruskan niat baikmu!
            </Text>
          </View>
        </View>
      </AppCard>

      {/* Statistics Grid */}
      <View style={styles.grid}>
        <AppCard style={styles.gridCard}>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Hari Ini</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>{todayVerses}</Text>
          <Text style={[styles.statUnit, { color: colors.textMuted }]}>Ayat</Text>
        </AppCard>

        <AppCard style={styles.gridCard}>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Minggu Ini</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>120</Text>
          <Text style={[styles.statUnit, { color: colors.textMuted }]}>Ayat</Text>
        </AppCard>

        <AppCard style={styles.gridCard}>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Bulan Ini</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>480</Text>
          <Text style={[styles.statUnit, { color: colors.textMuted }]}>Ayat</Text>
        </AppCard>

        <AppCard style={styles.gridCard}>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Total Tilawah</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>1,240</Text>
          <Text style={[styles.statUnit, { color: colors.textMuted }]}>Ayat</Text>
        </AppCard>
      </View>

      {/* Calm Encouragement */}
      <AppCard style={styles.card}>
        <Text style={[styles.calmQuote, { color: colors.text }]}>
          "Amalan yang paling dicintai oleh Allah adalah amalan yang kontinu walaupun sedikit."
        </Text>
        <Text style={[styles.calmSource, { color: colors.textMuted }]}>
          (HR. Muslim)
        </Text>
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
  title: {
    ...Typography.headingLarge,
  },
  subtitle: {
    ...Typography.bodyMuted,
    marginTop: 2,
  },
  card: {
    padding: Spacing.lg,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakTitle: {
    ...Typography.headingSmall,
    fontSize: 18,
    fontWeight: '700',
  },
  streakSubtitle: {
    ...Typography.bodyMuted,
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  gridCard: {
    width: '47.5%',
    padding: Spacing.md,
    alignItems: 'center',
  },
  statLabel: {
    ...Typography.caption,
    textTransform: 'uppercase',
  },
  statValue: {
    ...Typography.headingLarge,
    fontSize: 32,
    marginVertical: 4,
  },
  statUnit: {
    ...Typography.caption,
  },
  calmQuote: {
    ...Typography.body,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
  },
  calmSource: {
    ...Typography.caption,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
