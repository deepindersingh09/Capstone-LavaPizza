import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DeliveryLayout() {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerTitle: 'Delivery',
        headerStyle: { backgroundColor: '#FFF5D7' },
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '600' },
        headerLeft: () => (
          <TouchableOpacity style={{ paddingHorizontal: 8 }} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} />
          </TouchableOpacity>
        ),
      }}
    />
  );
}
