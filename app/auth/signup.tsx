// app/auth/signup-customer.tsx - DEBUGGED VERSION
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../lib/firebaseConfig';
import React from 'react';

export default function SignupCustomer() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    console.log('🔵 Signup attempt started');
    console.log('Email:', email);
    console.log('Auth object:', auth ? 'Exists' : 'NULL');

    // Validation
    if (!firstName || !email || !password) {
      Alert.alert('Missing Info', 'Enter all required fields (First Name, Email, Password)');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    if (password !== confirm) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    if (!agreed) {
      Alert.alert('Terms Required', 'Please agree to Terms & Privacy Policy.');
      return;
    }

    // Check Firebase auth
    if (!auth) {
      Alert.alert(
        'Configuration Error',
        'Firebase Auth is not initialized. Please check Firebase configuration.'
      );
      console.error('❌ Firebase auth is null');
      return;
    }

    setBusy(true);

    try {
      console.log('🟡 Creating Firebase account...');
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      console.log('✅ Account created!', cred.user.email);

      // Update display name
      console.log('🟡 Updating profile...');
      await updateProfile(cred.user, {
        displayName: firstName.trim(),
      });
      console.log('✅ Profile updated');

      // Save user data to AsyncStorage
      const userData = {
        uid: cred.user.uid,
        firstName: firstName.trim(),
        lastName: lastName.trim() || '',
        email: email.trim(),
        createdAt: new Date().toISOString(),
        role: 'customer',
      };

      await AsyncStorage.setItem(`@user_${cred.user.uid}`, JSON.stringify(userData));
      await AsyncStorage.setItem('@user_first_name', firstName.trim());
      console.log('✅ User data saved');

      // Send verification email
      console.log('🟡 Sending verification email...');
      await sendEmailVerification(cred.user);
      console.log('✅ Verification email sent');

      // Sign out until email is verified
      await signOut(auth);
      console.log('✅ Signed out for email verification');

      Alert.alert(
        'Verify Your Email ✅',
        `We sent a verification link to ${email}. Please check your inbox and verify your email before signing in.`,
        [
          {
            text: 'OK',
            onPress: () => router.replace('/auth/login'),
          },
        ]
      );
    } catch (err: any) {
      console.error('❌ Signup error:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);

      let errorMessage = 'Signup failed. Please try again.';

      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format. Please check your email.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Use at least 6 characters.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMessage =
          'Email/Password authentication is not enabled. Please enable it in Firebase Console.';
      } else if (err.message) {
        errorMessage = `Error: ${err.message}`;
      }

      Alert.alert('Signup Failed', errorMessage + '\n\nCheck console for details.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />

      <Text style={styles.heading}>Create an Account</Text>
      <Text style={styles.subtext}>Customer Registration</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name *"
        placeholderTextColor="#999"
        value={firstName}
        onChangeText={setFirstName}
        editable={!busy}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name (Optional)"
        placeholderTextColor="#999"
        value={lastName}
        onChangeText={setLastName}
        editable={!busy}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address *"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        editable={!busy}
      />

      {/* Password */}
      <View style={styles.inputIconWrap}>
        <TextInput
          placeholder="Password *"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          style={styles.inputFlex}
          value={password}
          onChangeText={setPassword}
          editable={!busy}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={22}
            color="#444"
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <View style={styles.inputIconWrap}>
        <TextInput
          placeholder="Confirm Password *"
          placeholderTextColor="#999"
          secureTextEntry={!showConfirmPassword}
          style={styles.inputFlex}
          value={confirm}
          onChangeText={setConfirm}
          editable={!busy}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Ionicons
            name={showConfirmPassword ? 'eye-off' : 'eye'}
            size={22}
            color="#444"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => setAgreed(!agreed)}
        style={styles.checkRow}
        disabled={busy}
      >
        <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
          {agreed && <Ionicons name="checkmark" size={14} color="#222" />}
        </View>
        <Text style={styles.checkLabel}>I agree to Terms & Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, busy && styles.buttonDisabled]}
        disabled={busy}
        onPress={handleSignup}
      >
        {busy ? (
          <ActivityIndicator color="#222" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.signInText}>
        Already registered?{' '}
        <Link href="/auth/login" style={styles.signInLink}>
          Sign in
        </Link>
      </Text>

      {/* Debug Info */}
      <View style={styles.debugBox}>
        <Text style={styles.debugText}>
          🔍 Debug: Check console for detailed logs
        </Text>
        <Text style={styles.debugText}>
          Firebase Auth: {auth ? '✅ Connected' : '❌ Not Connected'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fffaf0',
    padding: 24,
    paddingTop: 60,
  },
  logo: {
    width: 115,
    height: 115,
    alignSelf: 'center',
    marginBottom: 14,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    color: '#f8a831',
  },
  subtext: {
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ffe38f',
    marginBottom: 14,
    fontSize: 16,
    color: '#111',
  },
  inputIconWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ffe38f',
    borderRadius: 12,
    paddingRight: 12,
    marginBottom: 14,
  },
  inputFlex: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: '#111',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#f8a831',
    borderColor: '#f8a831',
  },
  checkLabel: {
    marginLeft: 10,
    color: '#444',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#f8a831ff',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
    height: 54,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#222',
  },
  signInText: {
    textAlign: 'center',
    marginTop: 18,
    color: '#444',
    fontSize: 14,
  },
  signInLink: {
    fontWeight: '700',
    color: '#d47b00',
  },
  debugBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
});