// app/_layout.tsx - WITH LONGER SPLASH & FULL SCREEN
import React, { useEffect, useState } from 'react';
import { Slot, useRouter, usePathname, Stack } from 'expo-router';
import { View, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [authReady, setAuthReady] = useState(false);
  const [guestReady, setGuestReady] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [guest, setGuest] = useState(false);

  // Minimum splash screen display time (2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2000); // 👈 Adjust this (in milliseconds)

    return () => clearTimeout(timer);
  }, []);

  // Firebase session
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      console.log('🔐 Auth state changed:', u?.email || 'No user');
      setUser(u ?? null);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  // Local guest flag
  useEffect(() => {
    (async () => {
      const flag = await AsyncStorage.getItem('@guest_mode');
      console.log('👤 Guest mode flag:', flag);
      setGuest(flag === '1');
      setGuestReady(true);
    })();
  }, []);

  <ThemeProvider>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/login" />
      {/* ... other screens */}
    </Stack>
  </ThemeProvider>


  // If an old anonymous session exists, sign it out
  useEffect(() => {
    if (authReady && user?.isAnonymous) {
      console.log('⚠️ Signing out anonymous user');
      void signOut(auth);
    }
  }, [authReady, user]);

  // Navigation logic
  useEffect(() => {
    if (!authReady || !guestReady || !minTimeElapsed) return;

    const inAuth = pathname.startsWith('/auth');
    const isAuthed = (!!user && !user.isAnonymous) || guest;

    console.log('🚦 Navigation check:', {
      pathname,
      inAuth,
      isAuthed,
      hasUser: !!user,
      isGuest: guest
    });

    if (!isAuthed && !inAuth) {
      console.log('❌ Not authenticated, redirecting to login');
      router.replace('/auth/login');
    }
  }, [authReady, guestReady, minTimeElapsed, user, guest, pathname, router]);

  // Show splash screen while loading OR minimum time hasn't elapsed
  if (!authReady || !guestReady || !minTimeElapsed) {
    return (
      <View style={styles.splashContainer}>
        <Image 
          source={require('../assets/images/splash.png')} // 👈 Update this path
          style={styles.splashImage}
          resizeMode="cover" // 👈 'cover' fills screen, 'contain' fits within
        />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="auth/login" />
            {/* ... other screens */}
          </Stack>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#ffffff', // 👈 Match your brand color
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
});