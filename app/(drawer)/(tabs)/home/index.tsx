import React from 'react';
import { ScrollView, View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Login from '@/app/auth/login';
const USER_NAME = 'Hi, There';

const deals = [
  { id: 'a', title: 'Deal A', price: 24.99, img: require('../../../../assets/images/menu/menu_pizza.png') },
  { id: 'b', title: 'Deal B', price: 26.99, img: require('../../../../assets/images/menu/menu_pizza.png') },
  { id: 'c', title: 'Deal C', price: 31.99, img: require('../../../../assets/images/menu/menu_pizza.png') },
  { id: 'd', title: 'Deal D', price: 31.99, img: require('../../../../assets/images/menu/menu_pizza.png') },
];

const specials = [
  { id: 'sp1', title: 'Samosa Poutine', img: require('../../../../assets/images/menu/samosa_poutine.jpg') },
  { id: 'sp2', title: 'Shahi Fries', img: require('../../../../assets/images/menu/shahi_fries.png') },
  { id: 'sp3', title: 'Lava Tikki', img: require('../../../../assets/images/menu/Lava_Tikki.png') },
  { id: 'sp4', title: 'Devil Fries', img: require('../../../../assets/images/menu/devil_fries.jpg') },
];

const categories = [
  { id: 'c1', title: 'Pasta', img: require('../../../../assets/images/menu/pasta.png') },
  { id: 'c2', title: 'Gourmet Pizza', img: require('../../../../assets/images/menu/pizza2.png') },
  { id: 'c3', title: 'Pizza', img: require('../../../../assets/images/menu/pizza3.jpg') },
  { id: 'c4', title: 'Double Pizza Deals', img: require('../../../../assets/images/menu/double_pizza.png') },
  { id: 'c5', title: 'Appetizers', img: require('../../../../assets/images/menu/appetizers.png') },
  { id: 'c6', title: 'Drinks & Dips', img: require('../../../../assets/images/menu/drinks.png') },
  { id: 'c7', title: 'Chicken Wings', img: require('../../../../assets/images/menu/chicken_wings.png') },
  { id: 'c8', title: 'Poutines', img: require('../../../../assets/images/menu/poutines.png') },
  { id: 'c9', title: 'Pizza Subs', img: require('../../../../assets/images/menu/pizza_subs.png') },
  { id: 'c10', title: 'Shawarma Wraps', img: require('../../../../assets/images/menu/shawarma_wraps.png') },
  { id: 'c11', title: 'Sides', img: require('../../../../assets/images/menu/sides.png') }, // fixed label
  { id: 'c12', title: 'Walk-In Specials', img: require('../../../../assets/images/menu/walk_in_specials.png') },
  { id: 'c13', title: 'Meals', img: require('../../../../assets/images/menu/meals.png') },
  { id: 'c14', title: 'Salads', img: require('../../../../assets/images/menu/salads.png') },
  { id: 'c15', title: 'Cakes', img: require('../../../../assets/images/menu/cakes.png') },
];

const imgSrc = (img: any) => (typeof img === 'string' ? { uri: img } : img);

export default function HomeScreen() {
  return (
    // Tabs header is visible, so we only need left/right/bottom safe areas
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.hello}>{USER_NAME}!</Text>
        <Text style={styles.sub}>Let the cheesy goodness begin!</Text>

        <Text style={styles.section}>Deals for you</Text>
        <FlatList
          horizontal
          data={deals}
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingHorizontal: 4 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.dealCard} activeOpacity={0.85}>
              <Image source={imgSrc(item.img)} style={styles.dealImage} />
              <Text numberOfLines={1} style={styles.dealTitle}>{item.title}</Text>
              <Text style={styles.dealPrice}>${item.price.toFixed(2)}</Text>
            </TouchableOpacity>
          )}
        />

        <Text style={styles.section}>Lava’s Specials</Text>
        <FlatList
          horizontal
          data={specials}
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingHorizontal: 4 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.specialCard} activeOpacity={0.85}>
              <Image source={imgSrc(item.img)} style={styles.specialImage} />
              <Text numberOfLines={1} style={styles.specialTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />

        <Text style={styles.section}>Explore the menu</Text>
        <View style={styles.grid}>
          {categories.map((c) => (
            <TouchableOpacity key={c.id} style={styles.gridCard} activeOpacity={0.9}>
              <Image source={imgSrc(c.img)} style={styles.gridImage} />
              <Text numberOfLines={2} style={styles.gridTitle}>{c.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  hello: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#d32f2f',
  },
  sub: {
    fontSize: 16,
    color: '#444',
    marginBottom: 18,
  },
  section: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 18,
    marginBottom: 10,
    color: '#222',
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
    color: '#b71c1c',
  },
  dealPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
  specialCard: {
    width: 120,
    backgroundColor: '#f3f6fa',
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
    color: '#222',
    textAlign: 'center',
  },
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
    color: '#444',
    textAlign: 'center',
  },
});
