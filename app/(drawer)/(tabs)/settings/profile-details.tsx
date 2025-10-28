// app/(drawer)/(tabs)/settings/profile-details.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const K = {
  firstName: '@user_first_name',
  lastName: '@user_last_name',
  email: '@user_email',
  phone: '@user_phone',
};

export default function ProfileDetails() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [phone,     setPhone]     = useState('');
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [fn, ln, em, ph] = await Promise.all([
          AsyncStorage.getItem(K.firstName),
          AsyncStorage.getItem(K.lastName),
          AsyncStorage.getItem(K.email),
          AsyncStorage.getItem(K.phone),
        ]);
        if (fn) setFirstName(fn);
        if (ln) setLastName(ln);
        if (em) setEmail(em);
        if (ph) setPhone(ph);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    // quick validation
    if (!firstName.trim()) return Alert.alert('Oops', 'Please enter your first name.');
    if (!email.trim() || !email.includes('@')) {
      return Alert.alert('Oops', 'Please enter a valid email.');
    }
    setSaving(true);
    try {
      await Promise.all([
        AsyncStorage.setItem(K.firstName, firstName.trim()),
        AsyncStorage.setItem(K.lastName,  lastName.trim()),
        AsyncStorage.setItem(K.email,     email.trim()),
        AsyncStorage.setItem(K.phone,     phone.trim()),
      ]);
      Alert.alert('Saved', 'Your profile has been updated.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile & Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8, color: '#666' }}>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['left','right','bottom']}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile & Details</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Form */}
      <View style={styles.body}>
        <Text style={styles.label}>First Name *</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="John"
          placeholderTextColor="#999"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Doe"
          placeholderTextColor="#999"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="john@pizza.com"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="(123) 456-7890"
          keyboardType="phone-pad"
          placeholderTextColor="#999"
          maxLength={15}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.6 }]}
          onPress={save}
          disabled={saving}
          activeOpacity={0.9}
        >
          {saving ? (
            <ActivityIndicator color="#111" />
          ) : (
            <>
              <Ionicons name="save-outline" size={18} color="#111" style={{ marginRight: 8 }} />
              <Text style={styles.saveText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fbf3e6',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },

  body: {
    padding: 16,
    gap: 10,
  },
  label: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginTop: 4 },
  input: {
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
  },

  footer: {
    marginTop: 'auto',
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  saveBtn: {
    backgroundColor: '#FFF1BF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  saveText: { fontSize: 16, fontWeight: '800', color: '#111' },
});
