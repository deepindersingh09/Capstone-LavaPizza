import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';


export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) return Alert.alert('Missing info', 'Enter email and password');
    if (password.length < 6) return Alert.alert('Weak password', 'Use at least 6 characters');
    if (password !== confirm) return Alert.alert('Mismatch', 'Passwords do not match');
    if (!agreed) return Alert.alert('Hold up', 'Please agree to Terms & Privacy');

    setBusy(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);

    
      await sendEmailVerification(cred.user);
      await signOut(auth);

      Alert.alert(
        'Verify your email',
        'We sent a verification link to your inbox. Please verify, then sign in.'
      );
      await AsyncStorage.removeItem('@order_mode');
      router.replace('/start');
    } catch (e: any) {
      Alert.alert('Sign up failed', e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Get started now!</Text>

      <TextInput
        placeholder="Email address"
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
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        style={styles.input}
      />

      <TouchableOpacity onPress={() => setAgreed(!agreed)} style={styles.checkboxRow}>
        <View style={[styles.checkbox, agreed && { backgroundColor: '#222' }]} />
        <Text style={{ marginLeft: 8 }}>I agree to Terms & Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={handleSignup} disabled={busy}>
        <Text style={styles.btnText}>{busy ? 'Signing up…' : 'Sign Up'}</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Already have an account? <Link href="/auth/login" style={styles.link}>Sign in</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#fff7e6', padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 3},
  subtitle: { marginBottom: 18, color: '#555', textAlign: 'center'},
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 8 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#aaa' },  
  btn: { backgroundColor: '#FFC107', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 6 },
  btnText: { fontWeight: '700' },
  footer: { textAlign: 'center', marginTop: 16, color: '#444' },
  link: { fontWeight: '700', color: '#111' },
});
