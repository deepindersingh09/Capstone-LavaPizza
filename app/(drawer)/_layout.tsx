// app/(drawer)/_layout.tsx
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomDrawer from '@/components/CustomDrawer';
import { Stack } from "expo-router";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawer {...props} />}
        defaultStatus="closed"
        screenOptions={{
          headerShown: false,
          drawerType: 'front',
          swipeEnabled: true,
        }}
      >
        <Drawer.Screen name="(tabs)" options={{ title: 'Home' }} />
        {/* other drawer pages (if they live under app/(drawer)/...) */}
      </Drawer>
    </GestureHandlerRootView>
  );
}
