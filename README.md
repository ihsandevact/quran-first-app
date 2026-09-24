# Quran First 📖

> *"Baca Al-Qur'an dulu, buka aplikasi kemudian."*

Quran First adalah aplikasi mobile (React Native + Expo + TypeScript) yang membantu pengguna membangun kebiasaan membaca Al-Qur'an sebelum mengakses aplikasi-aplikasi yang mendistraksi di smartphone Android.

Aplikasi ini berbasis prinsip kebaikan dan kontrol mandiri: **habit-building**, bukan hukuman (*punishment*) maupun pengawasan (*surveillance*). Pengguna memiliki kendali penuh atas aplikasi apa yang ingin diproteksi dan berapa komitmen tilawah sebelum membuka aplikasi tersebut.

---

## 🌟 Fitur Utama (v0.1 Feasibility Spike)

1. **Quran Gate Flow**:
   - Menghadirkan jeda ketika aplikasi terproteksi (misal: Instagram) dibuka.
   - Pilihan: **Baca Sekarang** (membaca target ayat) atau **Baca Nanti** (menunda tilawah ke antrean pending).
2. **Quran Pass**:
   - Setelah tilawah selesai, Quran Pass aktif (default: 30 menit), memungkinkan akses bebas jeda tanpa gangguan berulang.
3. **Pending Tilawah**:
   - Jika memilih "Baca Nanti", ayat yang harus dibaca dicatat ke antrean Tilawah Tertunda untuk diselesaikan saat memiliki waktu luang.
4. **Android Native App Gate Spike (`expo-app-gate`)**:
   - Modul lokal Android untuk mendeteksi aplikasi foreground menggunakan `UsageStatsManager` dan Foreground Service.
   - Penanganan izin sistem `PACKAGE_USAGE_STATS` dan `SYSTEM_ALERT_WINDOW`.
5. **Local-First & Privacy-Focused**:
   - Tidak memerlukan akun atau server backend pada v0.1. Seluruh data aturan dan tilawah tersimpan lokal di perangkat.

---

## 🛠️ Tech Stack

- **Framework**: React Native with Expo SDK 57
- **Routing**: Expo Router (File-based navigation)
- **Language**: TypeScript (Strict mode)
- **State Management**: Zustand
- **Local Database**: Expo SQLite
- **Native Android Module**: Local Expo Module (`modules/expo-app-gate` in Kotlin)

---

## 🚀 Memulai Pengembangan

### 1. Prerequisites
- Node.js >= 20.x
- npm >= 10.x
- Android Studio / Android SDK (untuk build native) atau Android device fisik dengan USB debugging.

### 2. Install Dependencies
```bash
npm install
```

### 3. Menjalankan App

#### Menggunakan Expo Dev Client (Android):
```bash
npx expo run:android
```
*Catatan: Fitur deteksi aplikasi latar belakang memerlukan build native Android (Prebuild / Development Build), tidak dapat berjalan pada sandbox Expo Go standar.*

#### Menjalankan Web Preview (UI & Stores Testing):
```bash
npm run web
```

#### Type Checking:
```bash
npx tsc --noEmit
```

---

## 📂 Struktur Proyek

```
src/
├── app/                  # Expo Router file-based screens
│   ├── _layout.tsx       # Root layout & native gate event listener
│   ├── index.tsx         # Splash & Welcome screen
│   ├── (tabs)/           # Main bottom tabs (Home, Quran, Progress, Settings)
│   └── gate.tsx          # Debug Gate screen
├── components/           # Reusable UI & design system components
├── constants/            # Theme, colors (deep green, warm off-white), typography
├── database/             # SQLite schema & initialization
├── hooks/                # Theme and color scheme hooks
├── store/                # Zustand stores (app, gate, settings)
└── types/                # Core TypeScript interfaces

modules/
└── expo-app-gate/        # Local Android native module for foreground app monitoring
```

---

## 📖 Dokumentasi Lengkap

- [PRD (Product Requirements Document)](./docs/PRD.md)
- [Architecture & Data Strategy](./docs/ARCHITECTURE.md)
- [Development Guide](./docs/DEVELOPMENT.md)
- [ADR 001: Android App Detection Spike](./docs/decisions/001-android-app-detection.md)
- [Gate Test Plan & Matrix](./docs/testing/gate-test-plan.md)

---

## 📄 Lisensi
MIT License.
