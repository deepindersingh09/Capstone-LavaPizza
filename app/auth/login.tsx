// app/auth/login.tsx - WITH DEBUG LOGGING
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { signInWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../lib/firebase';
import { getUserFromFirestore } from '../../lib/firestore-helper';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Enter email and password');
      return;
    }
    setBusy(true);
    try {
      console.log('🔐 Attempting login for:', email);
      
      // Sign in with Firebase Auth
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      console.log('✅ Firebase Auth successful, User ID:', cred.user.uid);

      // Check if email is verified
      if (!cred.user.emailVerified) {
        console.log('⚠️ Email not verified');
        await sendEmailVerification(cred.user);
        await signOut(auth);
        Alert.alert(
          'Email not verified',
          'We re-sent the verification link. Please verify your email, then log in.'
        );
        return;
      }

      console.log('📧 Email verified, fetching user data from Firestore...');

      // ✅ Fetch user data from Firestore
      const userData = await getUserFromFirestore(cred.user.uid);
      console.log('📦 Firestore data:', userData);

      if (userData && userData.firstName) {
        // Store user's first name locally
        await AsyncStorage.setItem('@user_first_name', userData.firstName);
        console.log('✅ Saved first name to AsyncStorage:', userData.firstName);
        
        if (userData.lastName) {
          await AsyncStorage.setItem('@user_last_name', userData.lastName);
          console.log('✅ Saved last name to AsyncStorage:', userData.lastName);
        }

        // Clear guest mode
        await AsyncStorage.removeItem('@guest_mode');
        console.log('✅ Cleared guest mode');

        Alert.alert('Welcome back!', `Hi ${userData.firstName}! 🍕`);
      } else {
        console.log('⚠️ No Firestore data found, checking Auth profile...');
        
        // Fallback: try to get name from Firebase Auth profile
        if (cred.user.displayName) {
          await AsyncStorage.setItem('@user_first_name', cred.user.displayName);
          await AsyncStorage.removeItem('@guest_mode');
          console.log('✅ Saved name from Auth profile:', cred.user.displayName);
          Alert.alert('Welcome back!', `Hi ${cred.user.displayName}! 🍕`);
        } else {
          console.log('❌ No name found anywhere!');
          Alert.alert('Notice', 'Please update your profile with your name.');
        }
      }

      // Clear any existing order mode
      await AsyncStorage.removeItem('@order_mode');
      
      // Verify what's in storage
      const storedName = await AsyncStorage.getItem('@user_first_name');
      const guestMode = await AsyncStorage.getItem('@guest_mode');
      console.log('🔍 Final check - Stored name:', storedName);
      console.log('🔍 Final check - Guest mode:', guestMode);
      
      // Navigate to start page
      console.log('🚀 Navigating to /start');
      router.replace('/start');
    } catch (e: any) {
      console.error('❌ Login error:', e);
      let errorMessage = 'Unable to sign in';
      
      // Handle common Firebase errors
      if (e.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.';
      } else if (e.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (e.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (e.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Contact support.';
      } else if (e.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      
      Alert.alert('Sign in failed', errorMessage);
    } finally {
      setBusy(false);
    }
  };

  const handleGuest = async () => {
    console.log('👤 Continuing as guest');
    await AsyncStorage.removeItem('@order_mode');
    await AsyncStorage.setItem('@guest_mode', '1');
    // Clear user name for guest mode
    await AsyncStorage.removeItem('@user_first_name');
    await AsyncStorage.removeItem('@user_last_name');
    console.log('✅ Guest mode set');
    router.replace('/start');
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Welcome back,</Text>
      <Text style={styles.subtitle}>Glad to see you!</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity 
        style={[styles.btn, busy && styles.btnDisabled]} 
        onPress={handleLogin} 
        disabled={busy}
      >
        {busy ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.btnText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleGuest} style={styles.guestBtn}>
        <Text style={styles.guestText}>Continue as guest</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Don't have an account? <Link href="/auth/signup" style={styles.link}>Sign up</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#fff7e6', padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 3 },
  subtitle: { marginBottom: 18, color: '#555', textAlign: 'center' },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  btn: { backgroundColor: '#FFC107', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 6 },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontWeight: '700' },
  guestBtn: { marginTop: 12, alignItems: 'center' },
  guestText: { fontWeight: '700', fontSize: 16, color: '#F4B400' },
  footer: { textAlign: 'center', marginTop: 16, color: '#444' },
  link: { fontWeight: '700', color: '#111' },
});