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

  // Navigate to custom builder with chosen crust
  const handleCrustClick = (crustId: string) => {
    router.push(`/pizza/custom-builder?crust=${crustId}`);
  };

  const handlePizzaClick = (pizza: Pizza) => {
    setSelectedPizza(pizza);
    setModalVisible(true);
    setQuantity(1);
    setSelectedSize(SIZES[1]);
    setSelectedCrust('thin');
  };

const handleAddToCart = async () => {
  if (!selectedPizza || !selectedSize) {
    Alert.alert('Error', 'Please select a size');
    return;
  }

  const itemPrice = selectedPizza.price + selectedSize.price;
  const totalPrice = itemPrice * quantity;

  try {
    const cartItem = {
      id: `${selectedPizza.id}-${Date.now()}`,
      name: selectedPizza.name,
      price: totalPrice,
      quantity: quantity,
      size: selectedSize.size,
      type: selectedPizza.id.startsWith('sp') ? 'special' : 'deal',
      details: [selectedPizza.description],
    };

    const cartData = await AsyncStorage.getItem('@cart');
    const cart = cartData ? JSON.parse(cartData) : [];
    cart.push(cartItem);
    
    // ✅ SAVE AND WAIT FOR COMPLETION
    await AsyncStorage.setItem('@cart', JSON.stringify(cart));
    
    // ✅ ADD SMALL DELAY TO ENSURE STORAGE IS WRITTEN
    await new Promise(resolve => setTimeout(resolve, 100));

    Alert.alert(
      'Added to Cart! 🍕',
      `${selectedPizza.name}\n${selectedSize.size}\nQuantity: ${quantity}\nTotal: $${totalPrice.toFixed(2)}`,
      [
        { text: 'Continue Shopping', onPress: () => setModalVisible(false) },
        {
          text: 'View Cart',
          onPress: async () => {  // ✅ MAKE THIS ASYNC
            setModalVisible(false);
            // ✅ SMALL DELAY BEFORE NAVIGATION
            await new Promise(resolve => setTimeout(resolve, 100));
            router.push('/(drawer)/(tabs)/cart');
          },
        },
      ]
    );
  } catch (error) {
    console.error('Error adding to cart:', error);
    Alert.alert('Error', 'Failed to add item to cart');
  }
};
  
  const totalPrice = selectedSize ? selectedSize.price * quantity : 0;

  const ListHeader = () => (
    <View style={styles.headerArea}>
      <Text style={styles.sectionTitle}>Create your own Pizza</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.crustRow}>
        {crustOptions.map((item) => (
          <TouchableOpacity 
            key={item.id}
            style={styles.crustItem}
            onPress={() => handleCrustClick(item.id)}
            activeOpacity={0.8}
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
    <TouchableOpacity activeOpacity={0.85} style={styles.pizzaItem} onPress={() => handlePizzaClick(item)}>
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
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={26} color="#1A1A1A" />
            </TouchableOpacity>

            {selectedPizza && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={selectedPizza.image} style={styles.modalImage} />

                <Text style={styles.modalPizzaName}>{selectedPizza.name}</Text>
                <Text style={styles.modalPizzaDescription}>{selectedPizza.description}</Text>

                {/* Size */}
                <Text style={styles.modalSectionTitle}>Select Size</Text>
                <View style={styles.sizeOptions}>
                  {SIZES.map((size) => {
                    const active = selectedSize.size === size.size;
                    return (
                      <TouchableOpacity
                        key={size.size}
                        style={[styles.sizeButton, active && styles.sizeButtonActive]}
                        onPress={() => setSelectedSize(size)}
                        activeOpacity={0.9}
                      >
                        <Text style={[styles.sizeText, active && styles.sizeTextActive]}>{size.size}</Text>
                        <Text style={[styles.sizePrice, active && styles.sizePriceActive]}>
                          ${size.price.toFixed(2)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Crust */}
                <Text style={styles.modalSectionTitle}>Select Crust</Text>
                <View style={styles.crustOptionsContainer}>
                  {crustOptions.map((crust) => {
                    const active = selectedCrust === crust.id;
                    return (
                      <TouchableOpacity
                        key={crust.id}
                        style={[styles.crustOption, active && styles.crustOptionSelected]}
                        onPress={() => setSelectedCrust(crust.id)}
                        activeOpacity={0.9}
                      >
                        <Text style={[styles.crustText, active && styles.crustTextSelected]}>
                          {crust.name}
                        </Text>
                        {active && <Ionicons name="checkmark-circle" size={20} color="#FFC107" />}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Quantity */}
                <View style={styles.quantitySection}>
                  <Text style={styles.modalSectionTitle}>Quantity</Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => setQuantity(Math.max(1, quantity - 1))}
                      activeOpacity={0.9}
                    >
                      <Ionicons name="remove" size={18} color="#1A1A1A" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => setQuantity(quantity + 1)}
                      activeOpacity={0.9}
                    >
                      <Ionicons name="add" size={18} color="#1A1A1A" />
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
                    activeOpacity={0.9}
                  >
                    <Ionicons name="cart" size={20} color="#1A1A1A" style={styles.cartIcon} />
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
  // Page base
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  // Header section above list
  headerArea: {
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
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
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
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
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pizzaImage: { 
    width: 65, 
    height: 65, 
    borderRadius: 10, 
    marginRight: 14 
  },
  pizzaInfo: { flex: 1 },
  pizzaName: { 
    fontSize: 15, 
    fontWeight: '700',
    color: '#1A1A1A',
  },
  pizzaPrice: { 
    fontSize: 13, 
    color: '#666',
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
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  closeButton: { alignSelf: 'flex-end' },
  modalImage: { 
    width: 200, 
    height: 200, 
    borderRadius: 100, 
    alignSelf: 'center', 
    marginVertical: 10 
  },
  modalPizzaName: { 
    fontSize: 22, 
    fontWeight: '800', 
    textAlign: 'center',
    color: '#1A1A1A',
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
    color: '#1A1A1A',
  },

  // Size selection (cards)
  sizeOptions: { 
    flexDirection: 'row', 
    gap: 10 
  },
  sizeButton: { 
    flex: 1, 
    paddingVertical: 12, 
    borderRadius: 12, 
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sizeButtonActive: { 
    backgroundColor: '#FFFBF5',
    borderColor: '#FFC107',
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  sizeTextActive: {
    color: '#1A1A1A',
  },
  sizePrice: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontWeight: '600',
  },
  sizePriceActive: {
    color: '#1A1A1A',
  },

  // Crust selection (rows)
  crustOptionsContainer: { gap: 10 },
  crustOption: { 
    padding: 14, 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  crustOptionSelected: { 
    backgroundColor: '#FFFBF5',
    borderColor: '#FFC107',
  },
  crustText: { 
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  crustTextSelected: {
    color: '#1A1A1A',
  },

  // Quantity section
  quantitySection: { marginTop: 8 },
  quantityControls: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 18,
    paddingVertical: 8,
  },
  quantityButton: {
    backgroundColor: '#FFC107',
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  quantityText: { 
    fontSize: 20, 
    fontWeight: '800',
    color: '#1A1A1A',
    minWidth: 32,
    textAlign: 'center',
  },

  // Footer (summary + CTA)
  modalFooter: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  totalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFC107',
  },
  addToCartButton: { 
    backgroundColor: '#FFC107', 
    paddingVertical: 16, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cartIcon: { marginRight: 6 },
  addToCartText: { 
    color: '#1A1A1A', 
    fontSize: 16, 
    fontWeight: '800' 
  },
});
