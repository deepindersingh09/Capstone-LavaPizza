// app/auth/signup-customer.tsx
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut, updateProfile } from 'firebase/auth';
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
    if (!firstName || !email || !password)
      return Alert.alert('Missing info', 'Enter all required fields.');
    if (password.length < 6)
      return Alert.alert('Weak password', 'At least 6 characters required.');
    if (password !== confirm)
      return Alert.alert('Mismatch', 'Passwords do not match.');
    if (!agreed)
      return Alert.alert('Reminder', 'Agree to Terms & Privacy Policy.');

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
        createdAt: new Date().toISOString(),
        role: 'customer'
      };

      await AsyncStorage.setItem(`@user_${cred.user.uid}`, JSON.stringify(userData));
      await AsyncStorage.setItem('@user_first_name', firstName.trim());

      await sendEmailVerification(cred.user);
      await signOut(auth);

      Alert.alert('Verify Email', 'Check your inbox to verify your account.');
      router.replace('/auth/login');

    } catch (err: any) {
      let errorMessage = 'Signup failed. Try again.';
      if (err.code === 'auth/email-already-in-use') errorMessage = 'Email already registered.';
      if (err.code === 'auth/invalid-email') errorMessage = 'Invalid email format.';
      if (err.code === 'auth/weak-password') errorMessage = 'Use a stronger password.';
      Alert.alert('Error', errorMessage);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>

      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />

      <Text style={styles.heading}>Create an Account</Text>
      <Text style={styles.subtext}>Customer Registration</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name *"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name (Optional)"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address *"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <View style={styles.inputIconWrap}>
        <TextInput
          placeholder="Password *"
          secureTextEntry={!showPassword}
          style={styles.inputFlex}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#444" />
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <View style={styles.inputIconWrap}>
        <TextInput
          placeholder="Confirm Password *"
          secureTextEntry={!showConfirmPassword}
          style={styles.inputFlex}
          value={confirm}
          onChangeText={setConfirm}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={22} color="#444" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => setAgreed(!agreed)} style={styles.checkRow}>
        <View style={[styles.checkbox, agreed && styles.checkboxActive]} />
        <Text style={styles.checkLabel}>I agree to Terms & Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, busy && { opacity: 0.6 }]}
        disabled={busy}
        onPress={handleSignup}
      >
        <Text style={styles.buttonText}>{busy ? 'Creating...' : 'Sign Up'}</Text>
      </TouchableOpacity>

      <Text style={styles.signInText}>
        Already registered? <Link href="/auth/login" style={styles.signInLink}>Sign in</Link>
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf0',
    padding: 24,
    justifyContent: 'center'
  },
  logo: {
    width: 115,
    height: 115,
    alignSelf: 'center',
    marginBottom: 14
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    color: '#f8a831'
  },
  subtext: {
    color: '#555',
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ffe38f',
    marginBottom: 14
  },
  inputIconWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ffe38f',
    borderRadius: 12,
    paddingRight: 12,
    marginBottom: 14
  },
  inputFlex: {
    flex: 1,
    padding: 14
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#aaa'
  },
  checkboxActive: {
    backgroundColor: '#f8a831'
  },
  checkLabel: {
    marginLeft: 8,
    color: '#444'
  },
  button: {
    backgroundColor: '#f8a831ff',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#222'
  },
  signInText: {
    textAlign: 'center',
    marginTop: 18,
    color: '#444'
  },
  signInLink: {
    fontWeight: '700',
    color: '#d47b00'
  }
});
