import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../types/Product';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  cartItems: Product[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, loading = false, onProductClick, onAddToCart, cartItems }) => {
  if (loading) {
    return (
      <div className="product-grid-container grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 custom1375:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200" />
            <div className="p-4">
              <div className="h-3 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded mb-3" />
              <div className="h-8 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
        <div className="text-gray-400 mb-4">
          <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-6m-10 0h6" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="product-grid-container grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 custom1375:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onProductClick={() => onProductClick && onProductClick(product)}
          onAddToCart={() => onAddToCart && onAddToCart(product)}
          isInCart={cartItems ? cartItems.some((p: Product) => p.id === product.id) : false}
        />
      ))}
    </div>
  );
};