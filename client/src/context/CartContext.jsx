import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, option = 'buy', rentDurationMonths = 1, quantity = 1) => {
    setCartItems(prevItems => {
      const pricePerUnit = option === 'rent' ? product.rentPricePerMonth * rentDurationMonths : product.price;
      const existingIndex = prevItems.findIndex(item => item.product._id === product._id && item.option === option);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        if (option === 'rent') {
          updated[existingIndex].rentDurationMonths = rentDurationMonths;
          updated[existingIndex].price = product.rentPricePerMonth * rentDurationMonths;
        }
        return updated;
      } else {
        return [...prevItems, {
          product,
          name: product.name,
          quantity,
          option,
          rentDurationMonths: option === 'rent' ? rentDurationMonths : 0,
          price: pricePerUnit
        }];
      }
    });
  };

  const removeFromCart = (productId, option) => {
    setCartItems(prev => prev.filter(item => !(item.product._id === productId && item.option === option)));
  };

  const updateQuantity = (productId, option, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, option);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.product._id === productId && item.option === option) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const updateRentDuration = (productId, option, months) => {
    setCartItems(prev => prev.map(item => {
      if (item.product._id === productId && item.option === 'rent') {
        const newPrice = item.product.rentPricePerMonth * months;
        return { ...item, rentDurationMonths: months, price: newPrice };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateRentDuration,
      clearCart,
      totalAmount,
      totalCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
