import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('gol93_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('gol93_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size, quantity = 1, customization = null) => {
    if (!product) return;
    setCart(prev => {
      const exists = prev.find(item => 
        item.id === product.id && 
        item.size === size && 
        JSON.stringify(item.customization) === JSON.stringify(customization)
      );
      if (exists) {
        return prev.map(item => (item === exists) 
          ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, size, quantity, customization }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id, size, customization) => {
    setCart(prev => prev.filter(item => !(
      item.id === id && 
      item.size === size && 
      JSON.stringify(item.customization) === JSON.stringify(customization)
    )));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);