import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { addToCart } from '../../lib/cartUtils';

const TOPPINGS = [
  { id: 'pepperoni', name: 'Pepperoni', price: 1.5, emoji: '🍕' },
  { id: 'mushrooms', name: 'Mushrooms', price: 1.0, emoji: '🍄' },
  { id: 'onions', name: 'Onions', price: 0.75, emoji: '🧅' },
  { id: 'sausage', name: 'Sausage', price: 1.5, emoji: '🌭' },
  { id: 'bacon', name: 'Bacon', price: 2.0, emoji: '🥓' },
  { id: 'olives', name: 'Olives', price: 1.0, emoji: '🫒' },
  { id: 'peppers', name: 'Bell Peppers', price: 1.0, emoji: '🫑' },
  { id: 'tomatoes', name: 'Tomatoes', price: 0.75, emoji: '🍅' },
  { id: 'chicken', name: 'Chicken', price: 2.5, emoji: '🍗' },
  { id: 'pineapple', name: 'Pineapple', price: 1.25, emoji: '🍍' },
  { id: 'jalapenos', name: 'Jalapeños', price: 1.0, emoji: '🌶️' },
  { id: 'cheese', name: 'Extra Cheese', price: 2.0, emoji: '🧀' },
];

const SIZES = [
  { id: 'small', name: 'Small (10")', price: 8.99 },
  { id: 'medium', name: 'Medium (12")', price: 11.99 },
  { id: 'large', name: 'Large (14")', price: 14.99 },
  { id: 'xlarge', name: 'X-Large (16")', price: 17.99 },
];

export default function CustomPizzaBuilder() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const crustType = (params.crust as string) || 'thin';

  const [selectedSize, setSelectedSize] = useState('medium');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  const calculatePrice = () => {
    const sizePrice = SIZES.find((s) => s.id === selectedSize)?.price || 0;
    const toppingsPrice = selectedToppings.reduce((total, toppingId) => {
      const topping = TOPPINGS.find((t) => t.id === toppingId);
      return total + (topping?.price || 0);
    }, 0);
    return (sizePrice + toppingsPrice) * quantity;
  };

  const toggleTopping = (toppingId: string) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingId)
        ? prev.filter((id) => id !== toppingId)
        : [...prev, toppingId]
    );
  };

  const handleAddToCart = async () => {
    try {
      const size = SIZES.find((s) => s.id === selectedSize);
      const toppings = TOPPINGS.filter((t) => selectedToppings.includes(t.id));

      const customPizza = {
        id: `custom-${Date.now()}`,
        name: `Custom ${crustType.charAt(0).toUpperCase() + crustType.slice(1)} Crust Pizza`,
        crust: crustType,
        size: size?.name || '',
        toppings: toppings.map((t) => t.name),
        price: calculatePrice(),
        quantity: quantity,
        type: 'custom' as const,
      };

      const success = await addToCart(customPizza);

      if (success) {
        Alert.alert('Success! 🍕', 'Your custom pizza has been added to cart!', [
          { text: 'Continue Shopping', onPress: () => router.back() },
          {
            text: 'View Cart',
            onPress: () => {
              try {
                router.push('/(drawer)/(tabs)/cart');
              } catch {
                try {
                  router.push('/cart');
                } catch (e2) {
                  console.error('Navigation error:', e2);
                  Alert.alert('Info', 'Please use the Cart tab to view your cart.');
                  router.back();
                }
              }
            },
          },
        ]);
      } else {
        Alert.alert('Error', 'Failed to add pizza to cart. Please try again.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add pizza to cart. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Create Your Pizza</Text>
          <Text style={styles.headerSub}>
            {crustType.charAt(0).toUpperCase() + crustType.slice(1)} Crust
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Size Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Size</Text>
          {SIZES.map((size) => (
            <TouchableOpacity
              key={size.id}
              style={[
                styles.cardRow,
                selectedSize === size.id && styles.cardRowSelected,
              ]}
              onPress={() => setSelectedSize(size.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.optionName}>{size.name}</Text>
              <Text style={styles.optionPrice}>${size.price.toFixed(2)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Toppings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Choose Toppings ({selectedToppings.length} selected)
          </Text>
          <View style={styles.toppingsGrid}>
            {TOPPINGS.map((topping) => {
              const selected = selectedToppings.includes(topping.id);
              return (
                <TouchableOpacity
                  key={topping.id}
                  style={[styles.toppingCard, selected && styles.toppingCardSelected]}
                  onPress={() => toggleTopping(topping.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.toppingEmoji}>{topping.emoji}</Text>
                  <Text style={styles.toppingName}>{topping.name}</Text>
                  <Text style={styles.toppingPrice}>+${topping.price.toFixed(2)}</Text>
                  {selected && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Quantity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.qtyWrap}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              activeOpacity={0.8}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(quantity + 1)}
              activeOpacity={0.8}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Total Price</Text>
          <Text style={styles.summaryValue}>${calculatePrice().toFixed(2)}</Text>
        </View>

        {/* Add to Cart */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart} activeOpacity={0.85}>
          <Text style={styles.addButtonText}>
            Add to Cart — ${calculatePrice().toFixed(2)}
          </Text>
          <Ionicons name="cart" size={18} color="#1A1A1A" style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Layout / base
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    paddingHorizontal: 16,
  },

  // Header (matches cart.tsx look)
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
  backButton: {
    padding: 6,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  headerSub: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },

  // Sections
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    paddingHorizontal: 2,
  },

  // Card rows (size options)
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardRowSelected: {
    borderColor: '#FFC107',
    backgroundColor: '#FFFBF5',
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  optionPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFC107',
  },

  // Toppings grid
  toppingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toppingCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toppingCardSelected: {
    borderColor: '#FFC107',
    backgroundColor: '#FFFBF5',
  },
  toppingEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  toppingName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 4,
  },
  toppingPrice: {
    fontSize: 12,
    color: '#666',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFC107',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Quantity
  qtyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  qtyBtn: {
    backgroundColor: '#FFC107',
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  qtyBtnText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  qtyValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    minWidth: 32,
    textAlign: 'center',
  },

  // Summary
  summaryBox: {
    backgroundColor: '#FFFBF5',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: '#FFE082',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFC107',
  },

  // CTA
  addButton: {
    backgroundColor: '#FFC107',
    marginTop: 14,
    marginBottom: 16,
    paddingVertical: 16,
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
  addButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
});
