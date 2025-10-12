import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function OrdersLayout() {
  const router = useRouter();
  
  return (
    <Stack
      screenOptions={{
        headerTitle: 'Orders',
        headerStyle: { backgroundColor: '#fbf3e6' },
        headerShadowVisible: false,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.push('/(drawer)/(tabs)/account')}
            style={{ paddingHorizontal: 12 }}
          >
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" options={{ title: 'Order Status' }} />
    </Stack>
  );
}