import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import React from 'react';

export default function Delivery() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [apt, setApt] = useState('');
  const [city, setCity] = useState('');
  const [postal, setPostal] = useState('');
  const [province, setProvince] = useState('');
  const [country, setCountry] = useState('');

  const screenWidth = Dimensions.get('window').width;
  const scooterAnim = useRef(new Animated.Value(-screenWidth / 2)).current;

  useEffect(() => {
    Animated.timing(scooterAnim, {
      toValue: screenWidth,
      duration: 2500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSave = () => {
    console.log({ address, apt, city, postal, province, country });
    router.replace('/(drawer)/(tabs)/home');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(drawer)/(tabs)/home')}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} />

        <Text style={styles.label}>Apt/Suite/Floor</Text>
        <TextInput style={styles.input} value={apt} onChangeText={setApt} />

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>City</Text>
            <TextInput style={styles.input} value={city} onChangeText={setCity} />
          </View>
          <View style={[styles.half, { marginRight: 0, marginLeft: 10 }]}>
            <Text style={styles.label}>Postal Code</Text>
            <TextInput style={styles.input} value={postal} onChangeText={setPostal} />
          </View>
        </View>

        <Text style={styles.label}>Province</Text>
        <TextInput style={styles.input} value={province} onChangeText={setProvince} />

        <Text style={styles.label}>Country</Text>
        <TextInput style={styles.input} value={country} onChangeText={setCountry} />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>SAVE</Text>
        </TouchableOpacity>

        {/* Animated Scooter */}
        <Animated.View style={{ transform: [{ translateX: scooterAnim }] }}>
          <Image
            source={require('../assets/images/pickup-scooter.png')}
            style={styles.scooter}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 15,
  },
  backArrow: { fontSize: 35, marginRight: 15, textAlignVertical: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600' },

  form: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginTop: 12,
    marginBottom: 1,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 6,
    fontSize: 16,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  half: {
    flex: 1,
    marginRight: 10,
  },
  saveBtn: {
    backgroundColor: '#FFC107',
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 8,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  scooter: {
    width: '100%',
    height: 250,
    marginTop: 50,
    alignSelf: 'center',
  },
});
