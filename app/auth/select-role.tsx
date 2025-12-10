import React from "react";
import { Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SelectRole() {
  const router = useRouter();

  const handleSelectRole = (role: string) => {
    if (role === "customer") {
      router.push("/auth/signup-customer");
    } else if (role === "delivery") {
      router.push("/auth/signup-delivery");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={26} color="#000" />
      </TouchableOpacity>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Select Your Role</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleSelectRole("customer")}>
        <Text style={styles.buttonText}>Customer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.lastButton]}
        onPress={() => handleSelectRole("delivery")}
      >
        <Text style={styles.buttonText}>Delivery Agent</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#F7F0D9",
    paddingHorizontal: 22,
    paddingTop: 60,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 15,
    zIndex: 10,
  },
  logo: {
    width: 150,
    height: 140,
    marginBottom: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#222",
    marginBottom: 28,
    textAlign: "center",
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#F0E249",
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 18,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  lastButton: {
    marginBottom: 0,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
  },
});
