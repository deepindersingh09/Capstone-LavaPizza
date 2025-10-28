// app/(drawer)/(tabs)/home/index.tsx - WITH CART FUNCTIONALITY
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '@/lib/firebase';

const deals = [
  {
    id: 'a',
    title: 'Deal A',
    price: 24.99,
    img: require('../../../../assets/images/menu/menu_pizza.png'),
    description: '2 Medium Pizzas + Wings',
  },
  {
    id: 'b',
    title: 'Deal B',
    price: 26.99,
    img: require('../../../../assets/images/menu/menu_pizza.png'),
    description: '2 Large Pizzas',
  },
  {
    id: 'c',
    title: 'Deal C',
    price: 31.99,
    img: require('../../../../assets/images/menu/menu_pizza.png'),
    description: '3 Medium Pizzas + 2L Pop',
  },
  {
    id: 'd',
    title: 'Deal D',
    price: 31.99,
    img: require('../../../../assets/images/menu/menu_pizza.png'),
    description: 'Family Pack Special',
  },
];

const specials = [
  {
    id: 'sp1',
    title: 'Samosa Poutine',
    price: 12.99,
    img: require('../../../../assets/images/menu/samosa_poutine.jpg'),
    description: 'Crispy samosas on golden fries',
  },
  {
    id: 'sp2',
    title: 'Shahi Fries',
    price: 10.99,
    img: require('../../../../assets/images/menu/shahi_fries.png'),
    description: 'Loaded fries with shahi sauce',
  },
  {
    id: 'sp3',
    title: 'Lava Tikki',
    price: 8.99,
    img: require('../../../../assets/images/menu/Lava_Tikki.png'),
    description: 'Spicy potato tikki burger',
  },
  {
    id: 'sp4',
    title: 'Devil Fries',
    price: 11.99,
    img: require('../../../../assets/images/menu/devil_fries.jpg'),
    description: 'Extra spicy loaded fries',
  },
];

const categories = [
  {
    id: 'c1',
    title: 'Pasta',
    img: require('../../../../assets/images/menu/pasta.png'),
    routeId: 'pasta',
  },
  {
    id: 'c2',
    title: 'Gourmet Pizza',
    img: require('../../../../assets/images/menu/pizza2.png'),
    routeId: 'gourmet-pizza',
  },
  {
    id: 'c3',
    title: 'Pizza',
    img: require('../../../../assets/images/menu/pizza3.jpg'),
    routeId: 'pizza',
  },
  {
    id: 'c4',
    title: 'Double Pizza Deals',
    img: require('../../../../assets/images/menu/double_pizza.png'),
    routeId: 'double-pizza-deals',
  },
  {
    id: 'c5',
    title: 'Appetizers',
    img: require('../../../../assets/images/menu/appetizers.png'),
    routeId: 'appetizers',
  },
  {
    id: 'c6',
    title: 'Drinks & Dips',
    img: require('../../../../assets/images/menu/drinks.png'),
    routeId: 'drinks-dips',
  },
  {
    id: 'c7',
    title: 'Chicken Wings',
    img: require('../../../../assets/images/menu/chicken_wings.png'),
    routeId: 'chicken-wings',
  },
  {
    id: 'c8',
    title: 'Poutines',
    img: require('../../../../assets/images/menu/poutines.png'),
    routeId: 'poutines',
  },
  {
    id: 'c9',
    title: 'Pizza Subs',
    img: require('../../../../assets/images/menu/pizza_subs.png'),
    routeId: 'pizza-subs',
  },
  {
    id: 'c10',
    title: 'Shawarma Wraps',
    img: require('../../../../assets/images/menu/shawarma_wraps.png'),
    routeId: 'shawarma-wraps',
  },
  {
    id: 'c11',
    title: 'Sides',
    img: require('../../../../assets/images/menu/sides.png'),
    routeId: 'sides',
  },
  {
    id: 'c12',
    title: 'Walk-In Specials',
    img: require('../../../../assets/images/menu/walk_in_specials.png'),
    routeId: 'walk-in-specials',
  },
  {
    id: 'c13',
    title: 'Meals',
    img: require('../../../../assets/images/menu/meals.png'),
    routeId: 'meals',
  },
  {
    id: 'c14',
    title: 'Salads',
    img: require('../../../../assets/images/menu/salads.png'),
    routeId: 'salads',
  },
  {
    id: 'c15',
    title: 'Cakes',
    img: require('../../../../assets/images/menu/cakes.png'),
    routeId: 'cakes',
  },
];

const SIZES = [
  { size: 'Small', price: 0 },
  { size: 'Medium', price: 4 },
  { size: 'Large', price: 8 },
];

const imgSrc = (img: any) => (typeof img === 'string' ? { uri: img } : img);

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('There');

  // Modal state
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState(SIZES[1]); // Default to Medium
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadUserName();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      loadUserName();
    }, [])
  );

  const loadUserName = async () => {
    try {
      const guestMode = await AsyncStorage.getItem('@guest_mode');
      if (guestMode === '1') {
        setUserName('There');
        return;
      }
      let firstName = await AsyncStorage.getItem('@user_first_name');
      if (!firstName && auth.currentUser?.displayName) {
        firstName = auth.currentUser.displayName;
        await AsyncStorage.setItem('@user_first_name', firstName);
      }
      setUserName(firstName || 'There');
    } catch (e) {
      console.warn('Failed to load user name', e);
      setUserName('There');
    }
  };

  // Handle clicking on deal or special - OPEN MODAL
  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
    setQuantity(1);
    setSelectedSize(SIZES[1]);
  };

  // Handle category click - NAVIGATE
  const handleCategoryPress = (routeId: string) =>
    router.push(`/menu/${routeId}`);

  // Add to cart function
  const handleAddToCart = async () => {
    if (!selectedItem || !selectedSize) {
      Alert.alert('Error', 'Please select a size');
      return;
    }

    const itemPrice = selectedItem.price + selectedSize.price;
    const totalPrice = itemPrice * quantity;

    try {
      // Create cart item
      const cartItem = {
        id: `${selectedItem.id}-${Date.now()}`,
        name: selectedItem.title,
        price: totalPrice,
        quantity: quantity,
        size: selectedSize.size,
        type: selectedItem.id.startsWith('sp') ? 'special' : 'deal',
        details: [selectedItem.description],
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
        `${selectedItem.title}\n${selectedSize.size}\nQuantity: ${quantity}\nTotal: $${totalPrice.toFixed(2)}`,
        [
          { text: 'Continue Shopping', onPress: () => setModalVisible(false) },
          {
            text: 'View Cart',
            onPress: () => {
              setModalVisible(false);
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

  const totalPrice = selectedItem
    ? (selectedItem.price + selectedSize.price) * quantity
    : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.hello}>Hi, {userName}!</Text>
        <Text style={styles.sub}>Let the cheesy goodness begin!</Text>

        <Text style={styles.section}>Deals for you</Text>
        <FlatList
          horizontal
          data={deals}
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingHorizontal: 4 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dealCard}
              activeOpacity={0.85}
              onPress={() => handleItemClick(item)}
            >
              <Image source={imgSrc(item.img)} style={styles.dealImage} />
              <Text numberOfLines={1} style={styles.dealTitle}>
                {item.title}
              </Text>
              <Text style={styles.dealPrice}>From ${item.price.toFixed(2)}</Text>
            </TouchableOpacity>
          )}
        />

        <Text style={styles.section}>Lava's Specials</Text>
        <FlatList
          horizontal
          data={specials}
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingHorizontal: 4 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.specialCard}
              activeOpacity={0.85}
              onPress={() => handleItemClick(item)}
            >
              <Image source={imgSrc(item.img)} style={styles.specialImage} />
              <Text numberOfLines={1} style={styles.specialTitle}>
                {item.title}
              </Text>
              <Text style={styles.specialPrice}>${item.price.toFixed(2)}</Text>
            </TouchableOpacity>
          )}
        />

        <Text style={styles.section}>Explore the menu</Text>
        <View style={styles.grid}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={styles.gridCard}
              activeOpacity={0.9}
              onPress={() => handleCategoryPress(c.routeId)}
            >
              <Image source={imgSrc(c.img)} style={styles.gridImage} />
              <Text numberOfLines={2} style={styles.gridTitle}>
                {c.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Add to Cart Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={26} color="#333" />
            </TouchableOpacity>

            {selectedItem && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                  source={imgSrc(selectedItem.img)}
                  style={styles.modalImage}
                />

                <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                <Text style={styles.modalDescription}>
                  {selectedItem.description}
                </Text>

                {/* Size Selection */}
                <Text style={styles.modalSectionTitle}>Select Size</Text>
                <View style={styles.sizeOptions}>
                  {SIZES.map((size) => (
                    <TouchableOpacity
                      key={size.size}
                      style={[
                        styles.sizeButton,
                        selectedSize.size === size.size &&
                          styles.sizeButtonActive,
                      ]}
                      onPress={() => setSelectedSize(size)}
                    >
                      <Text style={styles.sizeText}>{size.size}</Text>
                      <Text style={styles.sizePrice}>
                        ${(selectedItem.price + size.price).toFixed(2)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Quantity */}
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

                {/* Footer */}
                <View style={styles.modalFooter}>
                  <View style={styles.totalInfo}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalPrice}>
                      ${totalPrice.toFixed(2)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={handleAddToCart}
                  >
                    <Ionicons
                      name="cart"
                      size={20}
                      color="#FFF"
                      style={{ marginRight: 8 }}
                    />
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
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { paddingVertical: 16, paddingHorizontal: 8 },
  hello: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#1A1A1A',
  },
  sub: { fontSize: 16, color: '#666', marginBottom: 18 },
  section: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 18,
    marginBottom: 10,
    color: '#1A1A1A',
  },
  dealCard: {
    width: 140,
    backgroundColor: '#fff8f0',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  dealImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  dealTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
    color: '#1A1A1A',
  },
  dealPrice: { fontSize: 15, fontWeight: 'bold', color: '#E53935' },
  specialCard: {
    width: 120,
    backgroundColor: '#f0f0e2',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  specialImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  specialTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 4,
  },
  specialPrice: { fontSize: 13, fontWeight: 'bold', color: '#E53935' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 24,
  },
  gridCard: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  gridImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 6,
    resizeMode: 'cover',
  },
  gridTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
    textAlign: 'center',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: 'center',
    marginVertical: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111',
  },
  modalDescription: {
    textAlign: 'center',
    marginBottom: 14,
    fontSize: 14,
    color: '#555',
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 10,
    color: '#111',
  },
  sizeOptions: {
    flexDirection: 'row',
    gap: 10,
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
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});