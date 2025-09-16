import React from 'react';
import { Product } from '../types/Product';
import { X, Heart, ShoppingCart } from 'lucide-react';
import { QrCode } from './QrCode';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart?: (product: Product) => void;
  cartItems?: Product[];
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ isOpen, onClose, product, onAddToCart, cartItems }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-0 relative animate-[fadeIn_0.3s] mx-4 sm:mx-8 md:mx-2"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-gray-100 shadow transition-colors"
          title="Tutup"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
        <div className="flex flex-col md:flex-row items-center gap-6 p-5 md:p-8">
          <div className="flex-shrink-0 w-full md:w-auto flex justify-center">
            <img src={product.image} alt={product.name} className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl shadow-lg border border-gray-100" />
          </div>
          <div className="flex-1 flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 ">{product.name}</h2>
              {product.inStock ? (
                <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-semibold">Tersedia</span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">Stok Habis</span>
              )}
            </div>
            <div className="flex flex-row items-center gap-4 mb-2">
              <div className="flex flex-col gap-1 text-xs md:text-sm text-gray-500">
                <span><span className="font-semibold">Kategori:</span> {product.category}</span>
                <span><span className="font-semibold">Berat:</span> {product.weight}g</span>
                <span><span className="font-semibold">Ukuran:</span> {product.dimensions.width} cm</span>
              </div>
              <div className="ml-auto flex flex-col items-center">
                <QrCode value={product.kode_barcode} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-base md:text-lg font-bold text-blue-600 mt-2">
              <ShoppingCart className="h-5 w-5" />
              Rp{product.price.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="text-xs md:text-sm text-gray-600">{product.likes} disukai</span>
            </div>
            <div className="flex flex-col gap-3 mt-4 w-full">
              <button
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow w-full md:w-auto ${product && cartItems?.some(p => p.id === product.id) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                onClick={() => product && onAddToCart && !cartItems?.some(p => p.id === product.id) && onAddToCart(product)}
                disabled={product && cartItems?.some(p => p.id === product.id)}
              >
                <ShoppingCart className="h-4 w-4" />
                {product && cartItems?.some(p => p.id === product.id) ? 'Sudah di Keranjang' : 'Tambah ke Keranjang'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
