import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Product } from '../types/Product';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onProductClick?: (product: Product) => void;
  isInCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onProductClick, isInCart }) => {
  const [likes, setLikes] = useState(product.likes);
  const [loved, setLoved] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (loved) {
      const timeout = setTimeout(() => {
        setLoved(false);
      }, 300000); // 5 menit
      setTimer(timeout);
      return () => clearTimeout(timeout);
    }
    // Cleanup timer jika loved berubah
    if (timer) clearTimeout(timer);
  }, [loved]);

  const handleLove = () => {
    if (!loved) {
      setLikes(likes + 1);
      setLoved(true);
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden flex flex-col w-full max-w-xs mx-auto cursor-pointer min-h-[340px] sm:min-h-[360px]"
      onClick={e => {
        // Hindari trigger modal jika klik tombol Add to Cart atau Love
        if (
          (e.target as HTMLElement).closest('button')
        ) return;
        if (onProductClick) onProductClick(product);
      }}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-medium">Stok Habis</span>
          </div>
        )}
        <button
          className={`absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 ${loved ? 'cursor-not-allowed opacity-60' : 'opacity-80 group-hover:opacity-100'}`}
          onClick={handleLove}
          disabled={loved}
          title={loved ? 'Tunggu 5 menit untuk love lagi' : 'Love produk ini'}
        >
          <Heart className={`h-5 w-5 ${loved ? 'text-red-500' : 'text-gray-400'} transition-colors`} />
        </button>
      </div>

      {/* Product Info */}
  <div className="flex-1 flex flex-col px-3 pt-4 pb-3 sm:px-4">
        <span className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {product.category === 'Cincin'
            ? `${product.category.toUpperCase()} - ${product.kode_barcode}`
            : product.category}
        </span>
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <span className="text-xs text-gray-500 mb-2">
          {product.inStock ? 'Tersedia' : 'Stok Habis'}
        </span>
        <div className="flex items-center mb-2">
          <Heart className="h-4 w-4 text-red-500 mr-1" />
          <span className="text-xs text-gray-600">
            {likes} disukai
          </span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-base font-semibold text-gray-900">
              {/* Rp{product.price} */}
              Rp {new Intl.NumberFormat("id-ID").format(product.price)}
            </span>
          </div>
          <div className="text-xs text-gray-500 text-right">
            {product.category === 'Kalung' || product.category === 'Gelang' ? (
              <>Berat: {product.weight}g<br />Ukuran: {product.dimensions.width} cm</>
            ) : product.category === 'Cincin' ? (
              <>Berat: {product.weight}g<br />Ukuran: {product.dimensions.width}</>
            ) : (
              <>Berat: {product.weight}g<br />Ukuran: -</>
            )}
          </div>
        </div>
        {product.inStock && (
          <button
            className={`w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${!!isInCart ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            title={!!isInCart ? 'Sudah di keranjang' : 'Tambah ke keranjang'}
            onClick={() => !isInCart && onAddToCart && onAddToCart(product)}
            disabled={!!isInCart}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.6 17h8.8a1 1 0 00.95-1.3L17 13M7 13V6h13" /></svg>
            {!!isInCart ? 'Sudah di Keranjang' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
};