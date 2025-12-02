// app/_layout.tsx - WITH GUEST MODE SUPPORT
import React, { useEffect, useState } from 'react';
import { Slot, useRouter, usePathname, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { CartProvider } from './context/CartContext';

import { ThemeProvider } from '../lib/ThemeContext';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [authReady, setAuthReady] = useState(false);
  const [guestReady, setGuestReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [guest, setGuest] = useState(false);

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

  useEffect(() => {
    if (!authReady || !guestReady) return;

    const inAuth = pathname.startsWith('/auth');
    const isAuthed = (!!user && !user.isAnonymous) || guest;

    console.log('🚦 Navigation check:', {
      pathname,
      inAuth,
      isAuthed,
      hasUser: !!user,
      isGuest: guest
    });

    // Only redirect unauthenticated users trying to access the app
    if (!isAuthed && !inAuth) {
      console.log('❌ Not authenticated, redirecting to login');
      router.replace('/auth/login');
    }
  }, [authReady, guestReady, user, guest, pathname, router]);

  if (!authReady || !guestReady) {
    return null; // Show nothing while loading
  }

  return (
    <CartProvider>
      <Slot />
    </CartProvider>
  );
}