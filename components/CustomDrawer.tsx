// components/CustomDrawer.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const router = useRouter();
  const [userName, setUserName] = useState('Guest');
  const [isGuest, setIsGuest] = useState(false);

  // ✅ Load user's name when drawer opens
  useEffect(() => {
    loadUserName();
  }, []);

  // ✅ Reload name when drawer navigation state changes (e.g., after login)
  useEffect(() => {
    loadUserName();
  }, [props.state]);

  const loadUserName = async () => {
    try {
      console.log('🎨 CustomDrawer: Loading user name...');
      
      // Check if user is in guest mode FIRST
      const guestMode = await AsyncStorage.getItem('@guest_mode');
      console.log('🎨 Guest mode value:', guestMode);
      
      if (guestMode === '1') {
        console.log('🎨 User is in GUEST mode');
        setUserName('Guest');
        setIsGuest(true);
        return;
      }

      // Not guest mode, try to get user name
      let firstName = await AsyncStorage.getItem('@user_first_name');
      console.log('🎨 First name from AsyncStorage:', firstName);
      
      // If not in storage, try to get from Firebase auth
      if (!firstName && auth.currentUser?.displayName) {
        firstName = auth.currentUser.displayName;
        console.log('🎨 First name from Firebase Auth:', firstName);
        await AsyncStorage.setItem('@user_first_name', firstName);
      }

      // Check Firebase currentUser
      console.log('🎨 Firebase currentUser:', auth.currentUser?.email || 'Not logged in');

      if (firstName) {
        console.log('🎨 Setting user name to:', firstName);
        setUserName(firstName);
        setIsGuest(false);
      } else {
        console.log('🎨 No name found, defaulting to Guest');
        setUserName('Guest');
        setIsGuest(true);
      }
    } catch (e) {
      console.error('❌ Failed to load user name', e);
      setUserName('Guest');
      setIsGuest(true);
    }
  };

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      if (auth.currentUser) {
        await signOut(auth);
      }
      
      // Clear local storage
      await AsyncStorage.removeItem('@guest_mode');
      await AsyncStorage.removeItem('@user_first_name');
      await AsyncStorage.removeItem('@user_last_name');
      await AsyncStorage.removeItem('@order_mode');
      
      // Navigate to login
      router.replace('/auth/login');
    } catch (e) {
      console.warn('Logout failed', e);
    }
  };

  const menuItems = [
    { 
      icon: 'home-outline', 
      label: 'Home', 
      route: '/(drawer)/(tabs)/home',
      iconSet: 'Ionicons' as const
    },
    { 
      icon: 'pizza', 
      label: 'Menu', 
      route: '/(drawer)/(tabs)/specials',
      iconSet: 'MaterialCommunityIcons' as const
    },
    { 
      icon: 'heart-outline', 
      label: 'Favourites', 
      route: '/favourites',
      iconSet: 'Ionicons' as const
    },
    { 
      icon: 'wallet-outline', 
      label: 'Wallet', 
      route: '/wallet',
      iconSet: 'Ionicons' as const
    },
    { 
      icon: 'clipboard-text-outline', 
      label: 'Order History', 
      route: '/orders',
      iconSet: 'MaterialCommunityIcons' as const
    },
    { 
      icon: 'settings-outline', 
      label: 'Settings', 
      route: '/settings',
      iconSet: 'Ionicons' as const
    },
    { 
      icon: 'help-circle-outline', 
      label: 'Support', 
      route: '/support',
      iconSet: 'Ionicons' as const
    },
  ];

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      {/* Profile Section - NO IMAGE, JUST TEXT */}
      <View style={styles.profileSection}>
        <Text style={styles.greeting}>
          {isGuest ? 'Welcome,' : 'Hi,'}
        </Text>
        <Text style={styles.userName}>{userName}!</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => router.push(item.route as any)}
          >
            {item.iconSet === 'Ionicons' ? (
              <Ionicons name={item.icon as any} size={22} color="#333" />
            ) : (
              <MaterialCommunityIcons name={item.icon as any} size={22} color="#333" />
            )}
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#E53935" />
          <Text style={styles.logoutText}>
            {isGuest ? 'Exit Guest Mode' : 'Log Out'}
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileSection: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#FFF8E1',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE082',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E53935',
    marginTop: 2,
  },
  menuSection: {
    flex: 1,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutText: {
    fontSize: 16,
    color: '#E53935',
    marginLeft: 15,
    fontWeight: '600',
  },
});