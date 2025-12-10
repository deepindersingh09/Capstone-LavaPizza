// app/menu/categories.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { menuCategories } from '@/data/menuData';

// Color constants to match your design
const COLORS = {
  primary: '#E53935',      // Red (Lava Pizza theme)
  primaryLight: '#FFE5E5', // Light red background
  text: '#333',
  textLight: '#666',
  background: '#fff',
  cardShadow: 'rgba(0, 0, 0, 0.1)',
};

export default function MenuCategories() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore the Menu</Text>
        <Text style={styles.subtitle}>Choose a category to start ordering</Text>
      </View>

      <View style={styles.grid}>
        {menuCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => router.push(`/menu/${category.id}`)}
            activeOpacity={0.7}
          >
            <View style={styles.imageContainer}>
              <Text style={styles.categoryEmoji}>
                {category.icon}
              </Text>
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom spacing */}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textLight,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  categoryCard: {
    width: '31%',
    margin: '1.16%',
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.primaryLight,
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
    color: COLORS.text,
    textAlign: 'center',
    paddingHorizontal: 4,
    lineHeight: 16,
  },
});