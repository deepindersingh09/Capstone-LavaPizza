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

export default function App() {
  const navigation = useNavigation();

  const ListHeader = () => (
    <View style={styles.headerArea}>
      {/* Top bar */}
      <View style={styles.header}>

        <Text style={styles.headerText}>Menu</Text>
        {/* Placeholder to center title */}
        <View style={styles.backBtn} />
      </View>

      {/* Crust Selection */}
      <Text style={styles.sectionTitle}>Create your own Pizza</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.crustRow}
      >
        {crustOptions.map((item, index) => (
          <View style={styles.crustItem} key={index}>
            <Image source={item.image} style={styles.crustImage} />
            <Text style={styles.crustLabel}>{item.name}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Pizzas title */}
      <Text style={[styles.sectionTitle, { marginTop: 4 }]}>Pizzas</Text>
    </View>
  );

  const renderItem = ({ item }: { item: (typeof pizzas)[number] }) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.pizzaItem}>
      <Image source={item.image} style={styles.pizzaImage} />
      <View style={styles.pizzaInfo}>
        <Text style={styles.pizzaName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.pizzaPrice}>{item.price}</Text>
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

const CARD_BG = '#fafafa';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Top region
  headerArea: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },

  // Sections
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
    padding: 10,
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
  pizzaName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },
  pizzaPrice: {
    fontSize: 13.5,
    color: '#666',
  },
  separator: {
    height: 10, // compact, consistent spacing between cards
  },
});
