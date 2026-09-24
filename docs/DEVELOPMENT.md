# Development Guide — Quran First

## 1. Setup Lingkungan Pengembangan
1. Pastikan Node.js `>= 20.0.0` dan npm `>= 10.0.0` terpasang.
2. Clone repositori:
   ```bash
   git clone https://github.com/ihsandevact/quran-first-app.git
   cd quran-first-app
   ```
3. Install dependensi:
   ```bash
   npm install
   ```

## 2. Menjalankan Aplikasi
- **Type Checking**:
  ```bash
  npx tsc --noEmit
  ```
- **Web Preview** (Untuk evaluasi UI dan state):
  ```bash
  npm run web
  ```
- **Android Native Development Build**:
  ```bash
  npx expo run:android
  ```

## 3. Alur Pengembangan Fitur (Vibe Engineering Workflow)
Setiap penambahan atau modifikasi fitur mengikuti tahapan:
1. **UNDERSTAND**: Pahami konteks dan persyaratan spesifik.
2. **PLAN**: Susun rencana komponen dan dampaknya.
3. **IMPLEMENT**: Buat perubahan secara modular dan terisolasi.
4. **RUN & TEST**: Pastikan typecheck (`tsc --noEmit`) dan fungsi berjalan tanpa regresi.
5. **REVIEW**: Verifikasi kode dan dokumentasikan keputusan teknis.

## 4. Struktur Direktori
```
quran-first-app/
├── modules/
│   └── expo-app-gate/     # Native Android Kotlin module
├── src/
│   ├── app/               # Expo Router screens
│   ├── components/        # Reusable UI components
│   ├── constants/         # Design tokens & theme
│   ├── database/          # SQLite schema & helpers
│   ├── hooks/             # Custom hooks
│   ├── store/             # Zustand stores
│   └── types/             # TypeScript data contracts
└── docs/                  # Engineering & product documentation
```
