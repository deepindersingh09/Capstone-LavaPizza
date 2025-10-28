// app/(drawer)/(tabs)/checkout.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const totalAmount = parseFloat(params.total as string) || 0;

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCartItems();
    loadUserInfo();
  }, []);

  const loadCartItems = async () => {
    try {
      const cartData = await AsyncStorage.getItem('@cart');
      const cart = cartData ? JSON.parse(cartData) : [];
      setCartItems(cart);
      console.log('Loaded cart items:', cart.length);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const loadUserInfo = async () => {
    try {
      // Try to load saved user info
      const savedName = await AsyncStorage.getItem('@user_first_name');
      if (savedName) setName(savedName);
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!phone.trim() || phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number (at least 10 digits)');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter your delivery address');
      return false;
    }
    if (paymentMethod === 'card' && (!cardNumber.trim() || cardNumber.length < 16)) {
      Alert.alert('Error', 'Please enter a valid 16-digit card number');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Please add items to your cart first');
      return;
    }

    setLoading(true);

    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Create order object
        const order = {
          id: Date.now().toString(),
          items: cartItems,
          total: totalAmount,
          name,
          phone,
          address,
          paymentMethod,
          date: new Date().toISOString(),
          status: 'placed',
        };

        // Save order to history
        const ordersData = await AsyncStorage.getItem('@orders');
        const orders = ordersData ? JSON.parse(ordersData) : [];
        orders.unshift(order);
        await AsyncStorage.setItem('@orders', JSON.stringify(orders));

        // Clear cart
        await AsyncStorage.removeItem('@cart');

        setLoading(false);

        Alert.alert(
          '🎉 Order Placed Successfully!',
          `Order #${order.id.slice(-6)}\n\nYour delicious pizza will arrive in 30-45 minutes!\n\nTotal: $${totalAmount.toFixed(2)}`,
          [
            {
              text: 'OK',
              onPress: () => {
                router.replace('/(drawer)/(tabs)/home');
              },
            },
          ]
        );
      } catch (error) {
        setLoading(false);
        console.error('Error placing order:', error);
        Alert.alert('Error', 'Failed to place order. Please try again.');
      }
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="receipt-outline" size={20} /> Order Summary
          </Text>
          <View style={styles.summaryBox}>
            {cartItems.map((item, index) => (
              <View key={index} style={styles.orderItem}>
                <View style={styles.orderItemInfo}>
                  <Text style={styles.orderItemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {item.size && (
                    <Text style={styles.orderItemDetail}>Size: {item.size}</Text>
                  )}
                  {item.quantity && item.quantity > 1 && (
                    <Text style={styles.orderItemDetail}>Qty: {item.quantity}</Text>
                  )}
                </View>
                <Text style={styles.orderItemPrice}>${item.price.toFixed(2)}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="location-outline" size={20} /> Delivery Details
          </Text>
          
          <Text style={styles.inputLabel}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={styles.inputLabel}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="(123) 456-7890"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={15}
          />

          <Text style={styles.inputLabel}>Delivery Address *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="123 Main St, Apt 4B&#10;City, Province, Postal Code"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="card-outline" size={20} /> Payment Method
          </Text>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'card' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <View style={styles.radioButton}>
              {paymentMethod === 'card' && <View style={styles.radioButtonInner} />}
            </View>
            <Ionicons name="card" size={24} color="#E53935" style={styles.paymentIcon} />
            <Text style={styles.paymentText}>Credit/Debit Card</Text>
          </TouchableOpacity>

          {paymentMethod === 'card' && (
            <View style={styles.cardInputContainer}>
              <Text style={styles.inputLabel}>Card Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="number-pad"
                maxLength={16}
              />
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'cash' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('cash')}
          >
            <View style={styles.radioButton}>
              {paymentMethod === 'cash' && <View style={styles.radioButtonInner} />}
            </View>
            <Ionicons name="cash" size={24} color="#E53935" style={styles.paymentIcon} />
            <Text style={styles.paymentText}>Cash on Delivery</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.placeOrderButton, loading && styles.buttonDisabled]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.placeOrderText}>
              Place Order - ${totalAmount.toFixed(2)}
            </Text>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111',
  },
  summaryBox: {
    backgroundColor: '#FFF9F0',
    padding: 12,
    borderRadius: 8,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },
  orderItemDetail: {
    fontSize: 12,
    color: '#666',
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E53935',
  },
  divider: {
    height: 2,
    backgroundColor: '#E53935',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E53935',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
    color: '#111',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  paymentOptionSelected: {
    borderColor: '#E53935',
    backgroundColor: '#fff5f5',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E53935',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E53935',
  },
  paymentIcon: {
    marginRight: 10,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  cardInputContainer: {
    marginBottom: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  placeOrderButton: {
    backgroundColor: '#E53935',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  placeOrderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});