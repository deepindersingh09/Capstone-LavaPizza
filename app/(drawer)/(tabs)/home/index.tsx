// app/(drawer)/(tabs)/home/index.tsx
import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/lib/firebase';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';

// --- LOGO IMPORT ---
const APP_LOGO = require('../../../../assets/images/logo.png'); 

// --- TYPE DEFINITIONS (unchanged) ---
type QuickServiceItem = {
    id: string; title: string; icon: string; routeId: string; color: string;
}
type RecommendedItem = {
    id: string; title: string; price: number; rating: number; img: any;
}
type PopularDealItem = {
    id: string; title: string; routeId: string; img: any;
}

// --- DUMMY DATA ---
const quickServices: QuickServiceItem[] = [
  // Keeping the colors that produce the soft tones you had:
  { id: 'qs1', title: 'Pizza', icon: 'pizza-slice', routeId: 'pizza', color: '#ff6f00' }, // Orange for contrast
  { id: 'qs2', title: 'Wings', icon: 'food-drumstick-outline', routeId: 'chicken-wings', color: '#ffb300' }, 
  { id: 'qs3', title: 'Beverages', icon: 'cup-water', routeId: 'drinks-dips', color: '#ff8a65' }, 
  { id: 'qs4', title: 'Desserts', icon: 'cupcake', routeId: 'cakes', color: '#f8bbd0' },
  { id: 'qs5', title: 'Pasta', icon: 'pasta', routeId: 'pasta', color: '#f9a825' },
];

const featuredDeal = {
  title: 'Buy 1 Get 1 Free on Medium Pizza!',
  routeId: 'double-pizza-deals',
  img: require('../../../../assets/images/menu/menu_pizza.png'),
};

const recommendedItems: RecommendedItem[] = [
  { id: 'rec1', title: 'Pepperoni Burst Pizza', price: 14.99, rating: 4.8, img: require('../../../../assets/images/menu/menu_pizza.png') },
  { id: 'rec2', title: 'Spicy Shawarma Sub', price: 12.49, rating: 4.5, img: require('../../../../assets/images/menu/pizza_subs.png') },
  { id: 'rec3', title: 'Aussie Gourmet Pizza', price: 17.99, rating: 4.9, img: require('../../../../assets/images/menu/pizza2.png') },
];

const popularDeals: PopularDealItem[] = [
  { id: 'pd1', title: '50 OFF', routeId: 'pizza', img: require('../../../../assets/images/menu/pizza3.jpg') },
  { id: 'pd2', title: '30 OFF', routeId: 'walk-in-specials', img: require('../../../../assets/images/menu/double_pizza.png') },
  { id: 'pd3', title: 'FREE DESSERT', routeId: 'cakes', img: require('../../../../assets/images/menu/appetizers.png') },
];

// --- UTILITY ---
const imgSrc = (img: any) => (typeof img === 'string' ? { uri: img } : img);
const { width } = Dimensions.get('window');
const CONTENT_PADDING = 20;

// --- MAIN COMPONENT ---
export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('There');

  // ... (User Name Logic - loadUserName, useEffect, useFocusEffect - unchanged)
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
        firstName = auth.currentUser.displayName.split(' ')[0];
        await AsyncStorage.setItem('@user_first_name', firstName);
      }

      if (firstName) {
        setUserName(firstName);
      } else {
        setUserName('There');
      }
    } catch (e) {
      console.warn('Failed to load user name', e);
      setUserName('There');
    }
  };


  // --- Navigation Handlers ---
  const handleNavigation = (routeId: string) => {
    router.push(`/menu/${routeId}`);
  };

  // --- COMPONENTS ---
  const QuickServiceCard = ({ item }: { item: QuickServiceItem }) => (
    <TouchableOpacity 
      style={styles.quickCard}
      activeOpacity={0.8}
      onPress={() => handleNavigation(item.routeId)}
    >
      {/* 🚀 FIXED: Use quickIconContainer (the original soft background style) */}
      <View style={[styles.quickIconContainer, { backgroundColor: item.color + '30' }]}>
        {/* @ts-ignore */}
        <MaterialCommunityIcons name={item.icon} size={24} color={item.color} /> 
      </View>
      <Text style={styles.quickTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const RecommendedCard = ({ item }: { item: RecommendedItem }) => (
    <View style={styles.recommendedCard}>
      <Image source={imgSrc(item.img)} style={styles.recommendedImage} />
      <View style={styles.recommendedDetails}>
        <Text style={styles.recommendedTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#f9a825" />
          <Text style={styles.recommendedRating}>{item.rating}</Text>
        </View>
        <Text style={styles.recommendedPrice}>CA${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Feather name="plus" size={16} color="#222" />
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  const PopularDealCard = ({ item }: { item: PopularDealItem }) => (
    <TouchableOpacity
      style={styles.popularDealCard}
      activeOpacity={0.8}
      onPress={() => handleNavigation(item.routeId)}
    >
      <Image source={imgSrc(item.img)} style={styles.popularDealImage} />
      <View style={styles.dealOverlay}>
        <Text style={styles.dealBadge}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  // --- RENDER ---
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      
      {/* 🚀 FIXED: Header Bar with single burger, centered logo, and single bell icon */}
      <View style={styles.header}>
        
        {/* Burger Icon (Menu) - Left Side */}
        <TouchableOpacity style={styles.iconButton}>
            <Feather name="menu" size={24} color="#222" />
        </TouchableOpacity>
        
        {/* Logo - Centered */}
        <Image 
          source={APP_LOGO} 
          style={styles.imageLogo}
          resizeMode="contain"
        />
        
        {/* Bell Icon (Notification) - Right Side */}
        <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#222" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Search Input (Placeholder View) */}
        <View style={styles.searchBar}>
            <Feather name="search" size={18} color="#777" style={{ marginLeft: 10 }} />
            <Text style={styles.searchTextPlaceholder}>Search for pizzas, commbos, drinks...</Text>
        </View>

        {/* Greeting Section */}
        <Text style={styles.greeting}>Hi {userName} 👋</Text>
        <Text style={styles.greetingSub}>Ready for great taste today?</Text>

        {/* Quick Services Section */}
        <Text style={styles.sectionHeader}>Quick Services</Text>
        <FlatList
          horizontal
          data={quickServices}
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickFlatlist}
          renderItem={({ item }) => <QuickServiceCard item={item} />}
        />

        {/* Featured Deal Banner */}
        <Text style={styles.sectionHeader}>Featured</Text>
        <TouchableOpacity
          style={styles.featuredBanner}
          activeOpacity={0.9}
          onPress={() => handleNavigation(featuredDeal.routeId)}
        >
          <Image 
            source={imgSrc(featuredDeal.img)} 
            style={styles.featuredImage}
            resizeMode="cover"
          />
          <View style={styles.featuredOverlay} />
          <View style={styles.featuredTextContainer}>
            <Text style={styles.featuredTitle}>
              <Ionicons name="flame" size={24} color="#f9a825" /> 
              {' '}Buy 1 Get 1 Free on Medium Pizza!
            </Text>
            <TouchableOpacity style={styles.featuredButton}>
              <Text style={styles.featuredButtonText}>Order Now</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>


        {/* Recommended For You Section */}
        <Text style={styles.sectionHeader}>Recommended For You</Text>
        <FlatList
          horizontal
          data={recommendedItems}
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatlistContainer}
          renderItem={({ item }) => <RecommendedCard item={item} />}
        />

        {/* Popular Deals Section */}
        <Text style={styles.sectionHeader}>Popular Deals</Text>
        <FlatList
          horizontal
          data={popularDeals}
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatlistContainer}
          renderItem={({ item }) => <PopularDealCard item={item} />}
        />
        
      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLES ---

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: 80,
  },

  // --- Header Styles ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: CONTENT_PADDING,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: '#fff',
  },
  // 🚀 FIXED: Increased Logo size substantially for prominence in the header
  imageLogo: {
    width: 100, // Adjusted width for header space
    height: 100, // Increased height to make it large and prominent
    marginHorizontal: 10,
  },
  iconButton: {
    width: 30, 
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  
  // --- Search Bar Styles (unchanged) ---
  searchBar: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginHorizontal: CONTENT_PADDING,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchTextPlaceholder: {
    color: '#777',
    marginLeft: 10,
    fontSize: 15,
  },

  // --- General Sections (unchanged) ---
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 10,
    marginBottom: 4,
    paddingHorizontal: CONTENT_PADDING,
  },
  greetingSub: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
    paddingHorizontal: CONTENT_PADDING,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: CONTENT_PADDING,
  },
  flatlistContainer: {
    gap: 15,
    paddingBottom: 10,
    paddingHorizontal: CONTENT_PADDING,
  },
  
  // --- Quick Services Styles ---
  quickFlatlist: {
    gap: 15,
    paddingBottom: 10,
    paddingHorizontal: CONTENT_PADDING,
  },
  quickCard: {
    width: (width - CONTENT_PADDING * 2 - 45) / 4,
    alignItems: 'center',
  },
  // 🚀 FIXED: Reverting to original soft-colored container style
  quickIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    // The soft color comes from { backgroundColor: item.color + '30' } passed in the component
  },
  // ❌ REMOVED: quickIconContainerWhite style
  quickTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#444',
    textAlign: 'center',
  },

  // --- Featured Banner Styles (unchanged) ---
  featuredBanner: {
    width: width - CONTENT_PADDING * 2,
    alignSelf: 'center',
    height: 180,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#ff6f00',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.8,
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  featuredTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 20,
    justifyContent: 'space-around',
    height: '100%',
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 28,
  },
  featuredButton: {
    backgroundColor: '#f9a825',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 25,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  featuredButtonText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // --- Recommended Card Styles (unchanged) ---
  recommendedCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    width: width * 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  recommendedImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  recommendedDetails: {
    flex: 1,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  recommendedRating: {
    fontSize: 14,
    color: '#222',
    marginLeft: 4,
  },
  recommendedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6f00',
  },
  addButton: {
    backgroundColor: '#f9a825',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  addButtonText: {
    color: '#222',
    fontWeight: '600',
    marginLeft: 4,
  },

  // --- Popular Deals Styles (unchanged) ---
  popularDealCard: {
    width: width * 0.4,
    height: 120,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  popularDealImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dealOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    padding: 8,
  },
  dealBadge: {
    backgroundColor: '#ff6f00',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
});