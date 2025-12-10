// app/menu/[categoryId].tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getItemsByCategory, menuCategories } from '@/data/menuData';

// Helper function to get appropriate emoji for each item category
const getCategoryEmoji = (categoryId: string): string => {
  const emojiMap: { [key: string]: string } = {
    'pizza': '🍕',
    'gourmet-pizza': '🍕',
    'pasta': '🍝',
    'appetizers': '🥟',
    'chicken-wings': '🍗',
    'poutines': '🍟',
    'shawarma': '🌯',
    'subs': '🥪',
    'burgers': '🍔',
    'salads': '🥗',
    'sides': '🍟',
    'desserts': '🍰',
    'drinks': '🥤',
    'deals': '⭐',
  };
  return emojiMap[categoryId] || '🍽️';
};

export default function CategoryItems() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams();
  
  const category = menuCategories.find(c => c.id === categoryId);
  const items = getItemsByCategory(categoryId as string);

  if (!category) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Category not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const categoryEmoji = getCategoryEmoji(categoryId as string);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.categoryEmoji}>{categoryEmoji}</Text>
          <Text style={styles.title}>{category.name}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.itemsContainer}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemCard}
              onPress={() => router.push(`/menu/item/${item.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.itemInfo}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>⭐ Popular</Text>
                    </View>
                  )}
                </View>
                
                {item.description && (
                  <Text style={styles.itemDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                )}
                
                <View style={styles.priceRow}>
                  {item.sizes ? (
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceLabel}>From </Text>
                      <Text style={styles.itemPrice}>${item.sizes[0].price.toFixed(2)}</Text>
                    </View>
                  ) : (
                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  )}
                  
                  <View style={styles.addButton}>
                    <Ionicons name="add-circle" size={28} color="#E53935" />
                  </View>
                </View>
              </View>

              <View style={styles.itemImageContainer}>
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderEmoji}>{categoryEmoji}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {items.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyText}>No items in this category yet</Text>
            <Text style={styles.emptySubtext}>Check back soon for new additions!</Text>
          </View>
        )}

        {/* Bottom spacing for scroll */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  backLink: {
    fontSize: 16,
    color: '#E53935',
    textDecorationLine: 'underline',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  itemsContainer: {
    padding: 16,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  itemInfo: {
    flex: 1,
    paddingRight: 12,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 22,
  },
  popularBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
  },
  itemDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceLabel: {
    fontSize: 12,
    color: '#999',
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E53935',
  },
  addButton: {
    padding: 4,
  },
  itemImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
  },
  placeholderEmoji: {
    fontSize: 50,
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});