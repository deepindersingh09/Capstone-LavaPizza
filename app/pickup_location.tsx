import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Alert, 
  Dimensions, 
  ScrollView, 
  Image, 
  StatusBar,
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 

const { width } = Dimensions.get('window');

// Get platform-specific status bar height to ensure the title is visible
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24;


// --- Component ---
export default function PickupScreen() {
  const router = useRouter();

  const locations = [
    {
      name: 'Unit 112, 20 Saddlestone Dr, Calgary',
      shortName: 'Saddlestone Dr Store',
      // Ensure these assets exist in your project structure:
      image: require('../assets/images/store1.png'), 
    },
    {
      name: 'Lava Pizza YYC - 1211 14 St SW #4, Calgary',
      shortName: '14 St SW #4 Store',
      // Ensure these assets exist in your project structure:
      image: require('../assets/images/store2.png'), 
    },
  ];

  const handlePickup = (locationName: string) => {
    Alert.alert('Pickup Selected', `You chose: ${locationName}`, [
      {
        text: 'OK',
        onPress: () => router.replace('/(drawer)/(tabs)/home'),
      },
    ]);
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      // Added a small amount of padding bottom just for scroll comfort
      style={{flex: 1, backgroundColor: '#f5f5f5'}} 
    >
      {/* Status bar setup */}
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Title is the first element inside the scroll view */}
      <Text style={styles.title}>Select a Pickup Location</Text>

      {locations.map((loc, index) => (
        <View key={index} style={styles.locationBlock}>
          
          <View style={styles.mapContainer}>
            <Image
              source={loc.image}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.mapOverlay}>
              <Ionicons name="location-sharp" size={30} color="#ff6f00" />
            </View>
          </View>
          
          <View style={styles.detailsContainer}>
            <Text style={styles.addressName}>{loc.shortName}</Text>
            <Text style={styles.addressFull}>{loc.name}</Text>

            <Pressable
              style={styles.pickupButton}
              onPress={() => handlePickup(loc.name)}
              android_ripple={{ color: '#e06000' }}
            >
              <Text style={styles.buttonText}>Select This Store</Text>
              <Ionicons name="arrow-forward-sharp" size={16} color="#fff" style={{marginLeft: 8}}/>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    // 🚀 CRITICAL FIX: Add paddingTop to push content below the status bar/notch.
    paddingTop: STATUS_BAR_HEIGHT + 20, 
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: '#f5f5f5', 
  },
  title: {
    fontSize: 26,
    fontWeight: '800', 
    color: '#222',
    marginBottom: 30,
    paddingHorizontal: 20,
    width: '100%',
    textAlign: 'center',
  },
  locationBlock: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 25,
    overflow: 'hidden', 
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  mapContainer: {
    width: '100%',
    height: 180, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 50,
  },
  detailsContainer: {
    padding: 20,
    alignItems: 'flex-start',
    width: '100%',
  },
  addressName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ff6f00', 
    marginBottom: 4,
  },
  addressFull: {
    fontSize: 14,
    fontWeight: '400',
    color: '#555',
    marginBottom: 15,
    lineHeight: 20,
  },
  pickupButton: {
    backgroundColor: '#ff6f00', 
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontWeight: '700',
    color: '#fff',
    fontSize: 16,
  },
});