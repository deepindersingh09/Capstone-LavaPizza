import React from "react";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerTitle: "", headerShadowVisible: false }}>
      <Stack.Screen name="login" options={{ title: "Login", headerBackVisible: false }} />
      <Stack.Screen name="signup" options={{ title: "Sign up", headerBackVisible: true }} />
    </Stack>
  );
}
