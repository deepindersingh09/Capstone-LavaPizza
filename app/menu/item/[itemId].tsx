// app/menu/item/[itemId].tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { menuItems } from '@/data/menuData';
import { useCart } from '../../context/CartContext';

export default function ItemDetail() {
  const router = useRouter();
  const { itemId } = useLocalSearchParams();
  const { addItem, isLoading: cartLoading } = useCart();
  
  const item = menuItems.find(i => i.id === itemId);
  const [selectedSize, setSelectedSize] = useState(item?.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

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

  const currentPrice = selectedSize ? selectedSize.price : item.price;
  const totalPrice = currentPrice * quantity;

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    try {
      // Create unique ID combining item id and size
      const uniqueId = `${item.id}-${selectedSize?.size || 'default'}`;
      
      console.log('🛍️ Adding to cart:', {
        id: uniqueId,
        name: item.name,
        size: selectedSize?.size,
        quantity,
        price: currentPrice
      });

      addItem({
        id: uniqueId,
        name: item.name,
        price: currentPrice,
        quantity: quantity,
        size: selectedSize?.size,
      });

      // Small delay to ensure state updates
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color="#E53935" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Item Image Placeholder */}
        <View style={styles.imageContainer}>
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderEmoji}>🍕</Text>
            <Text style={styles.placeholderText}>{item.name}</Text>
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
            <View style={styles.sizeSection}>
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

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={20} color="#333" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={20} color="#333" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceInfo}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
        </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  backLink: {
    fontSize: 16,
    color: '#E53935',
    textDecorationLine: 'underline',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#FFF0F0',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
  },
  placeholderEmoji: {
    fontSize: 80,
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  popularBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E53935',
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
    color: '#333',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  sizeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sizeButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sizeButtonActive: {
    backgroundColor: '#FFE5E5',
    borderColor: '#E53935',
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  sizeTextActive: {
    color: '#E53935',
  },
  sizePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sizePriceActive: {
    color: '#E53935',
  },
  quantitySection: {
    marginBottom: 24,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  quantityButton: {
    width: 44,
    height: 44,
    backgroundColor: '#f5f5f5',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 40,
    textAlign: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  priceInfo: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E53935',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E53935',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  addToCartButtonDisabled: {
    opacity: 0.6,
  },
  cartIcon: {
    marginRight: 8,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});