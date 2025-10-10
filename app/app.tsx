import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './(drawer)/(tabs)/home';
import PickupScreen from './pickup_location';

export type RootStackParamList = {
  Home: undefined;
  Menu: { categoryId?: string };
  Item: { itemId: string };
  Pickup: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Pickup" component={PickupScreen} options={{ title: 'Pickup' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
