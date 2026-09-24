import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AppCard } from '@/components/ui/AppCard';
import { Spacing, Typography, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/app-store';
import { useSettingsStore } from '@/store/settings-store';
import { requestUsagePermission, requestOverlayPermission } from 'expo-app-gate';

export default function SettingsScreen() {
  const { colors } = useAppTheme();

  const protectedApps = useAppStore((s) => s.protectedApps);
  const toggleProtectedApp = useAppStore((s) => s.toggleProtectedApp);
  const gateRules = useAppStore((s) => s.gateRules);

  const themeMode = useSettingsStore((s) => s.themeMode);
  const defaultPassMinutes = useSettingsStore((s) => s.defaultQuranPassMinutes);

  return (
    <ScreenWrapper scrollable contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Pengaturan</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Sesuaikan aturan jeda dan komitmen tilawahmu
        </Text>
      </View>

      {/* Protected Apps List */}
      <AppCard style={styles.card}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Aplikasi yang Dilindungi</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
          Pilih aplikasi yang akan menghadirkan Quran Gate sebelum dibuka
        </Text>

        <View style={styles.list}>
          {protectedApps.map((app) => {
            const rule = gateRules.find((r) => r.protectedAppId === app.id);
            return (
              <View
                key={app.id}
                style={[styles.itemRow, { borderColor: colors.cardBorder }]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.itemName, { color: colors.text }]}>{app.appName}</Text>
                  <Text style={[styles.itemDetail, { color: colors.textMuted }]}>
                    {rule ? `${rule.requirementValue} Ayat sebelum buka` : 'Aturan default'}
                  </Text>
                </View>
                <Switch
                  value={app.enabled}
                  onValueChange={() => toggleProtectedApp(app.id)}
                  trackColor={{ false: '#D1D5DB', true: colors.primaryLight }}
                  thumbColor={app.enabled ? colors.primary : '#F4F4F5'}
                />
              </View>
            );
          })}
        </View>
      </AppCard>

      {/* Android System Permissions */}
      <AppCard style={styles.card}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Izin Sistem Android</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
          Diperlukan agar Quran First dapat mendeteksi aplikasi yang dipilih
        </Text>

        <View style={styles.list}>
          <TouchableOpacity
            style={[styles.itemRow, { borderColor: colors.cardBorder }]}
            onPress={requestUsagePermission}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemName, { color: colors.text }]}>Akses Penggunaan (Usage Access)</Text>
              <Text style={[styles.itemDetail, { color: colors.textMuted }]}>
                Mendeteksi kapan aplikasi pilihan sedang dibuka
              </Text>
            </View>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>Atur ›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.itemRow, { borderColor: colors.cardBorder }]}
            onPress={requestOverlayPermission}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemName, { color: colors.text }]}>Tampil di Atas Aplikasi Lain</Text>
              <Text style={[styles.itemDetail, { color: colors.textMuted }]}>
                Menampilkan Gate jeda tilawah secara langsung
              </Text>
            </View>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>Atur ›</Text>
          </TouchableOpacity>
        </View>
      </AppCard>

      {/* Quran Pass Setting */}
      <AppCard style={styles.card}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Durasi Quran Pass</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
          Masa aktif akses bebas jeda setelah menyelesaikan tilawah
        </Text>

        <View style={[styles.itemRow, { borderBottomWidth: 0 }]}>
          <Text style={[styles.itemName, { color: colors.text }]}>Default: {defaultPassMinutes} Menit</Text>
          <View style={[styles.badge, { backgroundColor: colors.primaryMuted }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>Aktif</Text>
          </View>
        </View>
      </AppCard>

      {/* Philosophy Card */}
      <AppCard style={[styles.card, { backgroundColor: colors.accentGoldSoft }]}>
        <Text style={[styles.philosophyTitle, { color: colors.accentGold }]}>
          Prinsip Quran First
        </Text>
        <Text style={[styles.philosophyText, { color: colors.text }]}>
          "Baca Al-Qur'an dulu, buka aplikasi kemudian."
          {"\n\n"}
          Ini adalah aplikasi pembangun kebiasaan baik, bukan alat hukuman atau pengawasan. Kamu selalu memegang kendali penuh.
        </Text>
      </AppCard>

      {/* App Version */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSubtle }]}>
          Quran First v0.1 (Feasibility Spike)
        </Text>
        <Text style={[styles.footerText, { color: colors.textSubtle }]}>
          Built with React Native & Expo
        </Text>
      </View>
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
  sectionTitle: {
    ...Typography.headingSmall,
  },
  sectionSubtitle: {
    ...Typography.caption,
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  list: {
    marginTop: Spacing.xs,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
  },
  itemName: {
    ...Typography.body,
    fontWeight: '600',
  },
  itemDetail: {
    ...Typography.caption,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  philosophyTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  philosophyText: {
    ...Typography.body,
    fontSize: 13,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
  },
});
