// app/(drawer)/(tabs)/specials.tsx
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
import { useCart } from '../../context/CartContext';


// Pizza data structure
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
  const [selectedSize, setSelectedSize] = useState(SIZES[1]); // Default to Medium
  const [quantity, setQuantity] = useState(1);

  // Handle pizza card click
  const handlePizzaClick = (pizza: Pizza) => {
    setSelectedPizza(pizza);
    setModalVisible(true);
    setQuantity(1);
    setSelectedSize(SIZES[1]);
    setSelectedCrust('thin');
  };

  // Handle add to cart
  const handleAddToCart = () => {
  // Check if pizza and size are selected
  if (!selectedPizza || !selectedSize) {
    Alert.alert('Error', 'Please select a size before adding to cart');
    return;
  }

  const totalPrice = selectedSize.price * quantity;

  Alert.alert(
    'Added to Cart! 🍕',
    `${selectedPizza.name}\n${selectedSize.size} • ${selectedCrust} crust\nQuantity: ${quantity}\nTotal: $${totalPrice.toFixed(2)}`,
    [
      { text: 'Continue Shopping', onPress: () => setModalVisible(false) },
      { 
        text: 'View Cart', 
        onPress: () => {
          setModalVisible(false);
          router.push('/(drawer)/(tabs)/cart');
        }
      },
    ]
  );
};

  // Calculate total price
  const totalPrice = selectedSize ? selectedSize.price * quantity : 0;

  const ListHeader = () => (
    <View style={styles.headerArea}>
      {/* Crust Selection */}
      <Text style={styles.sectionTitle}>Create your own Pizza</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.crustRow}
      >
        {crustOptions.map((item) => (
          <View style={styles.crustItem} key={item.id}>
            <Image source={item.image} style={styles.crustImage} />
            <Text style={styles.crustLabel}>{item.name}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Pizzas title */}
      <Text style={[styles.sectionTitle, { marginTop: 4 }]}>Pizzas</Text>
    </View>
  );

  const renderItem = ({ item }: { item: Pizza }) => (
    <TouchableOpacity 
      activeOpacity={0.7} 
      style={styles.pizzaItem}
      onPress={() => handlePizzaClick(item)}
    >
      <Image source={item.image} style={styles.pizzaImage} />
      <View style={styles.pizzaInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.pizzaName} numberOfLines={1}>{item.name}</Text>
          {item.popular && (
            <View style={styles.popularBadge}>
              <Ionicons name="star" size={12} color="#FFF" />
            </View>
          )}
        </View>
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
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Pizza Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>

            {selectedPizza && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Pizza Image */}
                <View style={styles.modalImageContainer}>
                  <Image source={selectedPizza.image} style={styles.modalPizzaImage} />
                  {selectedPizza.popular && (
                    <View style={styles.modalPopularBadge}>
                      <Ionicons name="star" size={16} color="#FFF" />
                      <Text style={styles.modalPopularText}>Popular</Text>
                    </View>
                  )}
                </View>

                {/* Pizza Info */}
                <Text style={styles.modalPizzaName}>{selectedPizza.name}</Text>
                <Text style={styles.modalPizzaDescription}>{selectedPizza.description}</Text>

                {/* Size Selection */}
                <View style={styles.sizeSection}>
                  <Text style={styles.modalSectionTitle}>Select Size</Text>
                  <View style={styles.sizeOptions}>
                    {SIZES.map((size) => (
                      <TouchableOpacity
                        key={size.size}
                        style={[
                          styles.sizeButton,
                          selectedSize.size === size.size && styles.sizeButtonActive
                        ]}
                        onPress={() => setSelectedSize(size)}
                      >
                        <Text style={[
                          styles.sizeText,
                          selectedSize.size === size.size && styles.sizeTextActive
                        ]}>
                          {size.size}
                        </Text>
                        <Text style={[
                          styles.sizePrice,
                          selectedSize.size === size.size && styles.sizePriceActive
                        ]}>
                          ${size.price.toFixed(2)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Crust Selection */}
                <View style={styles.crustSection}>
                  <Text style={styles.modalSectionTitle}>Select Crust</Text>
                  {crustOptions.map((crust) => (
                    <TouchableOpacity
                      key={crust.id}
                      style={[
                        styles.crustOption,
                        selectedCrust === crust.id && styles.crustOptionSelected
                      ]}
                      onPress={() => setSelectedCrust(crust.id)}
                    >
                      <View style={styles.radioButton}>
                        {selectedCrust === crust.id && <View style={styles.radioButtonInner} />}
                      </View>
                      <Text style={styles.crustOptionText}>{crust.name}</Text>
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

                {/* Add to Cart Button */}
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

const CARD_BG = '#fafafa';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Header area
  headerArea: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginTop: 12,
    marginBottom: 8,
  },

  // Crust chips row
  crustRow: {
    paddingVertical: 4,
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
    backgroundColor: CARD_BG,
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  pizzaImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  pizzaInfo: {
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pizzaName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
    flex: 1,
  },
  popularBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pizzaPrice: {
    fontSize: 13.5,
    color: '#666',
  },
  separator: {
    height: 10,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 4,
    marginBottom: 8,
  },
  modalImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  modalPizzaImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  modalPopularBadge: {
    position: 'absolute',
    top: 10,
    right: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E53935',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  modalPopularText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  modalPizzaName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#111',
  },
  modalPizzaDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },

  // Size section
  sizeSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111',
  },
  sizeOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  sizeButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 14,
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
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  sizePriceActive: {
    color: '#E53935',
  },

  // Crust section
  crustSection: {
    marginBottom: 20,
  },
  crustOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  crustOptionSelected: {
    borderColor: '#E53935',
    backgroundColor: '#fff5f0',
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
  crustOptionText: {
    fontSize: 14,
    color: '#111',
  },

  // Quantity section
  quantitySection: {
    marginBottom: 20,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  quantityButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
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

  // Modal footer
  modalFooter: {
    marginTop: 10,
  },
  totalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
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
    justifyContent: 'center',
    backgroundColor: '#E53935',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  cartIcon: {
    marginRight: 4,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});