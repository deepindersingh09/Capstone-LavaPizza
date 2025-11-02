import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { useRouter } from "expo-router";

export default function VehicleDetails() {
  const router = useRouter();
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [vehicleImage, setVehicleImage] = useState("");

  // For now we keep it static — no actual image picking yet
  const handleImageClick = (type: "profile" | "vehicle") => {
    Alert.alert(
      "Coming Soon!",
      `Static placeholder added for ${type === "profile" ? "profile photo" : "vehicle photo"} ✅`
    );

    if (type === "profile") setProfileImage("profile_placeholder.jpg");
    else setVehicleImage("vehicle_placeholder.jpg");
  };

  const handleSignupFinish = () => {
    if (!vehicleNumber.trim() || !profileImage || !vehicleImage) {
      return Alert.alert("Missing Info", "Please add all required details.");
    }

    Alert.alert("Signup Complete 🎉", "Redirecting to your dashboard...");

    // ✅ Navigate to agent dashboard
    router.replace("/agent/dashboard");
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/logo.png")} style={styles.logo} />

      <Text style={styles.heading}>Vehicle Verification</Text>
      <Text style={styles.subtext}>Add your vehicle details to complete your profile 🚚</Text>

      <TextInput
        style={styles.input}
        placeholder="Vehicle Number *"
        value={vehicleNumber}
        onChangeText={setVehicleNumber}
      />

      <Text style={styles.label}>Add Profile Photo *</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={() => handleImageClick("profile")}>
        <Text style={styles.uploadText}>
          {profileImage ? "✅ Profile Photo Added" : "Upload Profile Photo"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Add Vehicle Number Plate Photo *</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={() => handleImageClick("vehicle")}>
        <Text style={styles.uploadText}>
          {vehicleImage ? "✅ Vehicle Image Added" : "Upload Vehicle Image"}
        </Text>
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ffe38f",
    marginBottom: 20,
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
    marginBottom: 18,
  },
  uploadText: { color: "#666", fontWeight: "500" },
  button: { backgroundColor: "#f8a831", padding: 16, borderRadius: 14, alignItems: "center" },
  buttonText: { fontWeight: "700", fontSize: 16, color: "#222" },
});
