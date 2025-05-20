import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const found = prev.find(item => item.product_id === product.product_id);
      if (found) {
        return prev.map(item =>
          item.product_id === product.product_id
            ? { ...item, qty: item.qty + qty }
            : item
        );
      } else {
        return [...prev, { ...product, qty }];
      }
    });
  };

  const removeFromCart = (product_id) => {
    setCart(prev => prev.filter(item => item.product_id !== product_id));
  };

  const updateQty = (product_id, qty) => {
    setCart(prev => prev.map(item =>
      item.product_id === product_id ? { ...item, qty } : item
    ));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
} 