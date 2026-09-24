# Architecture & Technical Strategy — Quran First

## 1. Overview Arsitektur
Quran First v0.1 dirancang menggunakan arsitektur **Local-First** dengan modularitas tinggi antara antarmuka React Native, state management Zustand, database lokal SQLite, dan modul native Android.

```
┌────────────────────────────────────────────────────────┐
│                   React Native UI Layer                │
│  (Expo Router screens: Welcome, Home, Settings, Gate) │
└──────────────────────────┬─────────────────────────────┘
                           │
       ┌───────────────────┼────────────────────┐
       ▼                   ▼                    ▼
┌──────────────┐   ┌───────────────┐   ┌────────────────┐
│ Zustand      │   │  Expo SQLite  │   │ expo-app-gate  │
│ Stores       │   │  (Persistent) │   │ (Local Native) │
└──────┬───────┘   └───────────────┘   └───────┬────────┘
       │                                       │
       └────────────── Event Bus ──────────────┘
```

## 2. Lapisan Modul & Tanggung Jawab

### A. State Layer (Zustand)
- `useAppStore`: Menyimpan daftar aplikasi yang diproteksi, aturan gate per aplikasi, daftar pending tilawah, status Quran Pass, dan progres harian.
- `useGateStore`: Mengelola status sesi aktif Gate (ayat yang sedang dibaca, status visibilitas, aksi penundaan/penyelesaian).
- `useSettingsStore`: Mengelola preferensi tema, durasi Quran Pass, dan notifikasi.

### B. Persistent Storage (Expo SQLite)
- Tabel: `protected_apps`, `gate_rules`, `reading_sessions`, `pending_tilawah`, `quran_passes`, `bookmarks`, `settings`.
- Skema terstruktur dengan migrasi dari awal tanpa perubahan ad-hoc.

### C. Native Bridge (`modules/expo-app-gate`)
- Modul lokal Expo berbasis Kotlin.
- Berkomunikasi melalui `Expo Modules API`.
- Menyediakan bridge untuk memeriksa izin sistem (`hasUsagePermission`, `hasOverlayPermission`), memulai `AppGateForegroundService`, dan mengirimkan event `onAppDetected` ke JavaScript.

## 3. Privacy & Security Principles
- **No general tracking**: Modul hanya memverifikasi apakah paket aplikasi yang aktif cocok dengan daftar paket yang diproteksi pengguna.
- **Zero data inspection**: Aplikasi tidak pernah membaca konten pesan, notifikasi dari aplikasi lain, ataupun data pribadi pengguna.
- **Fully local**: Seluruh metadata disimpan secara lokal di SQLite perangkat.
