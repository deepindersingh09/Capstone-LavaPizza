// app/favourites/index.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FavouritesSaved() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require('../../assets/images/menu/pizza2.png')} // placeholder image
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.title}>Volcanic Pizza</Text>
          <Text style={styles.price}>$11.99</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="heart" size={22} color="#F59E0B" />
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Add more items</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    alignItems: 'center',
    marginBottom: 20,
  },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  price: { fontSize: 14, color: '#555' },
  footer: { textAlign: 'center', color: '#777' },
});
