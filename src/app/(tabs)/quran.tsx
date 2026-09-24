import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AppCard } from '@/components/ui/AppCard';
import { Spacing, Typography, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-theme';
import { SurahSummary } from '@/types';

const MOCK_SURAHS: SurahSummary[] = [
  { number: 1, nameArabic: 'الفاتحة', nameLatin: 'Al-Fatihah', meaning: 'Pembukaan', numberOfAyahs: 7, revelationType: 'Makkiyah' },
  { number: 2, nameArabic: 'البقرة', nameLatin: 'Al-Baqarah', meaning: 'Sapi Betina', numberOfAyahs: 286, revelationType: 'Madaniyah' },
  { number: 3, nameArabic: 'آل عمران', nameLatin: "Ali 'Imran", meaning: 'Keluarga Imran', numberOfAyahs: 200, revelationType: 'Madaniyah' },
  { number: 4, nameArabic: 'النساء', nameLatin: "An-Nisa'", meaning: 'Wanita', numberOfAyahs: 176, revelationType: 'Madaniyah' },
  { number: 5, nameArabic: 'المائدة', nameLatin: "Al-Ma'idah", meaning: 'Hidangan', numberOfAyahs: 120, revelationType: 'Madaniyah' },
  { number: 6, nameArabic: 'الأنعام', nameLatin: "Al-An'am", meaning: 'Binatang Ternak', numberOfAyahs: 165, revelationType: 'Makkiyah' },
  { number: 7, nameArabic: 'الأعراف', nameLatin: "Al-A'raf", meaning: 'Tempat Tertinggi', numberOfAyahs: 206, revelationType: 'Makkiyah' },
];

export default function QuranScreen() {
  const { colors } = useAppTheme();

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Al-Qur'an</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Daftar Surah (Dataset v0.1 Mock)
        </Text>
      </View>

      <FlatList
        data={MOCK_SURAHS}
        keyExtractor={(item) => item.number.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Spacing.xl, gap: Spacing.sm }}
        renderItem={({ item }) => (
          <AppCard style={styles.surahCard}>
            <View style={styles.surahRow}>
              <View style={[styles.numberBox, { backgroundColor: colors.primaryMuted }]}>
                <Text style={[styles.numberText, { color: colors.primary }]}>{item.number}</Text>
              </View>

              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <Text style={[styles.surahLatin, { color: colors.text }]}>{item.nameLatin}</Text>
                <Text style={[styles.surahInfo, { color: colors.textMuted }]}>
                  {item.revelationType} • {item.numberOfAyahs} Ayat
                </Text>
              </View>

              <Text style={[styles.surahArabic, { color: colors.primary }]}>{item.nameArabic}</Text>
            </View>
          </AppCard>
        )}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
  },
  header: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.headingLarge,
  },
  subtitle: {
    ...Typography.bodyMuted,
    marginTop: 2,
  },
  surahCard: {
    padding: Spacing.md,
  },
  surahRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  numberBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 14,
    fontWeight: '700',
  },
  surahLatin: {
    ...Typography.headingSmall,
    fontSize: 16,
  },
  surahInfo: {
    ...Typography.caption,
    marginTop: 2,
  },
  surahArabic: {
    fontSize: 20,
    fontWeight: '600',
  },
});
