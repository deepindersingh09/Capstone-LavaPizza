import React from 'react';
import { Stack } from 'expo-router';

export default function OrdersLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: 'Orders',
        headerStyle: { backgroundColor: '#fbf3e6' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" options={{ title: 'Order Status' }} />
    </Stack>
  );
}
