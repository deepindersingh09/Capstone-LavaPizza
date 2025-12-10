import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  image?: any;
  details?: string[];
  customizations?: string; // ← ADDED THIS LINE
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  itemCount: number;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = '@cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from storage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart whenever it changes (but only after initial load)
  useEffect(() => {
    if (isInitialized) {
      saveCart();
    }
  }, [items, isInitialized]);

  const loadCart = async () => {
    try {
      console.log('🛒 Loading cart from storage...');
      const saved = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('🛒 Cart loaded:', parsed.length, 'items');
        setItems(parsed);
      } else {
        console.log('🛒 No saved cart found');
      }
    } catch (e) {
      console.warn('❌ Failed to load cart', e);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  const saveCart = async () => {
    try {
      console.log('💾 Saving cart:', items.length, 'items');
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('❌ Failed to save cart', e);
    }
  };

  const addItem = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    console.log('➕ Adding item to cart:', newItem.name);
    
    setItems((prevItems) => {
      // Create unique key combining id and size
      const itemKey = `${newItem.id}-${newItem.size || 'default'}`;
      
      // Check if item already exists
      const existingIndex = prevItems.findIndex(
        (item) => `${item.id}-${item.size || 'default'}` === itemKey
      );

      let updatedItems;
      if (existingIndex !== -1) {
        // Update quantity
        updatedItems = [...prevItems];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + (newItem.quantity || 1)
        };
        console.log('📦 Updated existing item quantity:', updatedItems[existingIndex].quantity);
      } else {
        // Add new item
        updatedItems = [...prevItems, { ...newItem, quantity: newItem.quantity || 1 }];
        console.log('🆕 Added new item to cart');
      }

      console.log('🛒 Total items in cart:', updatedItems.length);
      return updatedItems;
    });
  };

  const removeItem = (id: string) => {
    console.log('🗑️ Removing item from cart:', id);
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    console.log('🔄 Updating quantity for:', id, 'to:', quantity);
    
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    console.log('🧹 Clearing cart');
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        itemCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}