import React, { useState, useEffect, useRef } from 'react';
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
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const catDropdownRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isSidebarModal, setIsSidebarModal] = useState(
    typeof window !== 'undefined' && window.innerWidth < 1375
  );
  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== 'undefined' && window.innerWidth <= 661
  );

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarModal(window.innerWidth < 1375);
      setIsSmallScreen(window.innerWidth <= 661);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      searchQuery: e.target.value
    });
  };

  const handleCategoryChange = (cat: string) => {
    if (filters.categories.includes(cat)) {
      onFiltersChange({ ...filters, categories: filters.categories.filter(c => c !== cat) });
    } else {
      onFiltersChange({ ...filters, categories: [...filters.categories, cat] });
    }
  };

  return (
    <>
      {/* Overlay for mobile modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300 ${
          isSidebarModal && isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
        aria-label="Tutup Filter"
      />

      {/* Sidebar container - always rendered */}
      <div
        ref={sidebarRef}
        className={
          isSidebarModal
            ? `fixed top-0 left-0 h-full w-4/5 max-w-xs bg-white z-50 shadow-lg transition-transform duration-300 rounded-xl px-4 pt-6 pb-10 sm:px-6 flex flex-col ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : `sticky top-16 h-screen w-full max-w-xs bg-white rounded-xl shadow-lg px-4 pt-6 pb-10 sm:px-6 overflow-visible hidden custom1375:block`
        }
        style={{ boxSizing: 'border-box' }}
      >
        <div className={`p-4 h-full flex-1 ${isSidebarModal ? 'overflow-y-auto' : 'overflow-hidden'}`}>
          {/* Search - only on desktop (custom1375 and up) */}
          <div className="relative mb-8 hidden custom1375:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari produk..."
              value={filters.searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
          </div>

          {/* Categories dropdown */}
          <div className="mb-6 relative" ref={catDropdownRef}>
            <button
              type="button"
              className={`flex items-center justify-between w-full text-sm font-semibold text-gray-700 px-3 py-2 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${
                showCatDropdown ? 'border-blue-400' : ''
              }`}
              onClick={() => setShowCatDropdown(v => !v)}
              aria-expanded={showCatDropdown}
            >
              <span>Kategori</span>
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${
                  showCatDropdown ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={`absolute left-0 w-full mt-2 rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-200 z-20 ${
                showCatDropdown
                  ? 'opacity-100 visible translate-y-0'
                  : 'opacity-0 invisible -translate-y-2'
              }`}
            >
              <div className="p-3">
                {categories.map(cat => (
                  <label
                    key={cat}
                    className="flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-blue-50 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
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
                  <span key={cat} className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Range sliders */}
          <RangeSlider
            label="Harga"
            min={0}
            max={10000000}
            value={filters.priceRange}
            onChange={(priceRange) => onFiltersChange({ ...filters, priceRange })}
            unit="Rp"
            step={50000}
          />
          <RangeSlider
            label="Berat"
            min={0}
            max={50}
            value={filters.weightRange}
            onChange={(weightRange) => onFiltersChange({ ...filters, weightRange })}
            unit="g"
            step={1}
          />
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

          {/* Sort and items per page dropdowns - only on screens <= 661px */}
          {isSmallScreen && (
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
                const selectedSort = sortOptions.find(
                  opt => opt.value === filters.sortBy + '-' + filters.sortOrder
                );
                return (
                  <div className="mb-2 relative">
                    <button
                      type="button"
                      className={`flex items-center justify-between w-full text-sm font-semibold text-gray-700 px-3 py-2 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${
                        showSortDropdown ? 'border-blue-400' : ''
                      }`}
                      onClick={() => setShowSortDropdown(v => !v)}
                      aria-expanded={showSortDropdown}
                    >
                      <span>Urutkan: {selectedSort ? selectedSort.label : 'Pilih'}</span>
                      <svg
                        className={`w-4 h-4 ml-2 transition-transform ${
                          showSortDropdown ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      className={`absolute left-0 w-full mt-2 rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-200 z-20 ${
                        showSortDropdown
                          ? 'opacity-100 visible translate-y-0'
                          : 'opacity-0 invisible -translate-y-2'
                      }`}
                    >
                      <div className="p-2">
                        {sortOptions.map(opt => (
                          <button
                            key={opt.value}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-blue-50 ${
                              selectedSort && selectedSort.value === opt.value
                                ? 'bg-blue-100 text-blue-700 font-semibold'
                                : 'text-gray-700'
                            }`}
                            onClick={() => {
                              setShowSortDropdown(false);
                              if (opt.value === 'price-asc')
                                onFiltersChange({ ...filters, sortBy: 'price', sortOrder: 'asc' });
                              else if (opt.value === 'price-desc')
                                onFiltersChange({ ...filters, sortBy: 'price', sortOrder: 'desc' });
                              else if (opt.value === 'weight-asc')
                                onFiltersChange({ ...filters, sortBy: 'weight', sortOrder: 'asc' });
                              else if (opt.value === 'weight-desc')
                                onFiltersChange({ ...filters, sortBy: 'weight', sortOrder: 'desc' });
                              else if (opt.value === 'likes-desc')
                                onFiltersChange({ ...filters, sortBy: 'likes', sortOrder: 'desc' });
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
                      className={`flex items-center justify-between w-full text-sm font-semibold text-gray-700 px-3 py-2 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${
                        showPerPageDropdown ? 'border-blue-400' : ''
                      }`}
                      onClick={() => setShowPerPageDropdown(v => !v)}
                      aria-expanded={showPerPageDropdown}
                    >
                      <span>Tampilkan: {itemsPerPage}</span>
                      <svg
                        className={`w-4 h-4 ml-2 transition-transform ${
                          showPerPageDropdown ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      className={`absolute left-0 w-full mt-2 rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-200 z-20 ${
                        showPerPageDropdown
                          ? 'opacity-100 visible translate-y-0'
                          : 'opacity-0 invisible -translate-y-2'
                      }`}
                    >
                      <div className="p-2">
                        {perPageOptions.map(opt => (
                          <button
                            key={opt}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-blue-50 ${
                              itemsPerPage === opt
                                ? 'bg-blue-100 text-blue-700 font-semibold'
                                : 'text-gray-700'
                            }`}
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
          )}
        </div>

        {/* Close button for mobile modal */}
        {isSidebarModal && (
          <button
            className="absolute bottom-4 right-4 bg-white border border-gray-200 shadow-lg rounded-full p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            onClick={onClose}
            aria-label="Tutup Filter"
            type="button"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
      </div>
    </>
  );
};