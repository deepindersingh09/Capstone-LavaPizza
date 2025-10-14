// app/menu/categories.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { menuCategories } from '@/data/menuData';

export default function MenuCategories() {
  const router = useRouter();

  // Category emoji mapping
  const categoryEmojis: { [key: string]: string } = {
    'pasta': '🍝',
    'gourmet-pizza': '🍕',
    'pizza': '🍕',
    'double-pizza-deals': '🍕🍕',
    'appetizers': '🥟',
    'drinks-dips': '🥤',
    'chicken-wings': '🍗',
    'poutines': '🍟',
    'pizza-subs': '🥪',
    'shawarma-wraps': '🌯',
    'sides': '🍟',
    'walk-in-specials': '⭐',
    'meals': '🍽️',
    'salads': '🥗',
    'cakes': '🍰',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore the menu</Text>
      </View>

      <View style={styles.grid}>
        {menuCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => router.push(`/menu/${category.id}`)}
          >
            <View style={styles.imageContainer}>
              <Text style={styles.categoryEmoji}>
                {categoryEmojis[category.id] || category.icon || '🍽️'}
              </Text>
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  categoryCard: {
    width: '31%',
    margin: '1.16%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    paddingBottom: 12,
  },
  imageContainer: {
    width: '100%',
    height: 80,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 40,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});