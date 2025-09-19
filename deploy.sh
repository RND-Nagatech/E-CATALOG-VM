#!/bin/bash

# === Deploy Script ===
# Pastikan repo production ada di folder sejajar dengan repo development
# Contoh struktur:
#   ├── network-monitoring-dev
#   └── network-monitoring-production

# Lokasi repo dev (skrip ini dijalankan dari dalam repo dev)
DEV_DIR=$(pwd)
PROD_DIR="../e-catalog-vm-production"

echo "🚀 Build project..."
npm run build

# Cek apakah build berhasil
if [ ! -d "$DEV_DIR/dist" ]; then
  echo "❌ Build gagal! Folder dist tidak ditemukan."
  exit 1
fi

echo "🧹 Hapus dist lama di production..."
rm -rf $PROD_DIR/dist

echo "📦 Copy hasil build ke production repo..."
cp -r dist $PROD_DIR/

echo "📂 Copy package.json & package-lock.json ke production repo..."
cp package*.json $PROD_DIR/

echo "✅ Commit ke repo production..."
cd $PROD_DIR
git add .
git commit -m "Release update $(date +%F_%H:%M)" || echo "⚠️ Tidak ada perubahan untuk di-commit."
git push origin main

echo "🎉 Deploy selesai!"
