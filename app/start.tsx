import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, ImageBackground, Image, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Start() {
  const router = useRouter();

  const go = async (type: 'delivery' | 'pickup') => {
    try {
      await AsyncStorage.setItem('@order_mode', type);
      router.push(type === 'delivery' ? '/delivery_address' : '/pickup_location');
    } catch (e) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/pizza_bg1.jpg')}
      style={styles.bg}
      imageStyle={{ opacity: 0.35 }} // ✅ Improved visibility
    >
      {/* ✅ Dark overlay for better contrast */}
      <View style={styles.overlay} />

      <View style={styles.content}>
        {/* Top Logo Section */}
        <View style={styles.top}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.tag}>Fuel Your Cravings 🍕</Text>
        </View>

        {/* Middle CTA Section */}
        <View style={styles.center}>
          <Text style={styles.title}>Your Pizza Journey Starts Now!</Text>

          <TouchableOpacity
            style={[styles.choice, styles.delivery]}
            onPress={() => go('delivery')}
          >
            <Text style={styles.choiceText}>Delivery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.choice, styles.pickup]}
            onPress={() => go('pickup')}
          >
            <Text style={styles.choiceText}>Pickup</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Auth Buttons */}
        <View style={styles.bottomRow}>
          <Pressable onPress={() => router.push('/auth/login')} style={styles.bottomBtn}>
            <Text style={styles.bottomBtnText}>Log In</Text>
          </Pressable>

          <Pressable onPress={() => router.push('/auth/select-role')} style={styles.bottomBtn}>
            <Text style={styles.bottomBtnText}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.10)', // ✅ Light dark overlay
  },
  content: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 40,
  },
  top: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 200,
    height: 130,
  },
  tag: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 8,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
    textAlign: 'center',
    marginBottom: 28,
  },
  choice: {
    width: '80%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.18, // ✅ Softer shadow
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
  },
  delivery: {
    backgroundColor: '#f0e249',
  },
  pickup: {
    backgroundColor: '#f8a831',
  },
  choiceText: {
    fontWeight: '900',
    fontSize: 18,
    color: '#111',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginTop: 10,
  },
  bottomBtn: {
    borderWidth: 2,
    borderColor: '#111',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  bottomBtnText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111',
  },
});
