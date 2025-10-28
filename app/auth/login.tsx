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
  Platform
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
          'We sent the verification again. Check your inbox!'
        );
        return;
      }

      await AsyncStorage.multiRemove(['@guest_mode', '@order_mode']);
      router.replace('/start');
    } catch (e: any) {
      let msg = 'Unable to sign in';

      if (e.code === 'auth/user-not-found') msg = 'User not found. Signup first.';
      else if (e.code === 'auth/wrong-password') msg = 'Wrong password';
      else if (e.code === 'auth/invalid-email') msg = 'Invalid email format';

      Alert.alert('Sign in failed', msg);
    } finally {
      setBusy(false);
    }
  };

  const handleGuest = async () => {
    await AsyncStorage.multiRemove([
      '@order_mode',
      '@user_first_name',
      '@user_last_name',
    ]);
    await AsyncStorage.setItem('@guest_mode', '1');
    router.replace('/start');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <TextInput
        placeholder="Enter your email"
        placeholderTextColor="#555"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <View style={styles.passBox}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#555"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={22}
            color="#444"
            style={{ marginLeft: -35 }}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.btn, busy && { opacity: 0.5 }]}
        onPress={handleLogin}
        disabled={busy}
      >
        {busy ? <ActivityIndicator /> : <Text style={styles.btnText}>Sign In</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleGuest} style={styles.guestBtn}>
        <Text style={styles.guestText}>Continue as Guest</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Don’t have an account?{' '}
        <Link href="/auth/select-role" style={styles.link}>Sign Up</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffdf0',
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 100 : 70,
  },
  logo: {
    width: 160,
    height: 120,
    alignSelf: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 28,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#f8a831',
    marginBottom: 14,
    fontSize: 16,
  },
  passBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  btn: {
    backgroundColor: '#f8a831',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    elevation: 3,
  },
  btnText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111',
  },
  guestBtn: { marginTop: 18, alignItems: 'center' },
  guestText: { fontSize: 16, fontWeight: '700', color: '#666' },
  footer: {
    textAlign: 'center',
    marginTop: 22,
    fontSize: 15,
    color: '#444',
  },
  link: { fontWeight: '900', color: '#f8a831' },
});
