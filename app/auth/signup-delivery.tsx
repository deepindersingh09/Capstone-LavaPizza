// app/auth/signup-delivery.tsx
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function SignupDelivery() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleContinue = () => {
    if (!firstName || !email || !password || !vehicleType)
      return Alert.alert("Missing info", "Enter required fields.");

    if (password.length < 6)
      return Alert.alert("Weak password", "Min 6 characters.");

    if (password !== confirm)
      return Alert.alert("Passwords do not match");

    // ✅ Move to Next Page & Send Step1 details
    router.push({
      pathname: "/auth/vehicleDetails",
      params: {
        firstName,
        email,
        password,
        vehicleType
      }
    });
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />

      <Text style={styles.heading}>Delivery Agent Signup</Text>
      <Text style={styles.subtext}>Join our fast delivery team</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name *"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address *"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.inputIconWrap}>
        <TextInput
          style={styles.inputFlex}
          placeholder="Password *"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#444" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputIconWrap}>
        <TextInput
          style={styles.inputFlex}
          placeholder="Confirm Password *"
          secureTextEntry={!showConfirmPassword}
          value={confirm}
          onChangeText={setConfirm}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={22} color="#444" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Vehicle Type (Bike / Scooter / Car) *"
        value={vehicleType}
        onChangeText={setVehicleType}
      />

      <TouchableOpacity style={[styles.button, busy && { opacity: 0.6 }]} onPress={handleContinue}>
        <Text style={styles.buttonText}>{busy ? "Processing..." : "Continue"}</Text>
      </TouchableOpacity>

      <Text style={styles.signInText}>
        Already have an account?{" "}
        <Link href="/auth/login" style={styles.signInLink}>Sign in</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fffaf0", padding: 24, justifyContent: "center" },
  logo: { width: 115, height: 115, alignSelf: "center", marginBottom: 14 },
  heading: { fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 4, color: "#f8a831" },
  subtext: { textAlign: "center", marginBottom: 20, color: "#555" },
  input: { backgroundColor: "#fff", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#ffe38f", marginBottom: 14 },
  inputIconWrap: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 12,
    borderWidth: 1, borderColor: "#ffe38f",
    paddingRight: 12, marginBottom: 14
  },
  inputFlex: { flex: 1, padding: 14 },
  button: { backgroundColor: "#f8a831", padding: 16, borderRadius: 14, alignItems: "center" },
  buttonText: { fontWeight: "700", fontSize: 16, color: "#222" },
  signInText: { textAlign: "center", marginTop: 18, color: "#444" },
  signInLink: { color: "#d47b00", fontWeight: "700" }
});
