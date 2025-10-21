// app/auth/login.tsx - WITH GOOGLE SIGN-IN
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { signInWithEmailAndPassword, sendEmailVerification, signOut, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google'; // ✅ *** TYPO FIXED ***
import { auth } from '../../lib/firebase';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  // Google Sign-In setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '898725473422-h5o07rea27deqfs5lhv05fitdk8qr38c.apps.googleusercontent.com', // Use expoClientId for dev
    androidClientId: '898725473422-m5gjnlh4olmspsnovtdbp9o4h7mhqclo.apps.googleusercontent.com', // For production .aab
  });

  // Handle Google Sign-In response
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleSignIn(id_token);
    }
  }, [response]);

  const handleGoogleSignIn = async (idToken: string) => {
    setBusy(true);
    try {
      console.log('🔐 Google Sign-In: Creating credential');
      
      const credential = GoogleAuthProvider.credential(idToken);
      const cred = await signInWithCredential(auth, credential);
      
      console.log('✅ Google Auth successful, User ID:', cred.user.uid);
      console.log('📧 Email:', cred.user.email);
      console.log('👤 Display Name:', cred.user.displayName);

      // Extract name from Google profile
      const displayName = cred.user.displayName || '';
      const nameParts = displayName.split(' ');
      const firstName = nameParts[0] || cred.user.email?.split('@')[0] || 'User';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Save user data to AsyncStorage
      const userData = {
        firstName,
        lastName,
        email: cred.user.email,
        uid: cred.user.uid,
      };

      await AsyncStorage.setItem(`@user_${cred.user.uid}`, JSON.stringify(userData));
      await AsyncStorage.setItem('@user_first_name', firstName);
      if (lastName) {
        await AsyncStorage.setItem('@user_last_name', lastName);
      }
      
      // Clear guest mode
      await AsyncStorage.removeItem('@guest_mode');
      await AsyncStorage.removeItem('@order_mode');
      
      console.log('✅ Google Sign-In complete, name saved:', firstName);
      
      Alert.alert('Welcome!', `Hi ${firstName}! 🍕`);
      router.replace('/start');
      
    } catch (e: any) {
      console.error('❌ Google Sign-In error:', e);
      Alert.alert('Sign in failed', 'Unable to sign in with Google. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Enter email and password');
      return;
    }
    setBusy(true);
    try {
      console.log('🔐 Attempting login for:', email);
      
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      console.log('✅ Firebase Auth successful, User ID:', cred.user.uid);

      if (!cred.user.emailVerified) {
        console.log('⚠️ Email not verified');
        await sendEmailVerification(cred.user);
        await signOut(auth);
        Alert.alert(
          'Email not verified',
          'We re-sent the verification link. Please verify your email, then log in.'
        );
        return;
      }

      console.log('📧 Email verified, fetching user data...');

      const userDataString = await AsyncStorage.getItem(`@user_${cred.user.uid}`);
      
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        console.log('✅ User data found in AsyncStorage:', userData);
        
        await AsyncStorage.setItem('@user_first_name', userData.firstName);
        if (userData.lastName) {
          await AsyncStorage.setItem('@user_last_name', userData.lastName);
        }
        
        console.log('✅ Name saved:', userData.firstName);
        await AsyncStorage.removeItem('@guest_mode');
        
        Alert.alert('Welcome back!', `Hi ${userData.firstName}! 🍕`);
      } else {
        console.log('⚠️ No local data found, checking Auth profile...');
        
        if (cred.user.displayName) {
          await AsyncStorage.setItem('@user_first_name', cred.user.displayName);
          await AsyncStorage.removeItem('@guest_mode');
          console.log('✅ Using name from Auth profile:', cred.user.displayName);
          Alert.alert('Welcome back!', `Hi ${cred.user.displayName}! 🍕`);
        } else {
          console.log('❌ No name found, setting default...');
          const firstName = email.split('@')[0];
          await AsyncStorage.setItem('@user_first_name', firstName);
          await AsyncStorage.removeItem('@guest_mode');
          Alert.alert('Welcome!', `Hi ${firstName}! Update your profile to change your name.`);
        }
      }

      await AsyncStorage.removeItem('@order_mode');
      
      const storedName = await AsyncStorage.getItem('@user_first_name');
      const guestMode = await AsyncStorage.getItem('@guest_mode');
      console.log('🔍 Stored name:', storedName);
      console.log('🔍 Guest mode:', guestMode);
      
      console.log('🚀 Navigating to /start');
      router.replace('/start');
    } catch (e: any) {
      console.error('❌ Login error:', e);
      let errorMessage = 'Unable to sign in';
      
      if (e.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.';
      } else if (e.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (e.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (e.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Contact support.';
      } else if (e.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (e.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid credentials. Please check your email and password.';
      }
      
      Alert.alert('Sign in failed', errorMessage);
    } finally {
      setBusy(false);
    }
  };

  const handleGuest = async () => {
    try {
      console.log('👤 Continuing as guest...');
      
      await AsyncStorage.removeItem('@order_mode');
      await AsyncStorage.removeItem('@user_first_name');
      await AsyncStorage.removeItem('@user_last_name');
      await AsyncStorage.setItem('@guest_mode', '1');
      
      console.log('✅ Guest mode activated');
      
      const guestCheck = await AsyncStorage.getItem('@guest_mode');
      console.log('🔍 Guest mode verification:', guestCheck);
      
      router.replace('/start');
    } catch (error) {
      console.error('❌ Error setting guest mode:', error);
      Alert.alert('Error', 'Failed to continue as guest. Please try again.');
    }
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

      <TouchableOpacity 
        style={[styles.btn, busy && styles.btnDisabled]} 
        onPress={handleLogin} 
        disabled={busy}
      >
        {busy ? (
          <ActivityIndicator color="#000" />
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

      {/* Google Sign-In Button */}
      <TouchableOpacity 
        style={[styles.googleBtn, busy && styles.btnDisabled]} 
        onPress={() => promptAsync()}
        disabled={!request || busy}
      >
        <Text style={styles.googleIcon}>G</Text>
        <Text style={styles.googleBtnText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleGuest} style={styles.guestBtn} disabled={busy}>
        <Text style={styles.guestText}>Continue as guest</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Don't have an account? <Link href="/auth/signup" style={styles.link}>Sign up</Link>
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
  
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#ddd' },
  dividerText: { marginHorizontal: 10, color: '#999', fontWeight: '600' },
  
  googleBtn: { 
    backgroundColor: '#fff', 
    padding: 14, 
    borderRadius: 12, 
    alignItems: 'center', 
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  googleIcon: { 
    fontSize: 20, 
    fontWeight: '700', 
    marginRight: 10,
    color: '#4285F4' 
  },
  googleBtnText: { fontWeight: '600', color: '#333' },
  
  guestBtn: { marginTop: 12, alignItems: 'center', paddingVertical: 12 },
  guestText: { fontWeight: '700', fontSize: 16, color: '#F4B400' },
  footer: { textAlign: 'center', marginTop: 16, color: '#444' },
  link: { fontWeight: '700', color: '#111' },
});