// app/auth/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { signInWithEmailAndPassword, sendEmailVerification, signOut, signInAnonymously } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../lib/firebase';
import { continueAsGuestLocal } from '@/lib/auth-helper';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  // ----- Email / Password sign-in -----
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Enter email and password');
      return;
    }
    setBusy(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);

      // Require verified email; resend and sign out if not verified
      if (!cred.user.emailVerified) {
        await sendEmailVerification(cred.user);
        await signOut(auth);
        Alert.alert(
          'Email not verified',
          'We re-sent the verification link. Please verify your email, then log in.'
        );
        return;
      }

      // Success → go to app (or let RootLayout gate route you)
      await AsyncStorage.removeItem('@order_mode');
      router.replace('/start');
    } catch (e: any) {
      Alert.alert('Sign in failed', e?.message ?? 'Unable to sign in');
    } finally {
      setBusy(false);
    }
  };

  // ----- Guest path (anonymous if enabled; else local flag) -----
  const handleGuest = async () => {
  await AsyncStorage.removeItem('@order_mode'); // ✅
  await AsyncStorage.setItem('@guest_mode', '1');
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

      <TouchableOpacity style={[styles.btn, busy && styles.btnDisabled]} onPress={handleLogin} disabled={busy}>
        {busy ? <ActivityIndicator /> : <Text style={styles.btnText}>Sign In</Text>}
      </TouchableOpacity>

      {/* Continue as Guest */}
      <TouchableOpacity onPress={handleGuest} style={styles.guestBtn}>
  <Text style={styles.guestText}>Continue as guest</Text>
</TouchableOpacity>

      <Text style={styles.footer}>
        Don’t have an account? <Link href="/auth/signup" style={styles.link}>Sign up</Link>
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
