// lib/auth-helper.ts
import type { Router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export async function continueAsGuestLocal(router: Router) {
  await AsyncStorage.setItem('@guest_mode', '1');
  router.replace('/(drawer)/(tabs)/home');
}

export async function fullLogout(router: Router) {
  await AsyncStorage.removeItem('@guest_mode');
  await signOut(auth);
  router.replace('/auth/login'); // or '/auth/signup'
}
