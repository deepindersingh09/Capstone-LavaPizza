// app/auth/signup-delivery.tsx
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut, updateProfile } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../lib/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

export default function SignupDelivery() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [busy, setBusy] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    if (!firstName || !email || !password || !vehicleType) 
      return Alert.alert('Missing info', 'Enter first name, email, password, and vehicle type');
    if (password.length < 6) 
      return Alert.alert('Weak password', 'Use at least 6 characters');
    if (password !== confirm) 
      return Alert.alert('Mismatch', 'Passwords do not match');
    if (!agreed) 
      return Alert.alert('Hold up', 'Please agree to Terms & Privacy');

    setBusy(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);

      await updateProfile(cred.user, {
        displayName: firstName.trim(),
      });

      const userData = {
        uid: cred.user.uid,
        firstName: firstName.trim(),
        lastName: lastName.trim() || '',
        email: email.trim(),
        role: 'delivery',
        vehicleType: vehicleType.trim(),
        vehicleNumber: vehicleNumber.trim() || '',
        createdAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(`@user_${cred.user.uid}`, JSON.stringify(userData));
      await AsyncStorage.setItem('@user_first_name', firstName.trim());
      if (lastName) await AsyncStorage.setItem('@user_last_name', lastName.trim());

      await sendEmailVerification(cred.user);
      await signOut(auth);

      Alert.alert(
        'Verify your email',
        'We sent a verification link to your inbox. Please verify, then sign in.'
      );
      await AsyncStorage.removeItem('@order_mode');
      router.replace('/auth/login');
    } catch (e: any) {
      let errorMessage = 'Unable to create account';
      
      if (e.code === 'auth/email-already-in-use') errorMessage = 'This email is already registered. Please sign in instead.';
      else if (e.code === 'auth/invalid-email') errorMessage = 'Please enter a valid email address.';
      else if (e.code === 'auth/weak-password') errorMessage = 'Password is too weak. Please use a stronger password.';
      
      Alert.alert('Sign up failed', errorMessage);
      console.error('Signup error:', e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Image 
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Create Delivery Agent Account</Text>
      <Text style={styles.subtitle}>Get started now!</Text>

      <TextInput
        placeholder="Enter your name *"
        autoCapitalize="words"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />

  

      <TextInput
        placeholder="Email address"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      {/* Password */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={22}
            color="#555"
            style={{ marginLeft: -35 }}
          />
        </TouchableOpacity>
      </View>

  

      {/* Vehicle Type */}
      <TextInput
        placeholder="Vehicle Type *"
        value={vehicleType}
        onChangeText={setVehicleType}
        style={styles.input}
      />

     


      <TouchableOpacity style={styles.btn} onPress={handleSignup} disabled={busy}>
        <Text style={styles.btnText}>{busy ? 'Generating next' : 'Continue'}</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Already have an account? <Link href="/auth/login" style={styles.link}>Sign in</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#fff7e6', padding: 24, justifyContent: 'center' },
  logo: { width: 110, height: 110, alignSelf: 'center', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 3 },
  subtitle: { marginBottom: 18, color: '#555', textAlign: 'center' },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 8 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#aaa' },
  btn: { backgroundColor: '#FFC107', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 6 },
  btnText: { fontWeight: '700' },
  footer: { textAlign: 'center', marginTop: 16, color: '#444' },
  link: { fontWeight: '700', color: '#111' },
});
