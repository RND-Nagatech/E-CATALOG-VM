// import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import CartPage from './CartPage';
import CartSharePage from './CartSharePage';
import React, { createContext, useContext, useState } from 'react';

// Cart context
type CartContextType = {
  cartItems: any[];
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
};
const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [cartItems, setCartItems] = useState<any[]>(() => {
    const saved = sessionStorage.getItem('cartItems');
    console.log('Loaded cartItems from sessionStorage_KKKKKKKKK:', saved);
    if (saved) return JSON.parse(saved);
    return [];
  });
  // Persist to sessionStorage
  React.useEffect(() => {
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);
  return (
    <CartContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};

// App, CartPage, and CartSharePage routing
const Router: React.FC = () => (
  <CartProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
  <Route path="/cart" element={<CartPageWithContext />} />
  <Route path="/cart/share" element={<CartSharePage />} />
  <Route path="/cart/detail" element={<CartSharePage />} />
      </Routes>
    </BrowserRouter>
  </CartProvider>
);

// CartPage with context
const CartPageWithContext: React.FC = () => {
  const { cartItems, setCartItems } = useCart();
  const handleRemove = (idx: number) => {
    setCartItems(cartItems.filter((_, i) => i !== idx));
  };
  return <CartPage items={cartItems} onRemove={handleRemove} />;
};

export default Router;
