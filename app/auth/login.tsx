// app/auth/login.tsx — Clean + Minimal + Working Guest Mode ✅
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import {
  sendEmailVerification,
  sendPasswordResetEmail,
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
  const [guestLoading, setGuestLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Info', 'Enter both email & password');
      return;
    }
    if (!isValidEmail(email.trim())) {
      Alert.alert('Invalid Email', 'Enter a valid email');
      return;
    }

    setBusy(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);

      if (!cred.user.emailVerified) {
        await sendEmailVerification(cred.user);
        await signOut(auth);
        Alert.alert('Email Not Verified', 'Verify & try again');
        return;
      }

      await AsyncStorage.removeItem('@guest_mode');
      await AsyncStorage.removeItem('@order_mode');
      router.replace('/start');
    } catch (err: any) {
      let msg = 'Login failed';
      if (err.code === 'auth/wrong-password') msg = 'Wrong password';
      if (err.code === 'auth/user-not-found') msg = 'Account not found';
      Alert.alert('Error', msg);
    } finally {
      setBusy(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Enter Email', 'Then tap again');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert('Email Sent', 'Check inbox');
    } catch {
      Alert.alert('Error', 'Failed to send reset email');
    }
  };

  const handleGuest = async () => {
    setGuestLoading(true);
    try {
      await AsyncStorage.clear();
      await AsyncStorage.setItem('@guest_mode', '1');
      router.replace('/start');
    } catch {
      Alert.alert('Error', 'Try again');
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled">

          {/* ✅ LOGO ADDED */}
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          {/* Email */}
          <View style={[styles.inputWrap, emailFocused && styles.focusWrap]}>
            <Ionicons name="mail-outline" size={20} color="#999" style={styles.icon} />
            <TextInput
              placeholder="Email address"
              placeholderTextColor="#999"
              style={styles.input}
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              editable={!busy && !guestLoading}
            />
          </View>

          {/* Password */}
          <View style={[styles.inputWrap, passwordFocused && styles.focusWrap]}>
            <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.icon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              style={[styles.input, { paddingRight: 40 }]}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              editable={!busy && !guestLoading}
            />
            <TouchableOpacity
              style={styles.eye}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {/* Forgot */}
          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgot}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In Btn */}
          <TouchableOpacity
            style={[styles.btn, (busy || guestLoading) && styles.disabled]}
            disabled={busy || guestLoading}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Sign In</Text>}
          </TouchableOpacity>

          {/* OR */}
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.or}>OR</Text>
            <View style={styles.line} />
          </View>

          {/* Guest Mode */}
          <TouchableOpacity
            style={[styles.guestBtn, guestLoading && styles.disabled]}
            onPress={handleGuest}
            disabled={busy || guestLoading}
            activeOpacity={0.8}
          >
            {guestLoading ? (
              <ActivityIndicator />
            ) : (
              <>
                <Ionicons name="person-outline" size={20} color="#F4B400" style={{ marginRight: 6 }} />
                <Text style={styles.guestText}>Continue as Guest</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don’t have an account?{' '}
              <Link href="/auth/select-role" style={styles.link}>Sign Up</Link>
            </Text>
          </View>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBF5' },
  scroll: { padding: 24, paddingTop: 60 },

  /* ✅ Logo Style */
  logo: {
    width: 170,
    height: 130,
    alignSelf: 'center',
    marginBottom: 25,
  },

  header: { marginBottom: 40, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '700', color: '#1A1A1A' },
  subtitle: { fontSize: 16, color: '#666' },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#E6E6E6',
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 14,
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 0
  },
  focusWrap: {
    borderColor: '#FFC107',
    shadowOpacity: 0.12,
    elevation: 1
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#1A1A1A' },
  eye: { position: 'absolute', right: 14 },

  forgot: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText: { color: '#F4B400', fontWeight: '600', fontSize: 14 },

  btn: {
    backgroundColor: '#FFC107',
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 22,
    shadowOpacity: 0.05,
    elevation: 1
  },
  disabled: { opacity: 0.6 },
  btnText: { fontWeight: '700', fontSize: 16, color: '#1A1A1A' },

  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#E6E6E6' },
  or: { marginHorizontal: 10, color: '#777', fontWeight: '500' },

  guestBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    height: 54,
    borderWidth: 1,
    borderColor: '#FFE082'
  },
  guestText: { fontSize: 15, fontWeight: '600', color: '#F4B400' },

  footer: { marginTop: 28, alignItems: 'center', paddingBottom: 10 },
  footerText: { fontSize: 15, color: '#555' },
  link: { color: '#FFC107', fontWeight: '700' }
});
