// app/auth/login.tsx — Clean merged version ✅
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../lib/firebase';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Enter email and password.');
      return;
    }

    setBusy(true);
    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );

      if (!cred.user.emailVerified) {
        await sendEmailVerification(cred.user);
        await signOut(auth);
        Alert.alert(
          'Email not verified',
          'Verification link sent again. Please verify before logging in.'
        );
        return;
      }

      const cache = await AsyncStorage.getItem(`@user_${cred.user.uid}`);
      if (cache) {
        const userData = JSON.parse(cache);
        await AsyncStorage.setItem('@user_first_name', userData.firstName || '');
        if (userData.lastName)
          await AsyncStorage.setItem('@user_last_name', userData.lastName);
        Alert.alert('Welcome back!', `Hi ${userData.firstName}! 🍕`);
      } else if (cred.user.displayName) {
        await AsyncStorage.setItem('@user_first_name', cred.user.displayName);
      } else {
        const first = email.split('@')[0];
        await AsyncStorage.setItem('@user_first_name', first);
        Alert.alert('Welcome!', `Hi ${first}!`);
      }

      await AsyncStorage.multiRemove([
        '@guest_mode',
        '@order_mode',
      ]);

      router.replace('/start');
    } catch (e: any) {
      let msg = 'Unable to sign in';
      if (e.code === 'auth/user-not-found')
        msg = 'No account found with this email. Please sign up first.';
      else if (e.code === 'auth/wrong-password')
        msg = 'Incorrect password.';
      else if (e.code === 'auth/invalid-email')
        msg = 'Please enter a valid email.';
      else if (e.code === 'auth/user-disabled')
        msg = 'This account has been disabled.';
      else if (e.code === 'auth/too-many-requests')
        msg = 'Too many attempts. Try again later.';
      else if (e.code === 'auth/invalid-credential')
        msg = 'Invalid email or password.';

      Alert.alert('Sign in failed', msg);
    } finally {
      setBusy(false);
    }
  };

  const handleGuest = async () => {
    try {
      await AsyncStorage.multiRemove([
        '@order_mode',
        '@user_first_name',
        '@user_last_name',
      ]);
      await AsyncStorage.setItem('@guest_mode', '1');
      router.replace('/start');
    } catch {
      Alert.alert('Error', 'Failed to continue as guest.');
    }
  };

  return (
    <View style={styles.wrap}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

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

      <TouchableOpacity
        style={[styles.btn, busy && styles.btnDisabled]}
        onPress={handleLogin}
        disabled={busy}
      >
        {busy ? <ActivityIndicator /> : <Text style={styles.btnText}>Sign In</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleGuest} style={styles.guestBtn}>
        <Text style={styles.guestText}>Continue as guest</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Don’t have an account?{' '}
      <Link href="../select-role" style={styles.link}>Sign up</Link>

      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#fff7e6',
    padding: 24,
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: { marginBottom: 15, color: '#555', textAlign: 'center' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  btn: {
    backgroundColor: '#FFC107',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontWeight: '700', fontSize: 16 },
  guestBtn: { marginTop: 16, alignItems: 'center', paddingVertical: 12 },
  guestText: { fontWeight: '700', fontSize: 16, color: '#F4B400' },
  footer: { textAlign: 'center', marginTop: 20, color: '#444' },
  link: { fontWeight: '700', color: '#111' },
});
