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

  const handlePizzaClick = (pizza: Pizza) => {
    setSelectedPizza(pizza);
    setModalVisible(true);
    setQuantity(1);
    setSelectedSize(SIZES[1]);
    setSelectedCrust('thin');
  };

  const handleAddToCart = () => {
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
        { text: 'View Cart', onPress: () => {
            setModalVisible(false);
            router.push('/(drawer)/(tabs)/cart');
        }}
      ]
    );
  };

  const totalPrice = selectedSize.price * quantity;

  const ListHeader = () => (
    <View style={styles.headerArea}>
      <Text style={styles.sectionTitle}>Create your own Pizza</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.crustRow}>
        {crustOptions.map((item) => (
          <View style={styles.crustItem} key={item.id}>
            <Image source={item.image} style={styles.crustImage} />
            <Text style={styles.crustLabel}>{item.name}</Text>
          </View>
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
                      <Text>${size.price.toFixed(2)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Crust */}
                <Text style={styles.modalSectionTitle}>Select Crust</Text>
                {crustOptions.map((crust) => (
                  <TouchableOpacity
                    key={crust.id}
                    style={[styles.crustOption, selectedCrust === crust.id && styles.crustOptionSelected]}
                    onPress={() => setSelectedCrust(crust.id)}
                  >
                    <Text style={styles.crustText}>{crust.name}</Text>
                  </TouchableOpacity>
                ))}

                {/* Quantity */}
                <Text style={styles.modalSectionTitle}>Quantity</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Ionicons name="remove" size={24} />
                  </TouchableOpacity>
                  <Text style={styles.quantityNumber}>{quantity}</Text>
                  <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                    <Ionicons name="add" size={24} />
                  </TouchableOpacity>
                </View>

                {/* Price + Add */}
                <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
                  <Ionicons name="cart" size={20} color="#FFF" />
                  <Text style={styles.addToCartText}>Add • ${totalPrice.toFixed(2)}</Text>
                </TouchableOpacity>

                <View style={{ height: 20 }} />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerArea: { padding: 16, paddingBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  crustRow: { gap: 12 },
  crustItem: { width: 80, alignItems: 'center' },
  crustImage: { width: 80, height: 80, borderRadius: 12 },
  crustLabel: { marginTop: 4, fontSize: 12 },
  listContent: { padding: 16 },
  pizzaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    padding: 12,
    borderRadius: 12,
  },
  pizzaImage: { width: 65, height: 65, borderRadius: 10, marginRight: 14 },
  pizzaInfo: { flex: 1 },
  pizzaName: { fontSize: 15, fontWeight: '600' },
  pizzaPrice: { fontSize: 13, color: '#444' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  closeButton: { alignSelf: 'flex-end' },
  modalImage: { width: 200, height: 200, borderRadius: 100, alignSelf: 'center', marginVertical: 10 },
  modalPizzaName: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  modalPizzaDescription: { textAlign: 'center', marginBottom: 14, fontSize: 14, color: '#555' },
  modalSectionTitle: { fontSize: 16, fontWeight: '700', marginVertical: 10 },
  sizeOptions: { flexDirection: 'row', gap: 10 },
  sizeText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#333',
},

  sizeButton: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#eee', alignItems: 'center' },
  sizeButtonActive: { backgroundColor: '#FFEDD5' },
  crustOption: { padding: 10, backgroundColor: '#eee', borderRadius: 8, marginBottom: 6 },
  crustOptionSelected: { backgroundColor: '#FFEDD5' },
  crustText: { fontSize: 14 },
  quantityControls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 14, marginVertical: 12 },
  quantityNumber: { fontSize: 18, fontWeight: '700' },
  addToCartBtn: { backgroundColor: '#E53935', padding: 14, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  addToCartText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
