<<<<<<< Updated upstream
// app/auth/signup.tsx
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut, updateProfile } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
=======
//app/auth/signup.tsx — Enhanced Signup with Validation & Password Strength
import React, { useState, useMemo } from 'react';
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
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile,
} from 'firebase/auth';
>>>>>>> Stashed changes
import { auth } from '../../lib/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function Signup({ route }: any) {
  const router = useRouter();
  const roleParam = route?.params?.role || 'customer'; // default role
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
<<<<<<< Updated upstream
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
=======
  const [showConfirm, setShowConfirm] = useState(false);

  // Focus states
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  // Email validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { strength: 0, label: '', color: '#E8E8E8' };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 1) return { strength: 1, label: 'Weak', color: '#FF5252' };
    if (strength === 2) return { strength: 2, label: 'Fair', color: '#FFA726' };
    if (strength === 3) return { strength: 3, label: 'Good', color: '#FFC107' };
    if (strength >= 4) return { strength: 4, label: 'Strong', color: '#66BB6A' };

    return { strength: 0, label: '', color: '#E8E8E8' };
  }, [password]);

  // Password match validation
  const passwordsMatch = useMemo(() => {
    if (!confirm) return null;
    return password === confirm;
  }, [password, confirm]);
>>>>>>> Stashed changes

  const handleSignup = async () => {
    // Validation
    if (!firstName.trim()) {
      Alert.alert('Missing Information', 'Please enter your first name');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Missing Information', 'Please enter your email address');
      return;
    }

    if (!isValidEmail(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    if (!password) {
      Alert.alert('Missing Information', 'Please enter a password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirm) {
      Alert.alert('Password Mismatch', 'Passwords do not match. Please try again.');
      return;
    }

    if (!agreed) {
      Alert.alert(
        'Terms & Conditions',
        'Please agree to the Terms of Service and Privacy Policy to continue'
      );
      return;
    }

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
        role: roleParam,
        createdAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(`@user_${cred.user.uid}`, JSON.stringify(userData));
      await AsyncStorage.setItem('@user_first_name', firstName.trim());
      if (lastName.trim()) {
        await AsyncStorage.setItem('@user_last_name', lastName.trim());
      }

      await sendEmailVerification(cred.user);
      await signOut(auth);

      Alert.alert(
        'Verify Your Email',
        'We sent a verification link to your email. Please verify your email address and then sign in.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/auth/login');
            },
          },
        ]
      );

      await AsyncStorage.removeItem('@order_mode');
    } catch (e: any) {
      let errorMessage = 'Unable to create account. Please try again.';

      if (e.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (e.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (e.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      } else if (e.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      }

      Alert.alert('Sign Up Failed', errorMessage);
      console.error('Signup error:', e);
    } finally {
      setBusy(false);
    }
  };

  return (
<<<<<<< Updated upstream
    <View style={styles.wrap}>
      
      {/* Logo */}
      <Image 
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Get started now!</Text>

      <Text style={styles.roleText}>Role: {roleParam.charAt(0).toUpperCase() + roleParam.slice(1)}</Text>

      <TextInput
        placeholder="First Name *"
        autoCapitalize="words"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
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
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join us today!</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* First Name */}
              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    firstNameFocused && styles.inputWrapperFocused,
                  ]}
                >
                  <Ionicons name="person-outline" size={20} color="#999" style={styles.icon} />
                  <TextInput
                    placeholder="First Name *"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    value={firstName}
                    onChangeText={setFirstName}
                    onFocus={() => setFirstNameFocused(true)}
                    onBlur={() => setFirstNameFocused(false)}
                    style={styles.input}
                    editable={!busy}
                  />
                </View>
              </View>
>>>>>>> Stashed changes

              {/* Last Name */}
              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    lastNameFocused && styles.inputWrapperFocused,
                  ]}
                >
                  <Ionicons name="person-outline" size={20} color="#999" style={styles.icon} />
                  <TextInput
                    placeholder="Last Name (optional)"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    value={lastName}
                    onChangeText={setLastName}
                    onFocus={() => setLastNameFocused(true)}
                    onBlur={() => setLastNameFocused(false)}
                    style={styles.input}
                    editable={!busy}
                  />
                </View>
              </View>

<<<<<<< Updated upstream
      <TextInput
        placeholder="Email address"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      {/* Password Field */}
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

      {/* Confirm Password Field */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          value={confirm}
          onChangeText={setConfirm}
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Ionicons
            name={showConfirmPassword ? 'eye-off' : 'eye'}
            size={22}
            color="#555"
            style={{ marginLeft: -35 }}
          />
        </TouchableOpacity>
      </View>
=======
              {/* Email */}
              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    emailFocused && styles.inputWrapperFocused,
                  ]}
                >
                  <Ionicons name="mail-outline" size={20} color="#999" style={styles.icon} />
                  <TextInput
                    placeholder="Email address *"
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

              {/* Password */}
              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    passwordFocused && styles.inputWrapperFocused,
                  ]}
                >
                  <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.icon} />
                  <TextInput
                    placeholder="Password *"
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

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <View style={styles.strengthContainer}>
                    <View style={styles.strengthBar}>
                      <View
                        style={[
                          styles.strengthFill,
                          {
                            width: `${(passwordStrength.strength / 4) * 100}%`,
                            backgroundColor: passwordStrength.color,
                          },
                        ]}
                      />
                    </View>
                    <Text
                      style={[styles.strengthText, { color: passwordStrength.color }]}
                    >
                      {passwordStrength.label}
                    </Text>
                  </View>
                )}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    confirmFocused && styles.inputWrapperFocused,
                    passwordsMatch === false && styles.inputWrapperError,
                  ]}
                >
                  <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.icon} />
                  <TextInput
                    placeholder="Confirm Password *"
                    placeholderTextColor="#999"
                    secureTextEntry={!showConfirm}
                    value={confirm}
                    onChangeText={setConfirm}
                    onFocus={() => setConfirmFocused(true)}
                    onBlur={() => setConfirmFocused(false)}
                    style={[styles.input, styles.passwordInput]}
                    editable={!busy}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirm(!showConfirm)}
                    style={styles.eyeIcon}
                    disabled={busy}
                  >
                    <Ionicons
                      name={showConfirm ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>

                {/* Password Match Indicator */}
                {confirm.length > 0 && (
                  <View style={styles.matchContainer}>
                    {passwordsMatch ? (
                      <View style={styles.matchRow}>
                        <Ionicons name="checkmark-circle" size={16} color="#66BB6A" />
                        <Text style={[styles.matchText, { color: '#66BB6A' }]}>
                          Passwords match
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.matchRow}>
                        <Ionicons name="close-circle" size={16} color="#FF5252" />
                        <Text style={[styles.matchText, { color: '#FF5252' }]}>
                          Passwords don't match
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* Terms & Privacy Checkbox */}
              <TouchableOpacity
                onPress={() => setAgreed(!agreed)}
                style={styles.checkboxRow}
                disabled={busy}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                  {agreed && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                <Text style={styles.checkboxText}>
                  I agree to the{' '}
                  <Text style={styles.checkboxLink}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={styles.checkboxLink}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[styles.btn, busy && styles.btnDisabled]}
                onPress={handleSignup}
                disabled={busy}
                activeOpacity={0.8}
              >
                {busy ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account?{' '}
                <Link href="/auth/login" asChild>
                  <Text style={styles.link}>Sign In</Text>
                </Link>
              </Text>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
<<<<<<< Updated upstream
  wrap: { flex: 1, backgroundColor: '#fff7e6', padding: 24, justifyContent: 'center' },
  logo: { width: 110, height: 110, alignSelf: 'center', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 3 },
  subtitle: { marginBottom: 18, color: '#555', textAlign: 'center' },
  roleText: { textAlign: 'center', fontWeight: '700', marginBottom: 12, color: '#222' },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 8 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#aaa' },
  btn: { backgroundColor: '#FFC107', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 6 },
  btnText: { fontWeight: '700' },
  footer: { textAlign: 'center', marginTop: 16, color: '#444' },
  link: { fontWeight: '700', color: '#111' },
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
  inputWrapperError: {
    borderColor: '#FF5252',
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
  strengthContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E8E8E8',
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 12,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 50,
  },
  matchContainer: {
    marginTop: 8,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#FFC107',
    borderColor: '#FFC107',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  checkboxLink: {
    color: '#FFC107',
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
>>>>>>> Stashed changes
});
