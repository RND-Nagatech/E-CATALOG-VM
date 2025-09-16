export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  image: string;
  description: string;
  inStock: boolean;
  rating: number;
  likes: number;
  kode_barcode: string;
}

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  weightRange: [number, number];
  sizeRange: [number, number];
  searchQuery: string;
  sortBy: 'name' | 'price' | 'weight' | 'rating' | 'likes';
  sortOrder: 'asc' | 'desc';
}