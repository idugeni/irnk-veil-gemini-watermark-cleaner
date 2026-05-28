# Technical Reference: IRNK Veil Architecture

## Overview

IRNK Veil: Gemini Watermark Cleaner adalah ekstensi browser dari IRNK Codes yang membersihkan watermark Gemini secara lokal di browser dengan pemrosesan visual presisi.

## System Architecture

Sistem berjalan sebagai Chrome Extension Manifest V3 dan memproses gambar secara lokal menggunakan API browser standar.

### 1. Interception Layer

Komponen runtime memantau resource gambar Gemini yang relevan.

- **Mechanism**: Integrasi runtime pada halaman Gemini.
- **Identification**: Memfilter resource dari domain gambar Gemini yang diizinkan.
- **Capture**: Mengambil data gambar yang diperlukan untuk pemrosesan lokal.

### 2. Processing Core

Core engine menjalankan rekonstruksi area watermark.

- **Algorithm**: Reverse Alpha Reconstruction.
- **Logic**:
  1. Mengonversi gambar ke data pixel.
  2. Menganalisis dimensi gambar untuk menentukan area watermark.
  3. Mengaplikasikan alpha reconstruction di area target.
  4. Menghasilkan visual yang lebih bersih.

### 3. Runtime Pipeline

Runtime pipeline menghubungkan resource Gemini, processing core, dan UI extension.

- Menjaga proses cleanup tetap lokal.
- Mengelola status dan statistik pemrosesan.
- Mempertahankan fallback aman jika gambar tidak dapat diproses.

### 4. Popup UI

Popup IRNK Veil menyediakan:

- status aktif pada tab Gemini,
- statistik cleanup,
- konfigurasi sensitivitas,
- informasi produk dan publisher.

## Security & Privacy

- **Local Processing**: Pixel gambar diproses di browser pengguna.
- **No Uploads to IRNK Codes**: IRNK Veil tidak mengirim gambar pengguna ke server IRNK Codes.
- **Manifest V3**: Extension memakai permission terbatas sesuai kebutuhan fungsi.
- **Scoped Hosts**: Host permission dibatasi ke Gemini dan resource gambar terkait.

## Error Handling & Reliability

- **Fail-Safe**: Jika cleanup gagal, halaman tetap dapat menampilkan gambar asli.
- **Configurable Debugging**: Log debug hanya aktif jika pengguna mengaktifkan opsi debug.
- **Local Settings**: Preferensi disimpan menggunakan Chrome storage.

## Maintenance Guide

### Menyesuaikan Deteksi Watermark

Jika posisi watermark Gemini berubah, update modul runtime yang menangani metrik watermark di `src/runtime/modules`.

### Debugging

Aktifkan opsi debug pada popup untuk memeriksa proses cleanup dan status runtime.
