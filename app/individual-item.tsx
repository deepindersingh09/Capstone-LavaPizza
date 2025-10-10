import * as React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const crustOptions = [
  { name: 'Thin Crust', image: require('../assets/images/menu/thin.jpeg') },
  { name: 'Thick Crust', image: require('../assets/images/menu/thick.jpeg') },
  { name: 'Gluten Free', image: require('../assets/images/menu/pizza2.png') },
];

const pizzas = [
  { name: 'Volcanic Pizza', price: '$11.99', image: require('../assets/images/menu/pizza2.png') },
  { name: 'Shawarma Pizza', price: '$15.99', image: require('../assets/images/menu/pizza2.png') },
  { name: 'Butter Chicken Pizza', price: '$15.99', image: require('../assets/images/menu/pizza2.png') },
  { name: 'Halal Meat Lovers', price: '$15.99', image: require('../assets/images/menu/pizza2.png') },
  { name: 'Veggie Pesto Pizza', price: '$15.99', image: require('../assets/images/menu/pizza2.png') },
];

export default function App() {
  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Menu</Text>
      </View>

      {/* Crust Selection */}
      <View>
        <Text style={styles.sectionTitle}>Create your own Pizza</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.crustScroll}>
          {crustOptions.map((item, index) => (
            <View style={styles.crustItem} key={index}>
              <Image source={item.image} style={styles.crustImage} />
              <Text style={styles.crustLabel}>{item.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Pizza List */}
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>Pizzas</Text>
        <FlatList
          data={pizzas}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.pizzaItem}>
              <Image source={item.image} style={styles.pizzaImage} />
              <View>
                <Text style={styles.pizzaName}>{item.name}</Text>
                <Text style={styles.pizzaPrice}>{item.price}</Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Ionicons name="home-outline" size={24} color="black" />
        <MaterialIcons name="local-pizza" size={24} color="black" />
        <Ionicons name="cart-outline" size={24} color="black" />
        <Ionicons name="person-outline" size={24} color="black" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  crustScroll: {
    marginBottom: 20,
  },
  crustItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  crustImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  crustLabel: {
    marginTop: 5,
    fontSize: 12,
  },
  pizzaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  pizzaImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  pizzaName: {
    fontSize: 16,
    fontWeight: '600',
  },
  pizzaPrice: {
    fontSize: 14,
    color: '#555',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff7e6',
  },
});