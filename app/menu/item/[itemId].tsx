// app/menu/item/[itemId].tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  TextInput 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { menuItems } from '@/data/menuData';
import { useCart } from '../../context/CartContext';

// Color constants to match your design
const COLORS = {
  primary: '#FFC107',      // Yellow/Orange
  primaryDark: '#FFB300',  // Darker yellow
  text: '#333',
  textLight: '#666',
  background: '#fff',
  backgroundLight: '#f5f5f5',
  border: '#f0f0f0',
};

// Regular toppings
const TOPPINGS = [
  { id: 'pepperoni', name: 'Pepperoni', price: 1.50 },
  { id: 'mushrooms', name: 'Mushrooms', price: 1.00 },
  { id: 'onions', name: 'Onions', price: 0.75 },
  { id: 'peppers', name: 'Peppers', price: 1.00 },
  { id: 'olives', name: 'Olives', price: 1.00 },
  { id: 'bacon', name: 'Bacon', price: 2.00 },
  { id: 'sausage', name: 'Sausage', price: 1.75 },
  { id: 'ham', name: 'Ham', price: 1.75 },
  { id: 'chicken', name: 'Chicken', price: 2.50 },
  { id: 'pineapple', name: 'Pineapple', price: 1.00 },
  { id: 'jalapeños', name: 'Jalapeños', price: 0.75 },
  { id: 'extra-cheese', name: 'Extra Cheese', price: 1.50 },
];

// Additional/Premium toppings
const ADDITIONAL_TOPPINGS = [
  { id: 'grilled-chicken', name: 'Grilled Chicken', price: 3.50 },
  { id: 'bbq-chicken', name: 'BBQ Chicken', price: 3.50 },
  { id: 'buffalo-chicken', name: 'Buffalo Chicken', price: 3.50 },
  { id: 'steak', name: 'Steak', price: 4.00 },
  { id: 'shrimp', name: 'Shrimp', price: 4.50 },
  { id: 'feta-cheese', name: 'Feta Cheese', price: 2.00 },
  { id: 'goat-cheese', name: 'Goat Cheese', price: 2.50 },
  { id: 'parmesan', name: 'Fresh Parmesan', price: 2.00 },
  { id: 'sun-dried-tomatoes', name: 'Sun-Dried Tomatoes', price: 2.00 },
  { id: 'artichokes', name: 'Artichokes', price: 2.50 },
  { id: 'roasted-garlic', name: 'Roasted Garlic', price: 1.50 },
  { id: 'fresh-basil', name: 'Fresh Basil', price: 1.50 },
];

// Available dips
const DIPS = [
  { id: 'ranch', name: 'Ranch Dip', price: 1.49 },
  { id: 'garlic', name: 'Garlic Dip', price: 1.49 },
  { id: 'marinara', name: 'Marinara Sauce', price: 1.49 },
  { id: 'bbq', name: 'BBQ Sauce', price: 1.49 },
  { id: 'hot-sauce', name: 'Hot Sauce', price: 1.49 },
];

// Available drinks
const DRINKS = [
  { id: 'coke-can', name: 'Coke (Can)', price: 1.99 },
  { id: 'pepsi-can', name: 'Pepsi (Can)', price: 1.99 },
  { id: 'sprite-can', name: 'Sprite (Can)', price: 1.99 },
  { id: 'coke-2l', name: 'Coke (2L)', price: 3.99 },
  { id: 'pepsi-2l', name: 'Pepsi (2L)', price: 3.99 },
  { id: 'sprite-2l', name: 'Sprite (2L)', price: 3.99 },
  { id: 'water', name: 'Bottled Water', price: 1.99 },
];

export default function ItemDetail() {
  const router = useRouter();
  const { itemId } = useLocalSearchParams();
  const { addItem, isLoading: cartLoading } = useCart();
  
  const item = menuItems.find(i => i.id === itemId);
  const [selectedSize, setSelectedSize] = useState(item?.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedAdditionalToppings, setSelectedAdditionalToppings] = useState<string[]>([]);
  const [selectedDips, setSelectedDips] = useState<string[]>([]);
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (!item) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Item not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Check if item can have toppings (pizzas mainly)
  const canHaveToppings = item.category.includes('pizza') || item.category === 'pizza-subs';

  // Calculate prices
  const currentPrice = selectedSize ? selectedSize.price : item.price;
  const toppingsPrice = selectedToppings.reduce((sum, toppingId) => {
    const topping = TOPPINGS.find(t => t.id === toppingId);
    return sum + (topping?.price || 0);
  }, 0);
  const additionalToppingsPrice = selectedAdditionalToppings.reduce((sum, toppingId) => {
    const topping = ADDITIONAL_TOPPINGS.find(t => t.id === toppingId);
    return sum + (topping?.price || 0);
  }, 0);
  const dipsPrice = selectedDips.reduce((sum, dipId) => {
    const dip = DIPS.find(d => d.id === dipId);
    return sum + (dip?.price || 0);
  }, 0);
  const drinksPrice = selectedDrinks.reduce((sum, drinkId) => {
    const drink = DRINKS.find(d => d.id === drinkId);
    return sum + (drink?.price || 0);
  }, 0);
  
  const totalPrice = (currentPrice + toppingsPrice + additionalToppingsPrice + dipsPrice + drinksPrice) * quantity;

  const toggleTopping = (toppingId: string) => {
    setSelectedToppings(prev => 
      prev.includes(toppingId) 
        ? prev.filter(id => id !== toppingId)
        : [...prev, toppingId]
    );
  };

  const toggleAdditionalTopping = (toppingId: string) => {
    setSelectedAdditionalToppings(prev => 
      prev.includes(toppingId) 
        ? prev.filter(id => id !== toppingId)
        : [...prev, toppingId]
    );
  };

  const toggleDip = (dipId: string) => {
    setSelectedDips(prev => 
      prev.includes(dipId) 
        ? prev.filter(id => id !== dipId)
        : [...prev, dipId]
    );
  };

  const toggleDrink = (drinkId: string) => {
    setSelectedDrinks(prev => 
      prev.includes(drinkId) 
        ? prev.filter(id => id !== drinkId)
        : [...prev, drinkId]
    );
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    try {
      const uniqueId = `${item.id}-${selectedSize?.size || 'default'}-${Date.now()}`;
      
      // Build customizations string
      let customizations = '';
      if (selectedToppings.length > 0) {
        customizations += `Toppings: ${selectedToppings.map(id => 
          TOPPINGS.find(t => t.id === id)?.name
        ).join(', ')}`;
      }
      if (selectedAdditionalToppings.length > 0) {
        if (customizations) customizations += ' | ';
        customizations += `Premium: ${selectedAdditionalToppings.map(id => 
          ADDITIONAL_TOPPINGS.find(t => t.id === id)?.name
        ).join(', ')}`;
      }
      if (selectedDips.length > 0) {
        if (customizations) customizations += ' | ';
        customizations += `Dips: ${selectedDips.map(id => 
          DIPS.find(d => d.id === id)?.name
        ).join(', ')}`;
      }
      if (selectedDrinks.length > 0) {
        if (customizations) customizations += ' | ';
        customizations += `Drinks: ${selectedDrinks.map(id => 
          DRINKS.find(d => d.id === id)?.name
        ).join(', ')}`;
      }
      if (specialInstructions) {
        if (customizations) customizations += ' | ';
        customizations += `Note: ${specialInstructions}`;
      }

      console.log('🛍️ Adding to cart:', {
        id: uniqueId,
        name: item.name,
        size: selectedSize?.size,
        quantity,
        price: totalPrice / quantity,
        customizations
      });

      addItem({
        id: uniqueId,
        name: item.name,
        price: totalPrice / quantity,
        quantity: quantity,
        size: selectedSize?.size,
        customizations,
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      Alert.alert(
        '✅ Added to Cart',
        `${item.name}${selectedSize ? ` (${selectedSize.size})` : ''} x${quantity}`,
        [
          { 
            text: 'Continue Shopping', 
            onPress: () => {
              setIsAdding(false);
              router.back();
            }
          },
          { 
            text: 'View Cart', 
            onPress: () => {
              setIsAdding(false);
              router.push('/(drawer)/(tabs)/cart');
            }
          },
        ]
      );
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Close Button */}
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Item Image Placeholder - SMALLER */}
        <View style={styles.imageContainer}>
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderEmoji}>🍕</Text>
          </View>
          {item.popular && (
            <View style={styles.popularBadge}>
              <Ionicons name="star" size={16} color="#FFF" />
              <Text style={styles.popularBadgeText}>Popular</Text>
            </View>
          )}
        </View>

        {/* Item Info */}
        <View style={styles.infoSection}>
          <Text style={styles.itemName}>{item.name}</Text>
          {item.description && (
            <Text style={styles.itemDescription}>{item.description}</Text>
          )}

          {/* Size Selection (if applicable) */}
          {item.sizes && item.sizes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Size</Text>
              <View style={styles.sizeOptions}>
                {item.sizes.map((size) => (
                  <TouchableOpacity
                    key={size.size}
                    style={[
                      styles.sizeButton,
                      selectedSize?.size === size.size && styles.sizeButtonActive
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text style={[
                      styles.sizeText,
                      selectedSize?.size === size.size && styles.sizeTextActive
                    ]}>
                      {size.size}
                    </Text>
                    <Text style={[
                      styles.sizePrice,
                      selectedSize?.size === size.size && styles.sizePriceActive
                    ]}>
                      ${size.price.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Add Toppings (only for pizza items) */}
          {canHaveToppings && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Add Toppings (Optional)</Text>
              <View style={styles.addonsGrid}>
                {TOPPINGS.map((topping) => (
                  <TouchableOpacity
                    key={topping.id}
                    style={[
                      styles.addonButton,
                      selectedToppings.includes(topping.id) && styles.addonButtonActive
                    ]}
                    onPress={() => toggleTopping(topping.id)}
                  >
                    {selectedToppings.includes(topping.id) && (
                      <Ionicons 
                        name="checkmark-circle" 
                        size={18} 
                        color={COLORS.primary} 
                        style={styles.addonCheck}
                      />
                    )}
                    <Text style={[
                      styles.addonName,
                      selectedToppings.includes(topping.id) && styles.addonNameActive
                    ]}>
                      {topping.name}
                    </Text>
                    <Text style={styles.addonPrice}>+${topping.price.toFixed(2)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Additional/Premium Toppings (only for pizza items) */}
          {canHaveToppings && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Premium Toppings (Optional)</Text>
                <View style={styles.premiumBadge}>
                  <Ionicons name="star" size={12} color="#FFF" />
                  <Text style={styles.premiumBadgeText}>Premium</Text>
                </View>
              </View>
              <View style={styles.addonsGrid}>
                {ADDITIONAL_TOPPINGS.map((topping) => (
                  <TouchableOpacity
                    key={topping.id}
                    style={[
                      styles.addonButton,
                      styles.premiumAddonButton,
                      selectedAdditionalToppings.includes(topping.id) && styles.addonButtonActive
                    ]}
                    onPress={() => toggleAdditionalTopping(topping.id)}
                  >
                    {selectedAdditionalToppings.includes(topping.id) && (
                      <Ionicons 
                        name="checkmark-circle" 
                        size={18} 
                        color={COLORS.primary} 
                        style={styles.addonCheck}
                      />
                    )}
                    <Text style={[
                      styles.addonName,
                      selectedAdditionalToppings.includes(topping.id) && styles.addonNameActive
                    ]}>
                      {topping.name}
                    </Text>
                    <Text style={styles.addonPrice}>+${topping.price.toFixed(2)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Add Dips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add Dips (Optional)</Text>
            <View style={styles.addonsGrid}>
              {DIPS.map((dip) => (
                <TouchableOpacity
                  key={dip.id}
                  style={[
                    styles.addonButton,
                    selectedDips.includes(dip.id) && styles.addonButtonActive
                  ]}
                  onPress={() => toggleDip(dip.id)}
                >
                  {selectedDips.includes(dip.id) && (
                    <Ionicons 
                      name="checkmark-circle" 
                      size={18} 
                      color={COLORS.primary} 
                      style={styles.addonCheck}
                    />
                  )}
                  <Text style={[
                    styles.addonName,
                    selectedDips.includes(dip.id) && styles.addonNameActive
                  ]}>
                    {dip.name}
                  </Text>
                  <Text style={styles.addonPrice}>+${dip.price.toFixed(2)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Add Drinks */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add Drinks (Optional)</Text>
            <View style={styles.addonsGrid}>
              {DRINKS.map((drink) => (
                <TouchableOpacity
                  key={drink.id}
                  style={[
                    styles.addonButton,
                    selectedDrinks.includes(drink.id) && styles.addonButtonActive
                  ]}
                  onPress={() => toggleDrink(drink.id)}
                >
                  {selectedDrinks.includes(drink.id) && (
                    <Ionicons 
                      name="checkmark-circle" 
                      size={18} 
                      color={COLORS.primary} 
                      style={styles.addonCheck}
                    />
                  )}
                  <Text style={[
                    styles.addonName,
                    selectedDrinks.includes(drink.id) && styles.addonNameActive
                  ]}>
                    {drink.name}
                  </Text>
                  <Text style={styles.addonPrice}>+${drink.price.toFixed(2)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Special Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
            <TextInput
              style={styles.instructionsInput}
              placeholder="e.g., Extra crispy, No onions, etc."
              placeholderTextColor={COLORS.textLight}
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Quantity Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={24} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Total Price */}
          <View style={styles.totalSection}>
            <View>
              <Text style={styles.totalLabel}>Total</Text>
              {(toppingsPrice > 0 || additionalToppingsPrice > 0 || dipsPrice > 0 || drinksPrice > 0) && (
                <Text style={styles.priceBreakdown}>
                  Base: ${currentPrice.toFixed(2)}
                  {toppingsPrice > 0 && ` + Toppings: $${toppingsPrice.toFixed(2)}`}
                  {additionalToppingsPrice > 0 && ` + Premium: $${additionalToppingsPrice.toFixed(2)}`}
                  {dipsPrice > 0 && ` + Dips: $${dipsPrice.toFixed(2)}`}
                  {drinksPrice > 0 && ` + Drinks: $${drinksPrice.toFixed(2)}`}
                </Text>
              )}
            </View>
            <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity 
            style={[
              styles.addToCartButton,
              (isAdding || cartLoading) && styles.addToCartButtonDisabled
            ]}
            onPress={handleAddToCart}
            disabled={isAdding || cartLoading}
          >
            {isAdding ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name="cart" size={20} color="#FFF" style={styles.cartIcon} />
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  backLink: {
    fontSize: 16,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#FFF',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  placeholderEmoji: {
    fontSize: 80,
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  popularBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 4,
  },
  infoSection: {
    padding: 20,
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 3,
  },
  sizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sizeButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sizeButtonActive: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.primary,
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  sizeTextActive: {
    color: COLORS.text,
  },
  sizePrice: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textLight,
  },
  sizePriceActive: {
    color: COLORS.text,
  },
  addonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  addonButton: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '47%',
  },
  premiumAddonButton: {
    backgroundColor: '#FFF5E6',
  },
  addonButtonActive: {
    backgroundColor: '#FFFBF0',
    borderColor: COLORS.primary,
  },
  addonCheck: {
    marginRight: 6,
  },
  addonName: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
    flex: 1,
  },
  addonNameActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  addonPrice: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  instructionsInput: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: COLORS.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  quantityButton: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    minWidth: 40,
    textAlign: 'center',
  },
  totalSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  priceBreakdown: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 4,
  },
  totalPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  addToCartButtonDisabled: {
    opacity: 0.6,
  },
  cartIcon: {
    marginRight: 8,
  },
  addToCartText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFF',
  },
});