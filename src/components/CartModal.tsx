import React, { useState } from 'react';
import { QrCode } from './QrCode';

export const CartModal = ({ isOpen, onClose, items, onRemove }: {
	isOpen: boolean;
	onClose: () => void;
	items: any[];
	onRemove: (idx: number) => void;
}) => {
	if (!isOpen) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6 relative mx-2">
				<button
					onClick={onClose}
					className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
				>
					&times;
				</button>
				<h2 className="text-xl font-bold mb-4">Keranjang</h2>
				{items.length === 0 ? (
					<p className="text-gray-500">Keranjang kosong</p>
				) : (
					<>
						<ul className="divide-y divide-gray-200">
							{items.map((item, idx) => (
								<li key={idx} className="py-3 flex items-center gap-3 sm:py-4 sm:gap-4">
									<img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border shadow-sm" />
									<div className="flex-1 flex flex-row items-center gap-4">
										<div className="flex flex-col justify-center flex-1">
											<div className="font-semibold text-gray-900 text-base leading-tight">{item.name}</div>
											<div className="text-xs text-gray-500 mb-1">{item.category} <span className="ml-1">- {item.kode_barcode}</span></div>
											<span className="font-bold text-blue-600 text-base">Rp{item.price.toLocaleString('id-ID')}</span>
										</div>
										<div className="flex flex-col items-center justify-center">
											<QrCode value={item.kode_barcode} />
										</div>
									</div>
									<button
										className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-lg hover:bg-red-200 shadow"
										onClick={() => onRemove(idx)}
									>Hapus</button>
								</li>
							))}
						</ul>
						<ShareLinkButton items={items} />
					</>
				)}
			</div>
		</div>
	);
};

// Tombol share link dengan feedback label
const ShareLinkButton: React.FC<{ items: any[] }> = ({ items }) => {
  const [copied, setCopied] = useState(false);
		const handleShare = () => {
			const ids = items.map(item => item.id).join(',');
			// Link menuju ke halaman share keranjang
			const url = `${window.location.origin}/cart/share?ids=${ids}`;
			navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		};
  return (
    <div className="mt-6 flex justify-center">
      <button
        className={`px-4 py-2 rounded-lg text-sm font-semibold shadow transition-colors ${copied ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        onClick={handleShare}
        disabled={copied}
      >
        {copied ? 'Tersalin!' : 'Share Link Keranjang'}
      </button>
    </div>
  );
};
