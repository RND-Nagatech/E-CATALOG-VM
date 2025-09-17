import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, ShoppingCart } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { Product } from './types/Product';
import { useCart } from './router';
import { mockProducts } from './data/mockProducts';
import type { FilterState } from './types/Product';

function App() {
  // Auto-close sidebar on mode change & force re-render
  useEffect(() => {
    const handleResize = () => {
      // Always close sidebar on mode change
      setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Force re-render on resize to fix blank bug
  const [, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 10000000],
    weightRange: [0, 50],
    sizeRange: [0, 1000],
    searchQuery: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [selectedProduct, setSelectedProduct] = useState<import('./types/Product').Product | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  // const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useCart();

  // Reset to page 1 if filters or itemsPerPage change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, itemsPerPage]);

  // Auto-load cart from ?cart=... on first load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cartParam = params.get('cart');
    if (cartParam) {
      const ids = cartParam.split(',').map(id => parseInt(id, 10)).filter(Boolean);
      const products = mockProducts.filter((p: Product) => ids.includes(p.id));
      if (products.length > 0) setCartItems(products);
    }
    // eslint-disable-next-line
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = mockProducts.filter((product: Product) => {
      // Hide products that are not in stock
      if (!product.inStock) {
        return false;
      }
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }
      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }
      // Weight filter
      if (product.weight < filters.weightRange[0] || product.weight > filters.weightRange[1]) {
        return false;
      }
      // Size filter (using maximum dimension)
      const maxDimension = Math.max(product.dimensions.width, product.dimensions.height, product.dimensions.depth);
      if (maxDimension < filters.sizeRange[0] || maxDimension > filters.sizeRange[1]) {
        return false;
      }
      // Search query
      if (filters.searchQuery && !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) && 
          !product.description.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });

    // Sort products
    filtered.sort((a: Product, b: Product) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'weight':
          comparison = a.weight - b.weight;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'likes':
          comparison = a.likes - b.likes;
          break;
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [filters]);

  return (
  <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {/* Hamburger filter for <1375px (mobile & tablet & small desktop) */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="custom1375:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Buka Filter"
                aria-label="Buka Menu Filter"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center ml-2 lg:ml-0">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EC</span>
                </div>
                <h1 className="ml-3 text-xl font-semibold text-gray-900">
                  E-Catalog
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                className="relative p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                onClick={() => navigate('/cart')}
                title="Lihat Keranjang"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow">{cartItems.length}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

  <div className="flex flex-col lg:flex-row">
    {/* Sidebar as modal on mobile, always visible on desktop */}
    {/* Only render Sidebar on mobile if sidebarOpen, always on desktop */}
    <Sidebar
      filters={filters}
      onFiltersChange={setFilters}
      isOpen={sidebarOpen}
      onClose={() => setSidebarOpen(false)}
      itemsPerPage={itemsPerPage}
      onItemsPerPageChange={setItemsPerPage}
    />

    {/* Main Content: always visible, takes full width on mobile */}
    <main className="flex-1 min-w-0 min-h-screen">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Results Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Products
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {(() => {
                const startIdx = (currentPage - 1) * itemsPerPage;
                const endIdx = startIdx + itemsPerPage;
                const shown = filteredProducts.slice(startIdx, endIdx).length;
                return `Menampilkan ${shown} dari ${filteredProducts.length}`;
              })()}
            </p>
            {/* Search Input - only visible on screens < 1375px */}
            <div className="block custom1375:hidden mt-4">
              <div className="relative max-w-md">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={filters.searchQuery}
                  onChange={e => setFilters({ ...filters, searchQuery: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>
          </div>
          {/* Sort By Filter - only visible on desktop */}
          <div className="hidden sm:flex flex-col gap-2 sm:flex-row sm:items-center sm:ml-auto">
            <div className="flex items-center">
              <label htmlFor="sortBy" className="mr-2 text-sm font-medium text-gray-700">Urutkan:</label>
              <select
                id="sortBy"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.sortBy + '-' + filters.sortOrder}
                onChange={e => {
                  const val = e.target.value;
                  if (val === 'price-asc') setFilters({ ...filters, sortBy: 'price', sortOrder: 'asc' });
                  else if (val === 'price-desc') setFilters({ ...filters, sortBy: 'price', sortOrder: 'desc' });
                  else if (val === 'weight-asc') setFilters({ ...filters, sortBy: 'weight', sortOrder: 'asc' });
                  else if (val === 'weight-desc') setFilters({ ...filters, sortBy: 'weight', sortOrder: 'desc' });
                  else if (val === 'likes-desc') setFilters({ ...filters, sortBy: 'likes', sortOrder: 'desc' });
                  else setFilters({ ...filters, sortBy: 'name', sortOrder: 'asc' });
                }}
              >
                <option value="name-asc">Nama (A-Z)</option>
                <option value="price-asc">Harga Termurah</option>
                <option value="price-desc">Harga Termahal</option>
                <option value="weight-asc">Berat Teringan</option>
                <option value="weight-desc">Berat Terberat</option>
                <option value="likes-desc">Paling Banyak Disukai</option>
              </select>
            </div>
            <div className="flex items-center">
              <label htmlFor="itemsPerPage" className="mr-2 text-sm font-medium text-gray-700">Tampilkan:</label>
              <select
                id="itemsPerPage"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={itemsPerPage}
                onChange={e => setItemsPerPage(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid & Pagination */}
        {
          (() => {
            const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
            const startIdx = (currentPage - 1) * itemsPerPage;
            const endIdx = startIdx + itemsPerPage;
            return <>
              <ProductGrid
                products={filteredProducts.slice(startIdx, endIdx)}
                onProductClick={product => {
                  setSelectedProduct(product);
                  setDetailOpen(true);
                }}
                onAddToCart={product => {
                  setCartItems(prev => prev.some(p => p.id === product.id) ? prev : [...prev, product]);
                }}
                cartItems={cartItems}
              />
              <div className="flex justify-center items-center gap-2 mt-6 select-none">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Halaman sebelumnya"
                >
                  &lt;
                </button>
                {/* Responsive pagination: 5 angka di desktop, 3 angka di mobile */}
                {(() => {
                  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
                  const maxNumbers = isMobile ? 3 : 5;
                  let start = Math.max(1, currentPage - Math.floor(maxNumbers / 2));
                  let end = start + maxNumbers - 1;
                  if (end > totalPages) {
                    end = totalPages;
                    start = Math.max(1, end - maxNumbers + 1);
                  }
                  const pages = [];
                  for (let i = start; i <= end; i++) {
                    pages.push(i);
                  }
                  // Tampilkan ellipsis jika perlu
                  if (start > 1) {
                    pages.unshift('...');
                    pages.unshift(1);
                  }
                  if (end < totalPages) {
                    pages.push('...');
                    pages.push(totalPages);
                  }
                  return pages.map((p, idx) =>
                    p === '...'
                      ? <span key={idx} className="px-2 text-gray-400">...</span>
                      : <button
                          key={p}
                          className={`w-8 h-8 flex items-center justify-center rounded-full border text-sm mx-0.5 ${p === currentPage ? 'bg-gray-800 text-white font-bold border-gray-800' : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'}`}
                          onClick={() => setCurrentPage(p as number)}
                          aria-current={p === currentPage ? 'page' : undefined}
                        >{p}</button>
                  );
                })()}
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  aria-label="Halaman berikutnya"
                >
                  &gt;
                </button>
              </div>
            </>;
          })()
        }
      </div>
    </main>
  </div>
      {/* Modal Detail Produk */}
      <ProductDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        product={selectedProduct}
        onAddToCart={product => {
          setCartItems(prev => prev.some(p => p.id === product.id) ? prev : [...prev, product]);
        }}
        cartItems={cartItems}
      />
      {/* Routing ke halaman keranjang dilakukan di router.tsx */}
    </div>
  );
}

export default App;