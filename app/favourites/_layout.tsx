// app/favourites/_layout.tsx
import React from 'react';
import { Tabs, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function FavouritesLayout() {
  const navigation = useNavigation();

  return (
    <Tabs
      screenOptions={{
        // ✅ Show a header with custom styling
        headerShown: true,
        headerTitle: 'Favourites',
        headerTitleAlign: 'left',
        headerStyle: { backgroundColor: '#fbf3e6' },
        headerShadowVisible: false,

        // ✅ Add a back button to easily return to previous screen
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => (navigation as any).goBack()}
            style={{ paddingHorizontal: 12 }}
          >
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
        ),

        // ✅ Bottom tab styling
        tabBarStyle: {
          height: 60,
          backgroundColor: '#fbf3e6',
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#888',
      }}
    >
      {/* Default favourites tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />

      {/* "More" tab - could be used for recommendations or browsing */}
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
