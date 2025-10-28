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

  // Calculate total price
  const calculatePrice = () => {
    const sizePrice = SIZES.find((s) => s.id === selectedSize)?.price || 0;
    const toppingsPrice = selectedToppings.reduce((total, toppingId) => {
      const topping = TOPPINGS.find((t) => t.id === toppingId);
      return total + (topping?.price || 0);
    }, 0);
    return (sizePrice + toppingsPrice) * quantity;
  };

  // Toggle topping selection
  const toggleTopping = (toppingId: string) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingId)
        ? prev.filter((id) => id !== toppingId)
        : [...prev, toppingId]
    );
  };

  // Add to cart
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
        console.log('Added to cart successfully');
        
        Alert.alert('Success! 🍕', 'Your custom pizza has been added to cart!', [
          {
            text: 'Continue Shopping',
            onPress: () => router.back(),
          },
          {
            text: 'View Cart',
            onPress: () => {
              try {
                router.push('/(drawer)/(tabs)/cart');
              } catch (e) {
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Your Pizza</Text>
          <Text style={styles.subtitle}>
            {crustType.charAt(0).toUpperCase() + crustType.slice(1)} Crust
          </Text>
        </View>

        {/* Size Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Size</Text>
          {SIZES.map((size) => (
            <TouchableOpacity
              key={size.id}
              style={[
                styles.sizeOption,
                selectedSize === size.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedSize(size.id)}
            >
              <Text style={styles.optionName}>{size.name}</Text>
              <Text style={styles.optionPrice}>${size.price.toFixed(2)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Toppings Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Choose Toppings ({selectedToppings.length} selected)
          </Text>
          <View style={styles.toppingsGrid}>
            {TOPPINGS.map((topping) => (
              <TouchableOpacity
                key={topping.id}
                style={[
                  styles.toppingCard,
                  selectedToppings.includes(topping.id) && styles.selectedTopping,
                ]}
                onPress={() => toggleTopping(topping.id)}
              >
                <Text style={styles.toppingEmoji}>{topping.emoji}</Text>
                <Text style={styles.toppingName}>{topping.name}</Text>
                <Text style={styles.toppingPrice}>+${topping.price.toFixed(2)}</Text>
                {selectedToppings.includes(topping.id) && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quantity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Price Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>Total Price:</Text>
          <Text style={styles.summaryPrice}>${calculatePrice().toFixed(2)}</Text>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>
            Add to Cart - ${calculatePrice().toFixed(2)}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7E6',
  },
  header: {
    padding: 20,
    backgroundColor: '#E53935',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 5,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: '#111',
  },
  sizeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#eee',
  },
  selectedOption: {
    borderColor: '#E53935',
    backgroundColor: '#fff5f5',
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  optionPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E53935',
  },
  toppingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toppingCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#eee',
    position: 'relative',
  },
  selectedTopping: {
    borderColor: '#E53935',
    backgroundColor: '#fff5f5',
  },
  toppingEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  toppingName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    color: '#111',
  },
  toppingPrice: {
    fontSize: 12,
    color: '#666',
  },
  checkmark: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#E53935',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  quantityButton: {
    backgroundColor: '#E53935',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  quantityText: {
    fontSize: 24,
    fontWeight: '700',
    minWidth: 40,
    textAlign: 'center',
    color: '#111',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
  },
  summaryLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  summaryPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E53935',
  },
  addButton: {
    backgroundColor: '#E53935',
    margin: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});