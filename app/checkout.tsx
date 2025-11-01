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

        const ordersData = await AsyncStorage.getItem('@orders');
        const orders = ordersData ? JSON.parse(ordersData) : [];
        orders.unshift(order);
        await AsyncStorage.setItem('@orders', JSON.stringify(orders));

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
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Checkout</Text>
          <Text style={styles.headerSub}>Almost there — confirm your details</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="receipt-outline" size={20} color="#1A1A1A" /> Order Summary
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
            <Ionicons name="location-outline" size={20} color="#1A1A1A" /> Delivery Details
          </Text>

          <Text style={styles.inputLabel}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            placeholderTextColor="#999"
          />

          <Text style={styles.inputLabel}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="(123) 456-7890"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={15}
            placeholderTextColor="#999"
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
            placeholderTextColor="#999"
          />
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="card-outline" size={20} color="#1A1A1A" /> Payment Method
          </Text>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'card' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('card')}
            activeOpacity={0.8}
          >
            <View style={styles.radioButton}>
              {paymentMethod === 'card' && <View style={styles.radioButtonInner} />}
            </View>
            <Ionicons name="card" size={24} color="#FFC107" style={styles.paymentIcon} />
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
                placeholderTextColor="#999"
              />
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'cash' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('cash')}
            activeOpacity={0.8}
          >
            <View style={styles.radioButton}>
              {paymentMethod === 'cash' && <View style={styles.radioButtonInner} />}
            </View>
            <Ionicons name="cash" size={24} color="#FFC107" style={styles.paymentIcon} />
            <Text style={styles.paymentText}>Cash on Delivery</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.placeOrderButton, loading && styles.buttonDisabled]}
          onPress={handlePlaceOrder}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#1A1A1A" />
          ) : (
            <Text style={styles.placeOrderText}>
              Place Order — ${totalAmount.toFixed(2)}
            </Text>
          )}
          {!loading && (
            <Ionicons name="arrow-forward" size={20} color="#1A1A1A" style={{ marginLeft: 8 }} />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Base & header — aligned with Cart screen
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButton: { padding: 4 },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerSub: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  scrollView: { flex: 1, paddingHorizontal: 16 },

  // Sections & cards
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },

  // Order summary box styled like Cart summary
  summaryBox: {
    backgroundColor: '#FFFBF5',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#FFE082',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  orderItemInfo: { flex: 1, marginRight: 12 },
  orderItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  orderItemDetail: { fontSize: 12, color: '#666' },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFC107',
  },
  divider: {
    height: 1,
    backgroundColor: '#FFE082',
    marginVertical: 8,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 4 },
  totalLabel: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  totalAmount: { fontSize: 18, fontWeight: '700', color: '#FFC107' },

  // Inputs
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
    color: '#1A1A1A',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: { height: 100, textAlignVertical: 'top' },

  // Payment options — match yellow scheme
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  paymentOptionSelected: {
    borderColor: '#FFE082',
    backgroundColor: '#FFFBF5',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFC107',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFC107',
  },
  paymentIcon: { marginRight: 10 },
  paymentText: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  cardInputContainer: { marginBottom: 4 },

  // Footer & CTA — match Cart
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  placeOrderButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  placeOrderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
});
