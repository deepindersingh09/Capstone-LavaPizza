import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 

// --- COLOR PALETTE ---
const PRIMARY_ORANGE = '#ff6f00'; 
const ACCENT_YELLOW = '#f9a825'; 
const CARD_BG = '#fff8f0'; 

const crustOptions = [
  { name: 'Thin Crust', image: require('../../../assets/images/menu/thin.jpeg') },
  { name: 'Thick Crust', image: require('../../../assets/images/menu/thick.jpeg') },
  { name: 'Gluten Free', image: require('../../../assets/images/menu/pizza3.jpg') },
];

const pizzas = [
  { name: 'Volcanic Pizza', price: '$11.99', image: require('../../../assets/images/menu/pizza2.png') },
  { name: 'Shawarma Pizza', price: '$15.99', image: require('../../../assets/images/menu/pizza2.png') },
  { name: 'Butter Chicken Pizza', price: '$15.99', image: require('../../../assets/images/menu/pizza3.jpg') },
  { name: 'Halal Meat Lovers', price: '$15.99', image: require('../../../assets/images/menu/pizza2.png') },
  { name: 'Veggie Pesto Pizza', price: '$15.99', image: require('../../../assets/images/menu/pizza3.jpg') },
];

export default function MenuScreen() {
  const navigation = useNavigation();

  const ListHeader = () => (
    <View style={styles.headerArea}>
      
      {/* Crust Selection */}
      <Text style={styles.sectionTitle}>Create your own Pizza</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.crustRow}
      >
        {crustOptions.map((item, index) => (
          <TouchableOpacity style={styles.crustItem} key={index} activeOpacity={0.8}>
            <View style={styles.crustImageContainer}>
                <Image source={item.image} style={styles.crustImage} />
            </View>
            <Text style={styles.crustLabel}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Pizzas title */}
      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Pizzas</Text>
    </View>
  );

  const renderItem = ({ item }: { item: (typeof pizzas)[number] }) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.pizzaItem}>
      <Image source={item.image} style={styles.pizzaImage} />
      <View style={styles.pizzaInfo}>
        <Text style={styles.pizzaName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.pizzaPrice}>{item.price}</Text>
      </View>
      <View style={styles.addButton}>
        <Ionicons name="add" size={20} color="#fff" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={pizzas}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// --- STYLES ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Top region 
  headerArea: {
    paddingHorizontal: 16,
    paddingTop: 16, 
    paddingBottom: 8,
  },

  // Sections
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginTop: 12,
    marginBottom: 8,
  },

  // Crust chips row
  crustRow: {
    paddingVertical: 4,
    gap: 18,
  },
  crustItem: {
    alignItems: 'center',
    width: 86,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  crustImageContainer: {
    width: 86,
    height: 86,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: ACCENT_YELLOW + '30', 
    borderWidth: 2,
    borderColor: ACCENT_YELLOW,
  },
  crustImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.9,
  },
  crustLabel: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: PRIMARY_ORANGE,
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
    elevation: 2, 
    shadowColor: '#000', 
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  pizzaImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
    marginRight: 15,
    backgroundColor: ACCENT_YELLOW + '20', 
  },
  pizzaInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  pizzaName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  pizzaPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: PRIMARY_ORANGE,
  },
  addButton: {
    backgroundColor: PRIMARY_ORANGE,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    elevation: 3,
  },
  separator: {
    height: 10,
  },
});