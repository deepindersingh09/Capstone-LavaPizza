import React, { useEffect, useState } from 'react';
import { Slot, useRouter, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

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
      setUser(u ?? null);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  // Local guest flag
  useEffect(() => {
    (async () => {
      const flag = await AsyncStorage.getItem('@guest_mode');
      setGuest(flag === '1');
      setGuestReady(true);
    })();
  }, []);

  // If an old anonymous session exists, sign it out so it doesn't confuse the gate
  useEffect(() => {
    if (authReady && user?.isAnonymous) void signOut(auth);
  }, [authReady, user]);

  useEffect(() => {
    if (!authReady || !guestReady) return;

    const inAuth = pathname.startsWith('/auth');
    const isAuthed = (!!user && !user.isAnonymous) || guest;

    // ✅ Only stop unauthenticated users from entering the app.
    //    DO NOT push authed users away from /auth (so the screen stays visible).
    if (!isAuthed && !inAuth) {
      router.replace('/auth/login');   // or '/auth/signup'
    }
    // (No "if (isAuthed && inAuth) go to home" branch on purpose)
  }, [authReady, guestReady, user, guest, pathname, router]);

  if (!authReady || !guestReady) return null; // optional splash/loader
  return <Slot />;
}
