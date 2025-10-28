// app/(drawer)/(tabs)/cart.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CartScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem('@cart');
      const cart = cartData ? JSON.parse(cartData) : [];
      setCartItems(cart);
      console.log('Cart loaded:', cart);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (index: number) => {
    try {
      const newCart = cartItems.filter((_, i) => i !== index);
      await AsyncStorage.setItem('@cart', JSON.stringify(newCart));
      setCartItems(newCart);
      Alert.alert('Removed', 'Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      Alert.alert('Error', 'Failed to remove item');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0), 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Add some pizzas first!');
      return;
    }

    const total = calculateTotal();
    
   
    try {
      router.push(`/checkout?total=${total}`);
    } catch (e) {
      try {
        router.push(`/checkout?total=${total}`);
      } catch (e2) {
        console.error('Navigation error:', e2);
        Alert.alert('Error', 'Could not navigate to checkout');
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>🍕</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add some delicious pizzas!</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => {
              try {
                router.push('/(drawer)/(tabs)/specials');
              } catch (e) {
                router.push('/specials');
              }
            }}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Cart ({cartItems.length})</Text>
      </View>

      <ScrollView style={styles.itemsContainer} showsVerticalScrollIndicator={false}>
        {cartItems.map((item, index) => (
          <View key={`${item.id}-${index}`} style={styles.cartItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              
              {item.crust && (
                <Text style={styles.itemDetail}>
                  {item.crust.charAt(0).toUpperCase() + item.crust.slice(1)} Crust
                </Text>
              )}
              
              {item.size && (
                <Text style={styles.itemDetail}>Size: {item.size}</Text>
              )}
              
              {item.type === 'custom' && item.toppings && item.toppings.length > 0 && (
                <Text style={styles.itemDetail} numberOfLines={2}>
                  Toppings: {item.toppings.join(', ')}
                </Text>
              )}
              
              {item.quantity && item.quantity > 1 && (
                <Text style={styles.itemDetail}>Quantity: {item.quantity}</Text>
              )}
              
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeItem(index)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${calculateTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7E6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
  },
  itemsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cartItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },
  itemDetail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E53935',
    marginTop: 8,
  },
  removeButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  shopButton: {
    backgroundColor: '#E53935',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  shopButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
  },
  totalPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E53935',
  },
  checkoutButton: {
    backgroundColor: '#E53935',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});