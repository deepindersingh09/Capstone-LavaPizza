import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DrawerToggleButton } from '@react-navigation/drawer';

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerTitle: '',
        headerShadowVisible: false,
        headerLeft: () => <DrawerToggleButton />,
        headerRight: () => (
          <Pressable
            onPress={() => router.push('/(drawer)/(tabs)/home/notification')}
            style={{ marginRight: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={22} />
          </Pressable>
        ),
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#5D4037', // Dark brown for active tab
        tabBarInactiveTintColor: '#777',  // Gray for inactive tabs
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="specials"
        options={{
          title: 'Specials',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pricetags-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="home/notification"
        options={{
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
