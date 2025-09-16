import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft } from 'lucide-react';
import { RangeSlider } from './RangeSlider';
import { FilterState } from '../types/Product';

interface SidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
  itemsPerPage: number;
  onItemsPerPageChange: (n: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  filters,
  onFiltersChange,
  isOpen,
  onClose,
  itemsPerPage,
  onItemsPerPageChange
}) => {
  const categories = ['Cincin', 'Kalung', 'Gelang', 'Anting', 'Bros', 'Liontin'];

  // State for category and custom dropdowns
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  // Ref untuk dropdown kategori
  const catDropdownRef = React.useRef<HTMLDivElement>(null);

  // Tutup dropdown kategori jika klik di luar
  useEffect(() => {
    if (!showCatDropdown) return;
    function handleClickOutside(e: MouseEvent) {
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target as Node)) {
        setShowCatDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCatDropdown]);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      searchQuery: e.target.value
    });
  };








  // Only render sidebar as modal if open, always render on >=1375px
  const [isSidebarModal, setIsSidebarModal] = useState(
    typeof window !== 'undefined' && window.innerWidth < 1375
  );

  // Listen to resize and update isSidebarModal
  useEffect(() => {
    const handleResize = () => {
      const modal = window.innerWidth < 1375;
      setIsSidebarModal(modal);
      // Jika berubah ke desktop, tutup sidebar modal
      if (!modal && isOpen) {
        onClose();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, onClose]);

  if (isSidebarModal && !isOpen) return null;

  // Overlay for mobile: click to close
  if (isSidebarModal && isOpen) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={onClose}
          aria-label="Tutup Filter"
        />
        <div
          className={`fixed top-0 left-0 h-full w-4/5 max-w-xs bg-white z-50 shadow-lg transition-transform duration-300 rounded-xl px-4 pt-6 pb-10 sm:px-6 flex flex-col`}
          style={{ boxSizing: 'border-box' }}
        >
          <div className="p-4 overflow-y-auto h-full flex-1">
            {/* Filter content start */}
            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={filters.searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>
            {/* Categories as dropdown with checkbox */}
            <div className="mb-6 relative" ref={catDropdownRef}>
              <button
                type="button"
                className={`flex items-center justify-between w-full text-sm font-semibold text-gray-700 px-3 py-2 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${showCatDropdown ? 'border-blue-400' : ''}`}
                onClick={() => setShowCatDropdown(v => !v)}
                aria-expanded={showCatDropdown}
              >
                <span>Kategori</span>
                <svg className={`w-4 h-4 ml-2 transition-transform ${showCatDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className={`absolute left-0 w-full mt-2 rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-200 z-20 ${showCatDropdown ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                <div className="p-3">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-blue-50 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(cat)}
                        onChange={() => {
                          if (filters.categories.includes(cat)) {
                            onFiltersChange({ ...filters, categories: filters.categories.filter(c => c !== cat) });
                          } else {
                            onFiltersChange({ ...filters, categories: [...filters.categories, cat] });
                          }
                        }}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
              {filters.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {filters.categories.map(cat => (
                    <span key={cat} className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">{cat}</span>
                  ))}
                </div>
              )}
            </div>
            {/* Price Range */}
            <RangeSlider
              label="Harga"
              min={0}
              max={10000000}
              value={filters.priceRange}
              onChange={(priceRange) => onFiltersChange({ ...filters, priceRange })}
              unit="Rp"
              step={50000}
            />
            {/* Weight Range */}
            <RangeSlider
              label="Berat"
              min={0}
              max={50}
              value={filters.weightRange}
              onChange={(weightRange) => onFiltersChange({ ...filters, weightRange })}
              unit="g"
              step={1}
            />
            {/* Size Range */}
            <div className="mb-8">
              <RangeSlider
                label="Ukuran"
                min={0}
                max={1000}
                value={filters.sizeRange}
                onChange={(sizeRange) => onFiltersChange({ ...filters, sizeRange })}
                step={5}
              />
            </div>

            {/* Custom Dropdowns for Sort By & Items Per Page (mobile) */}
            <div className="flex flex-col gap-4 mb-4">
              {/* Sort By Dropdown */}
              {(() => {
                const sortOptions = [
                  { value: 'name-asc', label: 'Nama (A-Z)' },
                  { value: 'price-asc', label: 'Harga Termurah' },
                  { value: 'price-desc', label: 'Harga Termahal' },
                  { value: 'weight-asc', label: 'Berat Teringan' },
                  { value: 'weight-desc', label: 'Berat Terberat' },
                  { value: 'likes-desc', label: 'Paling Banyak Disukai' },
                ];
                const selectedSort = sortOptions.find(opt => opt.value === filters.sortBy + '-' + filters.sortOrder);
                return (
                  <div className="mb-2 relative">
                    <button
                      type="button"
                      className={`flex items-center justify-between w-full text-sm font-semibold text-gray-700 px-3 py-2 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${showSortDropdown ? 'border-blue-400' : ''}`}
                      onClick={() => setShowSortDropdown(v => !v)}
                      aria-expanded={showSortDropdown}
                    >
                      <span>Urutkan: {selectedSort ? selectedSort.label : 'Pilih'}</span>
                      <svg className={`w-4 h-4 ml-2 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className={`absolute left-0 w-full mt-2 rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-200 z-20 ${showSortDropdown ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                      <div className="p-2">
                        {sortOptions.map(opt => (
                          <button
                            key={opt.value}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-blue-50 ${selectedSort && selectedSort.value === opt.value ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'}`}
                            onClick={() => {
                              setShowSortDropdown(false);
                              if (opt.value === 'price-asc') onFiltersChange({ ...filters, sortBy: 'price', sortOrder: 'asc' });
                              else if (opt.value === 'price-desc') onFiltersChange({ ...filters, sortBy: 'price', sortOrder: 'desc' });
                              else if (opt.value === 'weight-asc') onFiltersChange({ ...filters, sortBy: 'weight', sortOrder: 'asc' });
                              else if (opt.value === 'weight-desc') onFiltersChange({ ...filters, sortBy: 'weight', sortOrder: 'desc' });
                              else if (opt.value === 'likes-desc') onFiltersChange({ ...filters, sortBy: 'likes', sortOrder: 'desc' });
                              else onFiltersChange({ ...filters, sortBy: 'name', sortOrder: 'asc' });
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
              {/* Items Per Page Dropdown */}
              {(() => {
                const perPageOptions = [10, 50, 100];
                return (
                  <div className="mb-2 relative">
                    <button
                      type="button"
                      className={`flex items-center justify-between w-full text-sm font-semibold text-gray-700 px-3 py-2 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${showPerPageDropdown ? 'border-blue-400' : ''}`}
                      onClick={() => setShowPerPageDropdown(v => !v)}
                      aria-expanded={showPerPageDropdown}
                    >
                      <span>Tampilkan: {itemsPerPage}</span>
                      <svg className={`w-4 h-4 ml-2 transition-transform ${showPerPageDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className={`absolute left-0 w-full mt-2 rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-200 z-20 ${showPerPageDropdown ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                      <div className="p-2">
                        {perPageOptions.map(opt => (
                          <button
                            key={opt}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-blue-50 ${itemsPerPage === opt ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'}`}
                            onClick={() => {
                              setShowPerPageDropdown(false);
                              onItemsPerPageChange(opt);
                            }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
          {/* Chevron left close button at bottom right, inside sidebar */}
          <button
            className="absolute bottom-4 right-4 bg-white border border-gray-200 shadow-lg rounded-full p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            onClick={onClose}
            aria-label="Tutup Filter"
            type="button"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
      </>
    );
  }

  // Desktop sidebar (>=1375px)
  return (
    <div
      className={`sticky top-16 h-screen w-full max-w-xs bg-white rounded-xl shadow-lg transform transition-transform duration-300 ease-in-out px-4 pt-6 pb-10 sm:px-6 overflow-visible hidden custom1375:block`}
    >
      <div className="p-4 overflow-y-auto h-full overflow-visible">
        {/* Filter content start */}
        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          />
        </div>
        {/* Categories as dropdown with checkbox */}
        <div className="mb-6 relative">
          <button
            type="button"
            className={`flex items-center justify-between w-full text-sm font-semibold text-gray-700 px-3 py-2 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${showCatDropdown ? 'border-blue-400' : ''}`}
            onClick={() => setShowCatDropdown(v => !v)}
            aria-expanded={showCatDropdown}
          >
            <span>Kategori</span>
            <svg className={`w-4 h-4 ml-2 transition-transform ${showCatDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          <div className={`absolute left-0 w-full mt-2 rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-200 z-20 ${showCatDropdown ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
            <div className="p-3">
              {categories.map(cat => (
                <label key={cat} className="flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-blue-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(cat)}
                    onChange={() => {
                      if (filters.categories.includes(cat)) {
                        onFiltersChange({ ...filters, categories: filters.categories.filter(c => c !== cat) });
                      } else {
                        onFiltersChange({ ...filters, categories: [...filters.categories, cat] });
                      }
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>
          {filters.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {filters.categories.map(cat => (
                <span key={cat} className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">{cat}</span>
              ))}
            </div>
          )}
        </div>
        {/* Price Range */}
        <RangeSlider
          label="Harga"
          min={0}
          max={10000000}
          value={filters.priceRange}
          onChange={(priceRange) => onFiltersChange({ ...filters, priceRange })}
          unit="Rp"
          step={50000}
        />
        {/* Weight Range */}
        <RangeSlider
          label="Berat"
          min={0}
          max={50}
          value={filters.weightRange}
          onChange={(weightRange) => onFiltersChange({ ...filters, weightRange })}
          unit="g"
          step={1}
        />
        {/* Size Range */}
        <div className="mb-8">
          <RangeSlider
            label="Ukuran"
            min={0}
            max={1000}
            value={filters.sizeRange}
            onChange={(sizeRange) => onFiltersChange({ ...filters, sizeRange })}
            step={5}
          />
        </div>
        {/* End filter content */}
      </div>
    </div>
  );
};