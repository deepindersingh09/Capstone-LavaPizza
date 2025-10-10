import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Dimensions, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function PickupScreen() {
  const router = useRouter();

  const locations = [
    {
      name: 'Unit 112, 20 Saddlestone Dr, Calgary',
      image: require('../assets/images/store1.png'),
    },
    {
      name: 'Lava Pizza YYC - 1211 14 St SW #4, Calgary',
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Select a Pickup Location</Text>

      {locations.map((loc, index) => (
        <View key={index} style={styles.block}>
          <Text style={styles.address}>{loc.name}</Text>

          <Image
            source={loc.image}
            style={styles.image}
            resizeMode="cover"
          />

          <Pressable
            style={styles.pickupButton}
            onPress={() => handlePickup(loc.name)}
          >
            <Text style={styles.buttonText}>Pickup from this store</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  block: {
    marginBottom: 40,
    alignItems: 'center',
  },
  address: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  image: {
    width: Dimensions.get('window').width * 0.9,
    height: 220,
    borderRadius: 10,
    marginBottom: 15,
  },
  pickupButton: {
    backgroundColor: '#FFCC00',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#000',
  },
});
