import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';


export default function Start() {
  const router = useRouter();

  const go = (type: 'delivery' | 'pickup') => {
  switch (type) {
    case 'delivery':
      router.push('/delivery_address');
      break;
    case 'pickup':
      router.push('/pickup_location');  
      break;
  }
};

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/auth/login');
  };

  return (
    <ImageBackground
      source={require('../assets/images/pizza_bg1.png')}
      style={styles.bg}
      imageStyle={{ opacity: 0.2 }}
    >
      
      <View style={styles.top}>
        <Text style={styles.brand}>LAVA PIZZA</Text>
        <Text style={styles.tag}>Fuel Your Cravings!</Text>
      </View>

      
      <View style={styles.center}>
        <Text style={styles.title}>Your Pizza Journey starts here!</Text>

        <TouchableOpacity
          style={[styles.choice, { backgroundColor: '#9BE27D' }]}
          onPress={() => go('delivery')}
        >
          <Text style={styles.choiceText}>Delivery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.choice, { backgroundColor: '#FF8C8C' }]}
          onPress={() => go('pickup')}
        >
          <Text style={styles.choiceText}>Pickup</Text>
        </TouchableOpacity>
      </View>

    
      <View style={styles.bottomRow}>
        <Pressable
          style={({ pressed }) => [
            styles.bottomBtn,
            { backgroundColor: 'transparent', opacity: pressed ? 0.6 : 1 }, 
          ]}
          onPress={() => router.push('/auth/login')}
        >
          <Text style={styles.bottomBtnText}>Log In</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.bottomBtn,
            { backgroundColor: 'transparent', opacity: pressed ? 0.6 : 1 },
          ]}
          onPress={() => router.push('/auth/signup')}
        >
          <Text style={styles.bottomBtnText}>Sign Up</Text>
        </Pressable>

      </View>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    resizeMode: 'cover',
    padding: 24,
  },
  top: {
    alignItems: 'center',
    marginTop: 50,
  },
  brand: {
    fontSize: 30,
    fontWeight: '900',
    color: '#E53935',
    letterSpacing: 1,
  },
  tag: {
    color: 'black',
    marginTop: 4,
    fontSize: 14,
    fontWeight: 900
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 18,
    fontWeight: '600',
    color: '#111',
  },
  choice: {
    width: 200,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  choiceText: {
    fontWeight: '800',
    fontSize: 16,
    color: '#111',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 45,
  },
    bottomBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderColor: '#aaa',
    borderWidth: 1,
    backgroundColor: 'transparent', 
  },


  bottomBtnText: {
    fontWeight: '700',
    color: '#111',
    fontSize: 16,
  },
  logout: {
    position: 'absolute',
    right: 16,
    top: 40,
  },
});