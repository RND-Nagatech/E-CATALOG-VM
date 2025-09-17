import React from 'react';

import { useNavigate } from 'react-router-dom';
import { X, ChevronLeft } from 'lucide-react';

const CartPage: React.FC<{
  items: any[];
  onRemove: (idx: number) => void;
}> = ({ items, onRemove }) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate('/cart/detail');
  };

  return (
  <div className="min-h-screen bg-white flex flex-col items-center">
    {/* Header sticky */}
    <div className="w-full max-w-lg bg-white sticky top-0 left-0 z-20 border-b shadow flex items-center justify-center px-4 py-3">
        {/* Tombol kembali sejajar header */}
        <button
          className="absolute left-4 top-3 z-30 bg-white shadow-lg rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition"
          onClick={() => navigate(-1)}
          title="Kembali"
          aria-label="Kembali"
        >
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
        <div className="flex items-center gap-2 justify-center w-full">
          <h1 className="text-lg font-bold text-gray-900">Keranjang</h1>
          {items.length > 0 && (
            <span className="ml-1 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          )}
        </div>
      </div>

      {/* Main Content: scrollable only for items */}
      <div
        className="w-full max-w-lg flex-1 px-2 sm:px-0 overflow-y-auto pb-28"
        style={{ minHeight: 0 }}
      >
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 select-none">
            <p className="text-gray-400 text-lg font-semibold mb-1">Keranjang kosong</p>
            <p className="text-gray-400 text-sm">Belum ada produk dipilih.</p>
          </div>
        ) : (
          <div className="mt-2 rounded-2xl border border-gray-100 bg-white p-2 flex flex-col gap-3">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex gap-3 items-center bg-white rounded-xl border border-gray-200 px-3 py-3 hover:border-blue-300 transition group"
              >
                {/* Left: Image */}
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border border-gray-100" />
                {/* Middle: Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate text-base group-hover:text-blue-700 transition-colors">{item.name}</div>
                  <div className="text-xs text-gray-400 mb-1 truncate">{item.category} <span className="ml-1">- {item.kode_barcode}</span></div>
                  <span className="font-bold text-blue-600 text-base block">Rp{item.price.toLocaleString('id-ID')}</span>
                </div>
                {/* Right: Close only */}
                <div className="flex flex-col items-center justify-center min-w-[56px] relative">
                  <button
                    className="absolute -top-3 right-1 bg-white border border-gray-200 rounded-full p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                    title="Hapus"
                    onClick={() => onRemove(idx)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 w-full flex justify-center z-30">
        <div className="w-full max-w-lg bg-white border-t px-4 py-4 flex flex-col gap-2">
          {/* Total harga dihilangkan */}
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-lg flex items-center justify-center gap-2 transition"
            disabled={items.length === 0}
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
