import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CARD_BG = '#fff';

const pizzas = [
  { 
    id: 'volcanic-pizza',
    name: 'Volcanic Pizza', 
    price: 11.99, 
    image: require('../../../assets/images/menu/pizza2.png'),
    description: 'Spicy and hot! Loaded with jalapeños, hot sauce, and pepper jack cheese.',
    popular: true,
  },
  { 
    id: 'shawarma-pizza',
    name: 'Shawarma Pizza', 
    price: 15.99, 
    image: require('../../../assets/images/menu/pizza2.png'),
    description: 'Middle Eastern inspired pizza with tender shawarma meat and garlic sauce.',
  },
  { 
    id: 'butter-chicken-pizza',
    name: 'Butter Chicken Pizza', 
    price: 15.99, 
    image: require('../../../assets/images/menu/pizza3.jpg'),
    description: 'Indian fusion with creamy butter chicken sauce and tandoori spices.',
  },
  { 
    id: 'halal-meat-lovers',
    name: 'Halal Meat Lovers', 
    price: 15.99, 
    image: require('../../../assets/images/menu/pizza2.png'),
    description: 'Loaded with halal beef, chicken, and lamb. A meat lover\'s dream!',
  },
  { 
    id: 'veggie-pesto-pizza',
    name: 'Veggie Pesto Pizza', 
    price: 15.99, 
    image: require('../../../assets/images/menu/pizza3.jpg'),
    description: 'Fresh vegetables with homemade basil pesto and mozzarella.',
  },
];

const crustOptions = [
  { id: 'thin', name: 'Thin Crust', image: require('../../../assets/images/menu/thin.jpeg') },
  { id: 'thick', name: 'Thick Crust', image: require('../../../assets/images/menu/thick.jpeg') },
  { id: 'gluten-free', name: 'Gluten Free', image: require('../../../assets/images/menu/pizza3.jpg') },
];

const SIZES = [
  { size: 'Small', price: 11.99 },
  { size: 'Medium', price: 15.99 },
  { size: 'Large', price: 19.99 },
];

type Pizza = typeof pizzas[0];

export default function SpecialsScreen() {
  const router = useRouter();

  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCrust, setSelectedCrust] = useState('thin');
  const [selectedSize, setSelectedSize] = useState(SIZES[1]);
  const [quantity, setQuantity] = useState(1);

  // Handle crust selection - Navigate to custom builder
  const handleCrustClick = (crustId: string) => {
    router.push(`/pizza/custom-builder?crust=${crustId}`);
  };

  // Handle pizza card click
  const handlePizzaClick = (pizza: Pizza) => {
    setSelectedPizza(pizza);
    setModalVisible(true);
    setQuantity(1);
    setSelectedSize(SIZES[1]);
    setSelectedCrust('thin');
  };

  const handleAddToCart = async () => {
    if (!selectedPizza || !selectedSize) {
      Alert.alert('Error', 'Please select a size before adding to cart');
      return;
    }

    const totalPrice = selectedSize.price * quantity;

    try {
      // Create cart item
      const cartItem = {
        id: `${selectedPizza.id}-${Date.now()}`,
        name: selectedPizza.name,
        price: totalPrice,
        quantity: quantity,
        size: selectedSize.size,
        crust: selectedCrust,
        type: 'special',
      };

      // Get existing cart
      const cartData = await AsyncStorage.getItem('@cart');
      const cart = cartData ? JSON.parse(cartData) : [];

      // Add new item
      cart.push(cartItem);

      // Save cart
      await AsyncStorage.setItem('@cart', JSON.stringify(cart));

      Alert.alert(
        'Added to Cart! 🍕',
        `${selectedPizza.name}\n${selectedSize.size} • ${selectedCrust} crust\nQuantity: ${quantity}\nTotal: $${totalPrice.toFixed(2)}`,
        [
          { text: 'Continue Shopping', onPress: () => setModalVisible(false) },
          { 
            text: 'View Cart', 
            onPress: () => {
              setModalVisible(false);
              try {
                router.push('/(drawer)/(tabs)/cart');
              } catch (e) {
                router.push('/cart');
              }
            }
          },
        ]
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };
  
  // Calculate total price
  const totalPrice = selectedSize ? selectedSize.price * quantity : 0;

  const ListHeader = () => (
    <View style={styles.headerArea}>
      {/* Crust Selection - CLICKABLE */}
      <Text style={styles.sectionTitle}>Create your own Pizza</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.crustRow}>
        {crustOptions.map((item) => (
          <TouchableOpacity 
            key={item.id}
            style={styles.crustItem}
            onPress={() => handleCrustClick(item.id)}
            activeOpacity={0.7}
          >
            <Image source={item.image} style={styles.crustImage} />
            <Text style={styles.crustLabel}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={[styles.sectionTitle, { marginTop: 4 }]}>Pizzas</Text>
    </View>
  );

  const renderItem = ({ item }: { item: Pizza }) => (
    <TouchableOpacity activeOpacity={0.7} style={styles.pizzaItem} onPress={() => handlePizzaClick(item)}>
      <Image source={item.image} style={styles.pizzaImage} />
      <View style={styles.pizzaInfo}>
        <Text style={styles.pizzaName}>{item.name}</Text>
        <Text style={styles.pizzaPrice}>From ${item.price.toFixed(2)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={pizzas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={26} color="#333" />
            </TouchableOpacity>

            {selectedPizza && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={selectedPizza.image} style={styles.modalImage} />

                <Text style={styles.modalPizzaName}>{selectedPizza.name}</Text>
                <Text style={styles.modalPizzaDescription}>{selectedPizza.description}</Text>

                {/* Size */}
                <Text style={styles.modalSectionTitle}>Select Size</Text>
                <View style={styles.sizeOptions}>
                  {SIZES.map((size) => (
                    <TouchableOpacity
                      key={size.size}
                      style={[styles.sizeButton, selectedSize.size === size.size && styles.sizeButtonActive]}
                      onPress={() => setSelectedSize(size)}
                    >
                      <Text style={styles.sizeText}>{size.size}</Text>
                      <Text style={styles.sizePrice}>${size.price.toFixed(2)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Crust */}
                <Text style={styles.modalSectionTitle}>Select Crust</Text>
                <View style={styles.crustOptionsContainer}>
                  {crustOptions.map((crust) => (
                    <TouchableOpacity
                      key={crust.id}
                      style={[styles.crustOption, selectedCrust === crust.id && styles.crustOptionSelected]}
                      onPress={() => setSelectedCrust(crust.id)}
                    >
                      <Text style={[styles.crustText, selectedCrust === crust.id && styles.crustTextSelected]}>
                        {crust.name}
                      </Text>
                      {selectedCrust === crust.id && (
                        <Ionicons name="checkmark-circle" size={20} color="#E53935" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Quantity Selector */}
                <View style={styles.quantitySection}>
                  <Text style={styles.modalSectionTitle}>Quantity</Text>
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

                {/* Total & Add to Cart */}
                <View style={styles.modalFooter}>
                  <View style={styles.totalInfo}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.addToCartButton}
                    onPress={handleAddToCart}
                  >
                    <Ionicons name="cart" size={20} color="#FFF" style={styles.cartIcon} />
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ height: 20 }} />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7E6',
  },

  // Header section
  headerArea: {
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },

  // Crust chips row
  crustRow: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    gap: 14,
  },
  crustItem: {
    alignItems: 'center',
    width: 86,
  },
  crustImage: {
    width: 86,
    height: 86,
    borderRadius: 16,
    backgroundColor: CARD_BG,
  },
  crustLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
  },

  // Pizza list
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  pizzaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    padding: 12,
    borderRadius: 12,
  },
  pizzaImage: { 
    width: 65, 
    height: 65, 
    borderRadius: 10, 
    marginRight: 14 
  },
  pizzaInfo: { 
    flex: 1 
  },
  pizzaName: { 
    fontSize: 15, 
    fontWeight: '600',
    color: '#111',
  },
  pizzaPrice: { 
    fontSize: 13, 
    color: '#444',
    marginTop: 2,
  },

  // Modal styles
  modalOverlay: { 
    flex: 1, 
    justifyContent: 'flex-end', 
    backgroundColor: 'rgba(0,0,0,0.4)' 
  },
  modalContent: { 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    padding: 20,
    maxHeight: '90%',
  },
  closeButton: { 
    alignSelf: 'flex-end' 
  },
  modalImage: { 
    width: 200, 
    height: 200, 
    borderRadius: 100, 
    alignSelf: 'center', 
    marginVertical: 10 
  },
  modalPizzaName: { 
    fontSize: 22, 
    fontWeight: '700', 
    textAlign: 'center',
    color: '#111',
  },
  modalPizzaDescription: { 
    textAlign: 'center', 
    marginBottom: 14, 
    fontSize: 14, 
    color: '#555' 
  },
  modalSectionTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    marginTop: 16,
    marginBottom: 10,
    color: '#111',
  },

  // Size selection
  sizeOptions: { 
    flexDirection: 'row', 
    gap: 10 
  },
  sizeButton: { 
    flex: 1, 
    padding: 12, 
    borderRadius: 10, 
    backgroundColor: '#F5F5F5', 
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5F5F5',
  },
  sizeButtonActive: { 
    backgroundColor: '#FFEDD5',
    borderColor: '#E53935',
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sizePrice: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  // Crust selection
  crustOptionsContainer: {
    gap: 8,
  },
  crustOption: { 
    padding: 12, 
    backgroundColor: '#F5F5F5', 
    borderRadius: 10, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5F5F5',
  },
  crustOptionSelected: { 
    backgroundColor: '#FFEDD5',
    borderColor: '#E53935',
  },
  crustText: { 
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  crustTextSelected: {
    fontWeight: '600',
    color: '#E53935',
  },

  // Quantity section
  quantitySection: {
    marginTop: 8,
  },
  quantityControls: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 20,
    paddingVertical: 8,
  },
  quantityButton: {
    backgroundColor: '#F5F5F5',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: { 
    fontSize: 20, 
    fontWeight: '700',
    color: '#111',
    minWidth: 40,
    textAlign: 'center',
  },

  // Footer
  modalFooter: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E53935',
  },
  addToCartButton: { 
    backgroundColor: '#E53935', 
    padding: 16, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  cartIcon: {
    marginRight: 4,
  },
  addToCartText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '700' 
  },
});