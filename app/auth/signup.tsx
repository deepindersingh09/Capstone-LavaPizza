import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (!fullName || !email || !password) {
      alert("Please fill all fields");
      return;
    }
    console.log("Signup Data:", { fullName, email, password });
    router.push("/auth/login");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 🔙 Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Create Account</Text>

        {/* Input Fields */}
        <TextInput
          style={styles.input}
          placeholder="Full Name *"
          placeholderTextColor="#6b6b6b"
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email Address *"
          placeholderTextColor="#6b6b6b"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password *"
          placeholderTextColor="#6b6b6b"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* CTA Button */}
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Switch to Login */}
        <TouchableOpacity onPress={() => router.push("/auth/login")}>
          <Text style={styles.switchText}>
            Already have an account? <Text style={styles.loginText}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F0D9",
  },
  scrollContainer: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 22,
  },
  backButton: {
    position: "absolute",
    top: 28,
    left: 18,
    zIndex: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 35,
    textAlign: "center",
    color: "#222",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1a1a1a",
    marginBottom: 18,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  button: {
    backgroundColor: "#F0E249",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 15,
    elevation: 3,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
  },
  switchText: {
    textAlign: "center",
    marginTop: 18,
    fontSize: 15,
    color: "#222",
  },
  loginText: {
    fontWeight: "900",
    color: "#000",
  },
});
