<<<<<<< Updated upstream
// app/auth/login.tsx — Clean merged version ✅
=======
//app/auth/login.tsx — Enhanced Email/Password Login
>>>>>>> Stashed changes
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
  const [showPassword, setShowPassword] = useState(false);
<<<<<<< Updated upstream

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Enter email and password.');
      return;
    }

=======
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Email validation helper
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // ---- EMAIL / PASSWORD LOGIN ----
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please enter both email and password');
      return;
    }

    if (!isValidEmail(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
          'Email not verified',
          'Verification link sent again. Please verify before logging in.'
=======
          'Email Not Verified',
          'We sent a verification link to your email. Please verify your email address and try again.',
          [{ text: 'OK' }]
>>>>>>> Stashed changes
        );
        return;
      }

      // Cache user data
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
<<<<<<< Updated upstream
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
=======
      let msg = 'Unable to sign in. Please try again.';
      if (e.code === 'auth/user-not-found') {
        msg = 'No account found with this email address.';
      } else if (e.code === 'auth/wrong-password') {
        msg = 'Incorrect password. Please try again.';
      } else if (e.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (e.code === 'auth/user-disabled') {
        msg = 'This account has been disabled. Please contact support.';
      } else if (e.code === 'auth/too-many-requests') {
        msg = 'Too many failed attempts. Please try again later.';
      } else if (e.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Please check and try again.';
      } else if (e.code === 'auth/network-request-failed') {
        msg = 'Network error. Please check your connection.';
      }
      Alert.alert('Sign In Failed', msg);
>>>>>>> Stashed changes
    } finally {
      setBusy(false);
    }
  };

<<<<<<< Updated upstream
=======
  // ---- FORGOT PASSWORD ----
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert(
        'Enter Email',
        'Please enter your email address first, then tap Forgot Password again.'
      );
      return;
    }

    if (!isValidEmail(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    Alert.alert(
      'Reset Password',
      `Send password reset link to ${email.trim()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            try {
              await sendPasswordResetEmail(auth, email.trim());
              Alert.alert(
                'Email Sent',
                'Password reset link has been sent to your email. Please check your inbox.'
              );
            } catch (e: any) {
              let msg = 'Failed to send reset email';
              if (e.code === 'auth/user-not-found') {
                msg = 'No account found with this email address.';
              } else if (e.code === 'auth/invalid-email') {
                msg = 'Please enter a valid email address.';
              }
              Alert.alert('Error', msg);
            }
          },
        },
      ]
    );
  };

  // ---- GUEST MODE ----
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.wrap}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <View style={[
                  styles.inputWrapper,
                  emailFocused && styles.inputWrapperFocused
                ]}>
                  <Ionicons name="mail-outline" size={20} color="#999" style={styles.icon} />
                  <TextInput
                    placeholder="Email address"
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    style={styles.input}
                    editable={!busy}
                  />
                </View>
              </View>
>>>>>>> Stashed changes

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <View style={[
                  styles.inputWrapper,
                  passwordFocused && styles.inputWrapperFocused
                ]}>
                  <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.icon} />
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    style={[styles.input, styles.passwordInput]}
                    editable={!busy}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                    disabled={busy}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
              </View>

<<<<<<< Updated upstream
      <TouchableOpacity onPress={handleGuest} style={styles.guestBtn}>
        <Text style={styles.guestText}>Continue as guest</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Don’t have an account?{' '}
      <Link href="../select-role" style={styles.link}>Sign up</Link>

      </Text>
    </View>
=======
              {/* Forgot Password */}
              <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.forgotButton}
                disabled={busy}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Sign In Button */}
              <TouchableOpacity
                style={[styles.btn, busy && styles.btnDisabled]}
                onPress={handleLogin}
                disabled={busy}
                activeOpacity={0.8}
              >
                {busy ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Sign In</Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Guest Button */}
              <TouchableOpacity
                onPress={handleGuest}
                style={styles.guestBtn}
                disabled={busy}
                activeOpacity={0.8}
              >
                <Ionicons name="person-outline" size={20} color="#F4B400" style={{ marginRight: 8 }} />
                <Text style={styles.guestText}>Continue as Guest</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don't have an account?{' '}
                <Link href="/auth/signup" asChild>
                  <Text style={styles.link}>Sign Up</Text>
                </Link>
              </Text>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
>>>>>>> Stashed changes
  );
}

const styles = StyleSheet.create({
<<<<<<< Updated upstream
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
=======
  container: {
    flex: 1,
    backgroundColor: '#FFFBF5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  wrap: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputWrapperFocused: {
    borderColor: '#FFC107',
    shadowColor: '#FFC107',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '400',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    padding: 4,
  },
  forgotText: {
    fontSize: 14,
    color: '#F4B400',
    fontWeight: '600',
  },
  btn: {
    backgroundColor: '#FFC107',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.1,
  },
  btnText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#1A1A1A',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8E1',
    padding: 16,
    borderRadius: 12,
    height: 56,
    borderWidth: 1.5,
    borderColor: '#FFE082',
  },
  guestText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#F4B400',
  },
  footer: {
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    fontWeight: '400',
  },
  link: {
    fontWeight: '700',
    color: '#FFC107',
    textDecorationLine: 'underline',
  },
});
>>>>>>> Stashed changes
