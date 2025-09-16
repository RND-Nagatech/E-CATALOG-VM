# E-Katalog VMM

Aplikasi katalog produk perhiasan berbasis web, dibuat dengan React + TypeScript + Tailwind CSS.

## Fitur Utama
- Filter produk (kategori, harga, berat, ukuran, pencarian)
- Sidebar responsif (mobile & desktop)
- Grid produk modern
- Modal detail produk
- Keranjang belanja dengan tampilan sticky checkout
- Pagination modern (angka dinamis, ellipsis, responsif)
- UI/UX clean dan modern

## Struktur Folder
- `src/` - Source code utama
  - `components/` - Komponen UI (Sidebar, ProductCard, CartModal, dsb)
  - `data/` - Mock data produk
  - `types/` - Tipe TypeScript
- `public/` - File statis
- `dist/` - Hasil build

## Instalasi & Menjalankan
1. Clone repo ini
2. Install dependencies:
   ```bash
   npm install
   ```
3. Jalankan development server:
   ```bash
   npm run dev
   ```
4. Buka di browser: [http://localhost:5173](http://localhost:5173)

## Build Production
```bash
npm run build
```
Hasil build ada di folder `dist/`.

## Stack Teknologi
- React
- TypeScript
- Tailwind CSS
- Vite

## Kontribusi
Pull request & issue sangat diterima!

---

Copyright © 2025 RND-Nagatech
