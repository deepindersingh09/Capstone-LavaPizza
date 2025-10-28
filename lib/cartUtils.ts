// lib/cartUtils.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  type?: 'custom' | 'menu';
  crust?: string;
  size?: string;
  toppings?: string[];
  image?: any;
  description?: string;
}

const CART_KEY = '@cart';

/**
 * Add item to cart
 */
export const addToCart = async (item: CartItem): Promise<boolean> => {
  try {
    console.log('Adding to cart:', item);
    
    // Get existing cart
    const cartData = await AsyncStorage.getItem(CART_KEY);
    const cart: CartItem[] = cartData ? JSON.parse(cartData) : [];

    // Add new item
    cart.push({
      ...item,
      quantity: item.quantity || 1,
    });

    // Save cart
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
    console.log('Cart saved successfully. Total items:', cart.length);
    
    return true;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return false;
  }
};

/**
 * Get all cart items
 */
export const getCartItems = async (): Promise<CartItem[]> => {
  try {
    const cartData = await AsyncStorage.getItem(CART_KEY);
    const cart = cartData ? JSON.parse(cartData) : [];
    console.log('Cart retrieved:', cart.length, 'items');
    return cart;
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
};

/**
 * Remove item from cart by index
 */
export const removeFromCart = async (index: number): Promise<boolean> => {
  try {
    const cart = await getCartItems();
    cart.splice(index, 1);
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
    return true;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return false;
  }
};

/**
 * Clear entire cart
 */
export const clearCart = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(CART_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
};

/**
 * Get cart total
 */
export const getCartTotal = async (): Promise<number> => {
  try {
    const cart = await getCartItems();
    return cart.reduce((total, item) => total + (item.price || 0), 0);
  } catch (error) {
    console.error('Error calculating total:', error);
    return 0;
  }
};

/**
 * Get cart count
 */
export const getCartCount = async (): Promise<number> => {
  try {
    const cart = await getCartItems();
    return cart.length;
  } catch (error) {
    console.error('Error getting cart count:', error);
    return 0;
  }
};