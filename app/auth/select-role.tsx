import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function SelectRole() {
  const router = useRouter();

  const handleSelectRole = (role: string) => {
    if (role === "customer") {
      router.push("/auth/signup-customer");
    } else if (role === "delivery") {
      router.push("/auth/signup-delivery");
    } else if (role === "admin") {
      router.push("/auth/signup-admin");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Who Are You?</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSelectRole("customer")}
      >
        <Text style={styles.buttonText}>Customer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSelectRole("delivery")}
      >
        <Text style={styles.buttonText}>Delivery Agent</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSelectRole("admin")}
      >
        <Text style={styles.buttonText}>Restaurant Admin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff7e6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 160,
    height: 120,
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#dd2c00', // Lava Pizza theme 🔥
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  }
});
