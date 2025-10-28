// app/auth/vehicleDetails.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { router } from "expo-router";

export default function VehicleDetails() {
  const [vehicleNumber, setVehicleNumber] = useState("");

  const handleSignupFinish = () => {
    if (!vehicleNumber.trim()) {
      return Alert.alert("Missing Info", "Please enter vehicle number.");
    }

    Alert.alert("Coming Soon!", "Image upload feature will be added soon ✅");

    // For now, redirect to login
    router.replace("/auth/login");
  };

  const handleImageClick = () => {
    Alert.alert("Coming Soon!", "Image selection feature will be added!");
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/logo.png")} style={styles.logo} />

      <Text style={styles.heading}>Vehicle Verification</Text>
      <Text style={styles.subtext}>We need your vehicle details to verify your profile 🚚</Text>

      <TextInput
        style={styles.input}
        placeholder="Vehicle Number *"
        value={vehicleNumber}
        onChangeText={setVehicleNumber}
      />

      {/* Upload UI */}
      <Text style={styles.label}>Add Profile Photo *</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={handleImageClick}>
        <Text style={styles.uploadText}>Upload Profile Photo</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Add Vehicle Number Plate Photo *</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={handleImageClick}>
        <Text style={styles.uploadText}>Upload Vehicle Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSignupFinish}>
        <Text style={styles.buttonText}>Finish Signup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fffaf0", padding: 24, justifyContent: "center" },
  logo: { width: 115, height: 115, alignSelf: "center", marginBottom: 14 },
  heading: { fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 4, color: "#f8a831" },
  subtext: { textAlign: "center", marginBottom: 20, color: "#555" },
  input: {
    backgroundColor: "#fff", borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: "#ffe38f", marginBottom: 20
  },
  label: { fontWeight: "bold", marginBottom: 6, color: "#444" },
  uploadBox: {
    height: 120,
    borderWidth: 1,
    borderColor: "#ffc23e",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff7da",
    marginBottom: 18
  },
  uploadText: { color: "#666" },
  button: { backgroundColor: "#f8a831", padding: 16, borderRadius: 14, alignItems: "center" },
  buttonText: { fontWeight: "700", fontSize: 16, color: "#222" }
});
