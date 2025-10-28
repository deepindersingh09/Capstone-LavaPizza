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
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  crust?: string;
  type?: string;
  toppings?: string[];
  details?: string[];
}

export default function CartScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id: string, newQuantity: number) => {
    try {
      const updatedCart = cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      await AsyncStorage.setItem('@cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update quantity');
    }
  };

  const increaseQty = (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) updateQuantity(id, item.quantity + 1);
  };

  const decreaseQty = (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (item && item.quantity > 1) updateQuantity(id, item.quantity - 1);
  };

  const handleRemove = async (id: string, name: string) => {
    Alert.alert(
      'Remove Item',
      `Remove ${name} from cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const newCart = cartItems.filter((item) => item.id !== id);
              await AsyncStorage.setItem('@cart', JSON.stringify(newCart));
              setCartItems(newCart);
            } catch (error) {
              console.error('Error removing item:', error);
              Alert.alert('Error', 'Failed to remove item');
            }
          },
        },
      ]
    );
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Add some pizzas first!');
      return;
    }

    const total = subtotal + tax;
    
    try {
      router.push(`/checkout?total=${total.toFixed(2)}`);
    } catch (e) {
      console.error('Navigation error:', e);
      Alert.alert('Error', 'Could not navigate to checkout');
    }
  };

  const subtotal = getTotal();
  const tax = subtotal * 0.05; // 5% GST
  const total = subtotal + tax;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#FFC107" />
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#E8E8E8" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>Add some delicious pizzas to get started!</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => {
              try {
                router.push('/(drawer)/(tabs)/home');
              } catch (e) {
                router.push('/home');
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
        <View>
          <Text style={styles.headerTitle}>My Cart</Text>
          <Text style={styles.itemCount}>
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              
              {item.size && (
                <View style={styles.sizeContainer}>
                  <Text style={styles.itemDetail}>Size: {item.size}</Text>
                </View>
              )}

              {item.crust && (
                <Text style={styles.itemDetail}>
                  {item.crust.charAt(0).toUpperCase() + item.crust.slice(1)} Crust
                </Text>
              )}
              
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>

              {item.type === 'custom' && item.toppings && item.toppings.length > 0 && (
                <View style={styles.detailsContainer}>
                  <Text style={styles.itemDetail}>
                    Toppings: {item.toppings.join(', ')}
                  </Text>
                </View>
              )}

              {item.details && item.details.length > 0 && (
                <View style={styles.detailsContainer}>
                  {item.details.map((detail, index) => (
                    <Text key={index} style={styles.itemDetail}>
                      • {detail}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.rightSection}>
              <View style={styles.qtyContainer}>
                <TouchableOpacity 
                  style={styles.qtyButton} 
                  onPress={() => decreaseQty(item.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={16} color="#1A1A1A" />
                </TouchableOpacity>

                <Text style={styles.qtyValue}>{item.quantity}</Text>

                <TouchableOpacity 
                  style={styles.qtyButton} 
                  onPress={() => increaseQty(item.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={16} color="#1A1A1A" />
                </TouchableOpacity>
              </View>

              <Text style={styles.itemTotal}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>

              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleRemove(item.id, item.name)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={20} color="#FF5252" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>GST (5%)</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.checkoutButton} 
          onPress={handleCheckout}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          <Ionicons name="arrow-forward" size={20} color="#1A1A1A" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  shopButton: {
    backgroundColor: "#FFC107",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#FFC107",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  sizeContainer: {
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFC107",
    marginBottom: 8,
  },
  detailsContainer: {
    marginTop: 4,
  },
  itemDetail: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBF5",
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#FFE082",
    padding: 4,
  },
  qtyButton: {
    backgroundColor: "#FFC107",
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyValue: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    minWidth: 20,
    textAlign: "center",
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginVertical: 8,
  },
  deleteButton: {
    padding: 4,
  },
  footer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  summaryBox: {
    backgroundColor: "#FFFBF5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#FFE082",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  divider: {
    height: 1,
    backgroundColor: "#FFE082",
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFC107",
  },
  checkoutButton: {
    backgroundColor: "#FFC107",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#FFC107",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
});