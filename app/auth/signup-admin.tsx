// app/auth/signup-admin.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";

export default function SignupAdmin() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleContinue = () => {
    if (!fullName || !email || !password) {
      Alert.alert("Missing info", "Please fill all fields!");
      return;
    }
router.push("./adminDetails");
// ✅ Working static navigation
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={26} color="#333" />
      </TouchableOpacity>

      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.heading}>Create Admin Account</Text>
      <Text style={styles.subtext}>Get started now!</Text>

      <TextInput
        placeholder="Full Name *"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email *"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      {/* Password field with icon */}
      <View style={styles.inputIconWrap}>
        <TextInput
          placeholder="Password *"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          style={styles.inputFlex}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={22}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <Text style={styles.signInText}>
        Already have an account?{" "}
        <Text
          style={styles.signInLink}
          onPress={() => router.replace("/auth/login")}
        >
          Sign In
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffaf0",
    padding: 24,
    justifyContent: "center",
  },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 8,
    borderRadius: 50,
    backgroundColor: "#ffffff90",
  },
  logo: {
    width: 115,
    height: 115,
    alignSelf: "center",
    marginBottom: 14,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    color: "#f8a831",
  },
  subtext: {
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ffe38f",
    marginBottom: 14,
  },
  inputIconWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ffe38f",
    paddingRight: 12,
    marginBottom: 14,
  },
  inputFlex: { flex: 1, padding: 14 },
  button: {
    backgroundColor: "#f8a831",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#222",
  },
  signInText: {
    textAlign: "center",
    marginTop: 18,
    color: "#444",
  },
  signInLink: {
    color: "#d47b00",
    fontWeight: "700",
  },
});
