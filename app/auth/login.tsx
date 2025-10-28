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
  Image,
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
        Alert.alert(
          'Email not verified',
          'We sent a new verification link. Check inbox!'
        );
        return;
      }

      await AsyncStorage.multiRemove(['@guest_mode', '@order_mode']);
      router.replace('/start');
    } catch (e: any) {
      let msg = 'Unable to sign in';
      if (e.code === 'auth/user-not-found') msg = 'User not found';
      if (e.code === 'auth/wrong-password') msg = 'Wrong password';
      if (e.code === 'auth/invalid-email') msg = 'Invalid email format';
      Alert.alert('Sign In Failed', msg);
    } finally {
      setBusy(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Enter Email', 'Enter email first');
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
      await AsyncStorage.multiRemove([
        '@order_mode',
        '@user_first_name',
        '@user_last_name',
      ]);
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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled">

          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back 👋</Text>
            <Text style={styles.subtitle}>Login to continue</Text>
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
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {/* Forgot */}
          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgot}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In */}
          <TouchableOpacity
            style={[styles.btn, (busy || guestLoading) && styles.disabled]}
            disabled={busy || guestLoading}
            onPress={handleLogin}>
            {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Sign In</Text>}
          </TouchableOpacity>

          {/* Guest */}
          <TouchableOpacity
            style={[styles.guestBtn, guestLoading && styles.disabled]}
            onPress={handleGuest}
            disabled={busy || guestLoading}
          >
            {guestLoading ? (
              <ActivityIndicator />
            ) : (
              <>
                <Ionicons name="person-outline" size={20} style={{ marginRight: 6 }} color="#F4B400" />
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
  container: { flex: 1, backgroundColor: '#fffdf0' },
  scroll: { padding: 24, paddingTop: 60 },

  logo: {
    width: 160,
    height: 120,
    alignSelf: 'center',
    marginBottom: 25,
  },

  header: { alignItems: 'center', marginBottom: 28 },
  title: { fontSize: 28, fontWeight: '900', color: '#1a1a1a' },
  subtitle: { fontSize: 15, color: '#555' },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#f8a831',
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 14,
  },
  focusWrap: {
    borderColor: '#FFC107',
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#1A1A1A' },
  eye: { position: 'absolute', right: 14 },

  forgot: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText: { color: '#f8a831', fontWeight: '600', fontSize: 14 },

  btn: {
    backgroundColor: '#f8a831',
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    marginBottom: 18,
  },
  disabled: { opacity: 0.6 },
  btnText: { fontSize: 17, fontWeight: '800', color: '#111' },

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
  guestText: { fontSize: 16, fontWeight: '700', color: '#F4B400' },

  footer: { marginTop: 22, alignItems: 'center', paddingBottom: 10 },
  footerText: { fontSize: 15, color: '#444' },
  link: { fontWeight: '900', color: '#f8a831' },
});
