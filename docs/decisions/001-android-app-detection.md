# ADR 001: Android Application Detection & Gate Triggering Mechanism

- **Status**: Proposed & Implemented as Feasibility Spike
- **Date**: 2026-09-25
- **Deciders**: Quran First Engineering Team

---

## 1. Context & Problem Statement
Fitur paling berisiko secara teknis pada Quran First adalah mendeteksi secara andal saat pengguna membuka aplikasi tertentu (contoh: Instagram) dan langsung menampilkan layar Quran Gate untuk menghadirkan jeda tilawah.

Pada ekosistem Android modern (Android 10 hingga 14+), pembatasan terhadap aplikasi latar belakang (*background execution limits*) dan peluncuran aktivitas dari latar belakang (*background activity start restrictions*) sangat ketat. Oleh karena itu, diperlukan arsitektur native yang stabil dan mematuhi kebijakan Android.

---

## 2. Pilihan Pendekatan yang Dievaluasi

### Opsi A: `UsageStatsManager` + Foreground Service (Pendekatan Terpilih untuk Spike)
- **Cara Kerja**:
  - Quran First menjalankan `ForegroundService` dengan notifikasi aktif yang tenang (*low importance*).
  - Melakukan polling interval 750ms pada `UsageStatsManager.queryEvents()`.
  - Ketika package foreground cocok dengan aplikasi yang diproteksi (dan tidak ada Quran Pass yang aktif), aktivitas Quran Gate dipanggil ke depan.
- **Kelebihan**:
  - Menggunakan API resmi Android untuk pelacakan penggunaan (`PACKAGE_USAGE_STATS`).
  - Diterima secara luas oleh Google Play Store untuk kategori aplikasi Digital Wellbeing & Habit Building.
  - Aman dan tidak berisiko di-takedown dibanding AccessibilityService jika tidak memenuhi kriteria disabilitas.
- **Kelemahan & Limitasi**:
  - Ada jeda latency deteksi antara 0.5s - 1.0s karena polling interval.
  - Membutuhkan izin khusus "Akses Penggunaan" (*Usage Access*) dan "Tampil di Atas Aplikasi Lain" (*System Alert Window*).

### Opsi B: `AccessibilityService`
- **Cara Kerja**:
  - Menggunakan event `TYPE_WINDOW_STATE_CHANGED` untuk mendeteksi perubahan window seketika (0ms latency).
- **Kelebihan**:
  - Deteksi instan tanpa jeda polling.
- **Kelemahan & Risiko**:
  - Kebijakan Google Play Store sangat ketat terhadap penyalahgunaan Accessibility Service bagi aplikasi non-disabilitas. Berisiko penolakan rilis di Play Store.

---

## 3. Integrasi Expo
- Diimplementasikan melalui modul native lokal Expo: `modules/expo-app-gate`.
- Tidak memerlukan detach / ejection manual; mendukung Expo Prebuild / Development Builds (`npx expo run:android`).

---

## 4. Izin Sistem yang Diperlukan (Permissions)
1. `android.permission.PACKAGE_USAGE_STATS`: Untuk memantau aplikasi foreground.
2. `android.permission.SYSTEM_ALERT_WINDOW`: Untuk meluncurkan Gate atau overlay di atas aplikasi lain pada Android 10+.
3. `android.permission.FOREGROUND_SERVICE` & `FOREGROUND_SERVICE_SPECIAL_USE`: Untuk menjaga agar service tidak dimatikan oleh sistem.
4. `android.permission.POST_NOTIFICATIONS`: Untuk menampilkan notifikasi service pada Android 13+.

---

## 5. Pertimbangan Baterai & Kompatibilitas Perangkat
- **Baterai**: Pemantauan dilakukan dengan interval 750ms hanya saat layar menyala. Handler dapat dijeda saat layar mati (*Screen Off*) menggunakan `ACTION_SCREEN_OFF` broadcast receiver untuk menghemat baterai.
- **OEM Aggressive Battery Optimization**: Beberapa perangkat (Xiaomi MIUI/HyperOS, Huawei, Samsung) memiliki fitur penghemat baterai agresif. Pengguna perlu dipandu untuk mematikan *battery optimization* bagi Quran First jika service mati di latar belakang.

---

## 6. Known Edge Cases & Rencana Uji Coba Fisik
- **Recent Apps / App Switcher**: Berpindah cepat antar recent apps.
- **Split Screen / Multi-Window**: Dua aplikasi berjalan bersamaan di layar.
- **Screen Lock -> Unlock**: Membuka kunci layar saat aplikasi terproteksi sedang berada di foreground.
- **Device Restart**: Membutuhkan `BOOT_COMPLETED` receiver agar service aktif kembali setelah reboot.

> **Catatan Validasi**: Sesuai prinsip Task 001, fitur ini berstatus spike dan wajib diuji coba secara komprehensif pada perangkat fisik Android sebelum melanjutkan implementasi Quran dataset skala penuh.
