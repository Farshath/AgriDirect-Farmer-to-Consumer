import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [summary, setSummary] = useState({
    subtotal: 0,
    deliveryCharge: 0,
    total: 0,
    itemCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !isCustomer) {
      setCart({ items: [] });
      setSummary({ subtotal: 0, deliveryCharge: 0, total: 0, itemCount: 0 });
      return;
    }

    try {
      setIsLoading(true);
      const res = await cartAPI.getCart();
      if (res.success) {
        setCart(res.cart);
        setSummary(res.summary);
      }
    } catch (error) {
      console.error('Fetch cart error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isCustomer]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add products to your basket');
      return { success: false, requireAuth: true };
    }

    if (!isCustomer) {
      toast.error('Only customers can purchase products');
      return { success: false };
    }

    try {
      setIsLoading(true);
      const res = await cartAPI.addToCart(productId, quantity);
      if (res.success) {
        setCart(res.cart);
        setSummary(res.summary);
        toast.success('Added to basket! 🌿');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message || 'Could not add to cart');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await cartAPI.updateCartItem(itemId, quantity);
      if (res.success) {
        setCart(res.cart);
        setSummary(res.summary);
      }
    } catch (error) {
      toast.error(error.message || 'Could not update quantity');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await cartAPI.removeFromCart(itemId);
      if (res.success) {
        setCart(res.cart);
        setSummary(res.summary);
        toast.success('Item removed');
      }
    } catch (error) {
      toast.error(error.message || 'Could not remove item');
    }
  };

  const clearCart = async () => {
    try {
      const res = await cartAPI.clearCart();
      if (res.success) {
        setCart({ items: [] });
        setSummary({ subtotal: 0, deliveryCharge: 0, total: 0, itemCount: 0 });
      }
    } catch (error) {
      console.error('Clear cart error:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        summary,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

