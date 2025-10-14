// app/debug-storage.tsx
// TEMPORARY DEBUG PAGE - Remove after testing
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/lib/firebase';
import { getUserFromFirestore } from '@/lib/firestore-helper';
import { useRouter } from 'expo-router';

export default function DebugStorage() {
  const router = useRouter();
  const [storageData, setStorageData] = useState<any>({});
  const [firestoreData, setFirestoreData] = useState<any>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      // Check AsyncStorage
      const firstName = await AsyncStorage.getItem('@user_first_name');
      const lastName = await AsyncStorage.getItem('@user_last_name');
      const guestMode = await AsyncStorage.getItem('@guest_mode');
      const orderMode = await AsyncStorage.getItem('@order_mode');

      setStorageData({
        firstName,
        lastName,
        guestMode,
        orderMode,
        authEmail: auth.currentUser?.email || 'Not logged in',
        authDisplayName: auth.currentUser?.displayName || 'Not set',
        authUID: auth.currentUser?.uid || 'Not logged in',
      });

      // Check Firestore if user is logged in
      if (auth.currentUser) {
        const userData = await getUserFromFirestore(auth.currentUser.uid);
        setFirestoreData(userData);
      }
    } catch (e) {
      console.error('Debug error:', e);
    }
  };

  const clearStorage = async () => {
    await AsyncStorage.removeItem('@user_first_name');
    await AsyncStorage.removeItem('@user_last_name');
    await AsyncStorage.removeItem('@guest_mode');
    await AsyncStorage.removeItem('@order_mode');
    loadAllData();
    alert('Storage cleared! Now try logging in again.');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔍 Debug Storage</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AsyncStorage Data:</Text>
        <Text style={styles.data}>First Name: {storageData.firstName || '❌ Not set'}</Text>
        <Text style={styles.data}>Last Name: {storageData.lastName || '❌ Not set'}</Text>
        <Text style={styles.data}>Guest Mode: {storageData.guestMode || '❌ Not set'}</Text>
        <Text style={styles.data}>Order Mode: {storageData.orderMode || '❌ Not set'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Firebase Auth:</Text>
        <Text style={styles.data}>Email: {storageData.authEmail}</Text>
        <Text style={styles.data}>Display Name: {storageData.authDisplayName}</Text>
        <Text style={styles.data}>UID: {storageData.authUID}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Firestore Data:</Text>
        {firestoreData ? (
          <>
            <Text style={styles.data}>First Name: {firestoreData.firstName || '❌ Not set'}</Text>
            <Text style={styles.data}>Last Name: {firestoreData.lastName || '❌ Not set'}</Text>
            <Text style={styles.data}>Email: {firestoreData.email || '❌ Not set'}</Text>
          </>
        ) : (
          <Text style={styles.data}>❌ No Firestore data found</Text>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={loadAllData}>
        <Text style={styles.buttonText}>🔄 Refresh Data</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={clearStorage}>
        <Text style={styles.buttonText}>🗑️ Clear Storage</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>← Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#E53935',
  },
  data: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#FFC107',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});