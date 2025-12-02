import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomDrawer(props: any) {
  const router = useRouter();
  const [userName, setUserName] = useState('Guest');

  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const guestMode = await AsyncStorage.getItem('@guest_mode');
      if (guestMode === '1') {
        setUserName('Guest');
        return;
      }
      const firstName = await AsyncStorage.getItem('@user_first_name');
      setUserName(firstName || 'User');
    } catch (e) {
      console.warn('Failed to load user name', e);
    }
  };

  const menuItems = [
    {
      icon: 'home-outline',
      label: 'Home',
      route: '/(drawer)/(tabs)/home',
    },
    {
      icon: 'restaurant-outline',
      label: 'Menu',
      route: '/menu/categories',
    },
    {
      icon: 'cart-outline',
      label: 'Cart',
      route: '/(drawer)/(tabs)/cart',
    },
    {
      icon: 'wallet-outline', // ✅ WALLET OPTION
      label: 'My Wallet',
      route: '/wallet',
    },
    {
      icon: 'heart-outline',
      label: 'Favorites',
      route: '/favourites',
    },
    {
      icon: 'time-outline',
      label: 'Order History',
      route: '/orders',
    },
    {
      icon: 'settings-outline',
      label: 'Settings',
      route: '/settings',
    },
    {
      icon: 'information-circle-outline',
      label: 'About',
      route: '/about',
    },
    {
      icon: 'help-circle-outline',
      label: 'Support',
      route: '/support',
    },
    {
  icon: 'chatbubbles-outline',
  label: 'Lava Assistant',
  route: '/chat',
  iconSet: 'Ionicons' as const
},

  ];

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.welcomeText}>Hi, {userName}!</Text>
        <Text style={styles.subtitle}>What would you like to order?</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              try {
                router.push(item.route as any);
              } catch (e) {
                console.error('Navigation error:', e);
              }
            }}
            activeOpacity={0.7}
          >
            <Ionicons name={item.icon as any} size={22} color="#E53935" />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#FFF8E1',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE082',
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  menuSection: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  version: {
    fontSize: 12,
    color: '#999',
  },
});