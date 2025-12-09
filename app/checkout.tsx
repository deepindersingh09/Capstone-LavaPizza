// app/checkout.tsx
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
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// ✅ Firebase + OrderService imports (moved here from cart.tsx)
import OrderService from '../services/OrderService';
import { auth } from '../lib/firebaseConfig';

export default function CheckoutScreen() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showNewCardInput, setShowNewCardInput] = useState(false);

  useEffect(() => {
    loadCartItems();
    loadUserInfo();
    loadSavedCards();
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

  const loadSavedCards = async () => {
    try {
      const cardsData = await AsyncStorage.getItem('@lava_wallet_v1');
      if (cardsData) {
        const cards = JSON.parse(cardsData);
        setSavedCards(cards);

        // Auto-select default card
        const defaultCard = cards.find((c: any) => c.isDefault);
        if (defaultCard) {
          setSelectedCard(defaultCard);
          setPaymentMethod('card');
          setShowNewCardInput(false);
        }
      }
    } catch (error) {
      console.error('Error loading saved cards:', error);
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
    if (paymentMethod === 'card' && showNewCardInput) {
      if (!cardNumber.trim() || cardNumber.length < 16) {
        Alert.alert('Error', 'Please enter a valid 16-digit card number');
        return false;
      }
    }
    if (paymentMethod === 'card' && !showNewCardInput && !selectedCard) {
      Alert.alert('Error', 'Please select a payment card');
      return false;
    }
    return true;
  };

  // ✅ REAL order placement with Firebase
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Please add items to your cart first');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to place an order',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign In',
            onPress: () => {
              try {
                router.push('/login' as any);
              } catch (e) {
                console.error('Navigation error:', e);
              }
            },
          },
        ]
      );
      return;
    }

    // calculate totals from cart
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
    const tax = subtotal * 0.05; // 5% GST
    const total = subtotal + tax;

    setLoading(true);

    try {
      const orderData = {
        userId: user.uid,
        customerName:
          name.trim() ||
          user.displayName ||
          user.email?.split('@')[0] ||
          'Customer',
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          crust: item.crust,
          type: item.type,
          toppings: item.toppings,
          details: item.details,
        })),
        total: parseFloat(total.toFixed(2)),
        phone: phone.trim() || user.phoneNumber || 'N/A',
        address: address.trim(),
        paymentMethod: paymentMethod === 'card' ? 'Card' : 'Cash',
        notes: '', // you can wire a "notes" input later if you want
      };

      console.log('Creating order from checkout:', orderData);

      const result = await OrderService.createOrder(orderData);

      // clear cart after successful order
      await AsyncStorage.setItem('@cart', JSON.stringify([]));
      setCartItems([]);

      setLoading(false);

      Alert.alert(
        'Order Placed Successfully! 🎉',
        `Order #${result.orderId.slice(-6)} has been placed.\n\nTotal: $${total.toFixed(
          2
        )}\n\nYour order is being prepared!`,
        [
          {
            text: 'View Orders',
            onPress: () => {
              try {
                // adjust this route when you have an Orders screen
                router.replace('/(drawer)/(tabs)/home' as any);
              } catch (e) {
                console.error('Navigation error:', e);
              }
            },
          },
          {
            text: 'OK',
            onPress: () => {
              try {
                router.replace('/(drawer)/(tabs)/home' as any);
              } catch (e) {
                console.error('Navigation error:', e);
              }
            },
          },
        ]
      );
    } catch (error: any) {
      setLoading(false);
      console.error('Error placing order:', error);
      Alert.alert(
        'Order Failed',
        error.message || 'Failed to place order. Please try again.'
      );
    }
  };

  const handleCardSelect = (card: any) => {
    setSelectedCard(card);
    setShowNewCardInput(false);
    setPaymentMethod('card');
  };

  const handleAddNewCard = () => {
    setShowNewCardInput(true);
    setSelectedCard(null);
    setCardNumber('');
  };

  const getCardIcon = (network: string) => {
    if (!network) return 'card-outline';

    switch (network.toLowerCase()) {
      case 'visa':
      case 'mastercard':
      case 'amex':
        return 'card';
      default:
        return 'card-outline';
    }
  };

  // ✅ recompute totals from cart for the UI
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );
  const tax = subtotal * 0.05;
  const totalAmount = subtotal + tax;

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
                <Text style={styles.orderItemPrice}>
                  ${(item.price * (item.quantity || 1)).toFixed(2)}
                </Text>
              </View>
            ))}
            <View style={styles.divider} />

            {/* show subtotal + tax + total */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalAmount}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>GST (5%)</Text>
              <Text style={styles.totalAmount}>${tax.toFixed(2)}</Text>
            </View>
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

          {/* Card Payment Option */}
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'card' && styles.paymentOptionSelected,
            ]}
            onPress={() => {
              setPaymentMethod('card');
              if (savedCards.length > 0 && !showNewCardInput) {
                const defaultCard =
                  savedCards.find((c: any) => c.isDefault) || savedCards[0];
                setSelectedCard(defaultCard);
              }
            }}
            activeOpacity={0.8}
          >
            <View style={styles.radioButton}>
              {paymentMethod === 'card' && <View style={styles.radioButtonInner} />}
            </View>
            <Ionicons name="card" size={24} color="#FFC107" style={styles.paymentIcon} />
            <Text style={styles.paymentText}>Credit/Debit Card</Text>
          </TouchableOpacity>

          {/* Saved Cards Section */}
          {paymentMethod === 'card' && savedCards.length > 0 && (
            <View style={styles.savedCardsContainer}>
              <Text style={styles.savedCardsTitle}>Your Cards</Text>

              {savedCards.map((card, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.savedCard,
                    selectedCard?.id === card.id &&
                      !showNewCardInput &&
                      styles.savedCardSelected,
                  ]}
                  onPress={() => handleCardSelect(card)}
                  activeOpacity={0.7}
                >
                  <View style={styles.savedCardLeft}>
                    <Ionicons
                      name={getCardIcon(card.network)}
                      size={28}
                      color="#FFC107"
                    />
                    <View style={styles.savedCardInfo}>
                      <Text style={styles.savedCardNetwork}>
                        {card.network || 'Card'}
                      </Text>
                      <Text style={styles.savedCardNumber}>
                        •••• {card.last4 || '****'}
                      </Text>
                      {card.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>Default</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.savedCardCheck}>
                    {selectedCard?.id === card.id && !showNewCardInput && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#FFC107"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}

              {/* Add New Card Option */}
              <TouchableOpacity
                style={[
                  styles.addNewCardButton,
                  showNewCardInput && styles.savedCardSelected,
                ]}
                onPress={handleAddNewCard}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={24}
                  color="#FFC107"
                />
                <Text style={styles.addNewCardText}>Add New Card</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* New Card Input */}
          {paymentMethod === 'card' &&
            (savedCards.length === 0 || showNewCardInput) && (
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
                <Text style={styles.cardHint}>
                  💡 Save this card to your wallet after checkout for faster
                  payments
                </Text>
              </View>
            )}

          {/* Cash Payment Option */}
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
            <>
              <Text style={styles.placeOrderText}>
                Place Order — ${totalAmount.toFixed(2)}
              </Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color="#1A1A1A"
                style={{ marginLeft: 8 }}
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // (unchanged styles)
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
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  totalAmount: { fontSize: 16, fontWeight: '700', color: '#FFC107' },

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

  savedCardsContainer: {
    marginTop: 4,
    marginBottom: 12,
  },
  savedCardsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  savedCardSelected: {
    borderColor: '#FFE082',
    backgroundColor: '#FFFBF5',
  },
  savedCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  savedCardInfo: {
    marginLeft: 12,
    flex: 1,
  },
  savedCardNetwork: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  savedCardNumber: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  defaultBadge: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  savedCardCheck: {
    marginLeft: 10,
  },
  addNewCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    backgroundColor: '#fff',
    borderStyle: 'dashed',
  },
  addNewCardText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFC107',
    marginLeft: 10,
  },
  cardInputContainer: { marginBottom: 12 },
  cardHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },

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
