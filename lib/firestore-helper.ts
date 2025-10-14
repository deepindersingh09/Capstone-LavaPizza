// lib/firestore-helper.ts
import { doc, setDoc, getDoc, Firestore } from 'firebase/firestore';
import { db } from './firebase';

export interface UserData {
  firstName: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
}

/**
 * Save user data to Firestore
 * @param userId - Firebase Auth user ID
 * @param userData - User information to store
 */
export async function saveUserToFirestore(userId: string, userData: UserData) {
  try {
    // ✅ Use db directly from import
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      updatedAt: new Date().toISOString(),
    });
    console.log('✅ User data saved to Firestore');
    return true;
  } catch (error) {
    console.error('❌ Error saving user to Firestore:', error);
    throw error;
  }
}

/**
 * Get user data from Firestore
 * @param userId - Firebase Auth user ID
 * @returns User data or null if not found
 */
export async function getUserFromFirestore(userId: string): Promise<UserData | null> {
  try {
    console.log('📍 Getting user from Firestore, UID:', userId);
    console.log('📍 db object:', db ? 'initialized' : 'NOT initialized');
    
    // ✅ Use db directly from import
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      console.log('✅ User data retrieved from Firestore');
      return userSnap.data() as UserData;
    } else {
      console.log('⚠️ No user data found in Firestore');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting user from Firestore:', error);
    throw error;
  }
}

/**
 * Update user data in Firestore
 * @param userId - Firebase Auth user ID
 * @param updates - Partial user data to update
 */
export async function updateUserInFirestore(
  userId: string, 
  updates: Partial<UserData>
) {
  try {
    // ✅ Use db directly from import
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    console.log('✅ User data updated in Firestore');
    return true;
  } catch (error) {
    console.error('❌ Error updating user in Firestore:', error);
    throw error;
  }
}