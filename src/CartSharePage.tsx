import React from 'react';
import { useCart } from './router';
import { QrCode } from './components/QrCode';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';


const CartSharePage: React.FC = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
  <div className="bg-white rounded-3xl shadow-lg px-6 py-4 sm:p-8 max-w-xl w-full relative">
        {/* Tombol close kanan atas */}
        <button
          className="absolute left-4 top-1 z-10 bg-white rounded-full p-1 shadow hover:bg-gray-100 text-gray-400 hover:text-red-500 transition"
          onClick={() => navigate(-1)}
          title="Tutup"
          aria-label="Tutup detail keranjang"
        >
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-center mb-6">Detail Keranjang</h1>
        <div className="flex flex-col gap-4 mb-6 max-h-96 overflow-y-auto pr-2">
          {cartItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border border-gray-100" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate text-base">{item.name}</div>
                <div className="text-xs text-gray-400 mb-1 truncate">{item.category} - {item.kode_barcode}</div>
                <span className="font-bold text-blue-600 text-base block">Rp{item.price.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center justify-center">
                <QrCode value={item.kode_barcode || item.id} />
              </div>
            </div>
          ))}
        </div>
        {/* Total harga dihilangkan */}
        <p className="text-center text-gray-500 text-sm mt-4">Tunjukkan halaman ini ke kasir untuk proses pembayaran.</p>
      </div>
    </div>
  );
};

export default CartSharePage;
