// app/auth/login.tsx — Google Sign-In (google-signin library) + Email/Password
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import {
  GoogleAuthProvider,
  signInWithCredential,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  statusCodes,
  User as GoogleUser,
} from '@react-native-google-signin/google-signin';
import { auth } from '../../lib/firebase';
import * as WebBrowser from 'expo-web-browser';


WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '898725473422-h5o07rea27deqfs5lhv05fitdk8qr38c.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: false,
    });
    console.log('🔧 Google Sign-In configured');
  }, []);

  // ---- GOOGLE SIGN-IN -> FIREBASE ----
  const handleGoogleSignIn = async () => {
    try {
      setGoogleBusy(true);

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // ⬇️ Force the correct return type to avoid Expo's SignInResponse bleed-through
      const result = (await GoogleSignin.signIn()) as unknown as GoogleUser;
      console.log('✅ Google account:', result?.user?.email);

      const idToken =
        result.idToken ?? (await GoogleSignin.getTokens()).idToken;
      if (!idToken) throw new Error('No ID token returned from Google Sign-In');

      const credential = GoogleAuthProvider.credential(idToken);
      const userCred = await signInWithCredential(auth, credential);

      const u = userCred.user;
      const name = (u.displayName || '').trim();
      const [firstName, ...rest] = name.split(' ');
      const lastName = rest.join(' ');

      const userData = {
        uid: u.uid,
        firstName: firstName || '',
        lastName: lastName || '',
        email: u.email || '',
        createdAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(`@user_${u.uid}`, JSON.stringify(userData));
      if (firstName) await AsyncStorage.setItem('@user_first_name', firstName);
      if (lastName) await AsyncStorage.setItem('@user_last_name', lastName);
      await AsyncStorage.removeItem('@guest_mode');
      await AsyncStorage.removeItem('@order_mode');

      Alert.alert('Welcome!', `Hi ${firstName || 'there'}! 🍕`);
      router.replace('/start');
    } catch (err: any) {
      console.error('❌ Google Sign-In error:', err);
      if (err?.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled', 'Google Sign-In was cancelled');
      } else if (err?.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Please wait', 'Sign-In already in progress');
      } else if (err?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play Services', 'Google Play Services is not available or outdated');
      } else if (err?.code === '10' || String(err?.message).includes('DEVELOPER_ERROR')) {
        Alert.alert(
          'Developer error (code 10)',
          'Fix the Android OAuth client: package must be com.techtitans.lavapizza and SHA-1 must match your build keystore.'
        );
      } else {
        Alert.alert('Error', err?.message || 'Failed to sign in with Google');
      }
    } finally {
      setGoogleBusy(false);
    }
  };

  // ---- EMAIL / PASSWORD ----
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Enter email and password');
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
          'We re-sent the verification link. Please verify your email, then log in.'
        );
        return;
      }

      const cache = await AsyncStorage.getItem(`@user_${cred.user.uid}`);
      if (cache) {
        const userData = JSON.parse(cache);
        await AsyncStorage.setItem('@user_first_name', userData.firstName || '');
        if (userData.lastName) await AsyncStorage.setItem('@user_last_name', userData.lastName);
      } else if (cred.user.displayName) {
        await AsyncStorage.setItem('@user_first_name', cred.user.displayName);
      } else {
        const first = email.split('@')[0];
        await AsyncStorage.setItem('@user_first_name', first);
      }

      await AsyncStorage.removeItem('@guest_mode');
      await AsyncStorage.removeItem('@order_mode');
      router.replace('/start');
    } catch (e: any) {
      let msg = 'Unable to sign in';
      if (e.code === 'auth/user-not-found') msg = 'No account found with this email.';
      else if (e.code === 'auth/wrong-password') msg = 'Incorrect password.';
      else if (e.code === 'auth/invalid-email') msg = 'Please enter a valid email.';
      else if (e.code === 'auth/user-disabled') msg = 'This account has been disabled.';
      else if (e.code === 'auth/too-many-requests') msg = 'Too many attempts. Try later.';
      else if (e.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
      Alert.alert('Sign in failed', msg);
    } finally {
      setBusy(false);
    }
  };

  // ---- GUEST ----
  const handleGuest = async () => {
    try {
      await AsyncStorage.multiRemove(['@order_mode', '@user_first_name', '@user_last_name']);
      await AsyncStorage.setItem('@guest_mode', '1');
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
        {busy ? <ActivityIndicator /> : <Text style={styles.btnText}>Sign In</Text>}
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity
        style={[styles.googleBtn, googleBusy && styles.btnDisabled]}
        onPress={handleGoogleSignIn}
        disabled={googleBusy}
      >
        {googleBusy ? (
          <ActivityIndicator />
        ) : (
          <>
            <Image
              source={{
                uri: 'https://raw.githubusercontent.com/react-native-google-signin/google-signin/master/img/google.png',
              }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleGuest} style={styles.guestBtn} disabled={busy || googleBusy}>
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
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  btn: { backgroundColor: '#FFC107', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 6 },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontWeight: '700', fontSize: 16 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
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
    marginBottom: 8,
  },
  googleIcon: { width: 20, height: 20, marginRight: 10 },
  googleBtnText: { fontWeight: '600', fontSize: 16, color: '#555' },
  guestBtn: { marginTop: 16, alignItems: 'center', paddingVertical: 12 },
  guestText: { fontWeight: '700', fontSize: 16, color: '#F4B400' },
  footer: { textAlign: 'center', marginTop: 20, color: '#444' },
  link: { fontWeight: '700', color: '#111' },
});
