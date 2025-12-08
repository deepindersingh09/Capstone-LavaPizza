import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function VehicleDetails() {
  const router = useRouter();
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [vehicleImage, setVehicleImage] = useState<string | null>(null);

  const handleImageClick = async (type: "profile" | "vehicle") => {
    // Ask user to choose between camera or gallery
    Alert.alert(
      "Select Photo",
      `Choose how to add your ${type === "profile" ? "profile photo" : "vehicle plate photo"}`,
      [
        {
          text: "Take Photo",
          onPress: () => openCamera(type),
        },
        {
          text: "Choose from Gallery",
          onPress: () => openGallery(type),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const openCamera = async (type: "profile" | "vehicle") => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Camera permission is needed to take photos.");
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === "profile" ? [1, 1] : [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      if (type === "profile") {
        setProfileImage(result.assets[0].uri);
      } else {
        setVehicleImage(result.assets[0].uri);
      }
    }
  };

  const openGallery = async (type: "profile" | "vehicle") => {
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Gallery access permission is needed to select photos.");
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === "profile" ? [1, 1] : [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      if (type === "profile") {
        setProfileImage(result.assets[0].uri);
      } else {
        setVehicleImage(result.assets[0].uri);
      }
    }
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
        placeholder="Enter Vehicle Number (e.g., ABC-1234)"
        placeholderTextColor="#888"
        value={vehicleNumber}
        onChangeText={setVehicleNumber}
        autoCapitalize="characters"
      />

      <Text style={styles.label}>Add Profile Photo *</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={() => handleImageClick("profile")}>
        {profileImage ? (
          <View style={styles.imagePreview}>
            <Image source={{ uri: profileImage }} style={styles.previewImage} />
            <View style={styles.changeOverlay}>
              <Ionicons name="camera" size={24} color="#fff" />
              <Text style={styles.changeText}>Tap to change</Text>
            </View>
          </View>
        ) : (
          <View style={styles.uploadContent}>
            <Ionicons name="camera-outline" size={40} color="#f8a831" />
            <Text style={styles.uploadText}>Upload Profile Photo</Text>
            <Text style={styles.uploadHint}>Tap to take photo or choose from gallery</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Add Vehicle Number Plate Photo *</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={() => handleImageClick("vehicle")}>
        {vehicleImage ? (
          <View style={styles.imagePreview}>
            <Image source={{ uri: vehicleImage }} style={styles.previewImage} />
            <View style={styles.changeOverlay}>
              <Ionicons name="camera" size={24} color="#fff" />
              <Text style={styles.changeText}>Tap to change</Text>
            </View>
          </View>
        ) : (
          <View style={styles.uploadContent}>
            <Ionicons name="car-outline" size={40} color="#f8a831" />
            <Text style={styles.uploadText}>Upload Vehicle Plate Photo</Text>
            <Text style={styles.uploadHint}>Tap to take photo or choose from gallery</Text>
          </View>
        )}
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
  heading: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
    color: "#f8a831",
  },
  subtext: { textAlign: "center", marginBottom: 20, color: "#555" },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ffe38f",
    marginBottom: 20,
    color: "#222",
    fontSize: 15,
  },
  label: { fontWeight: "bold", marginBottom: 6, color: "#444" },
  uploadBox: {
    height: 160,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#ffc23e",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff7da",
    marginBottom: 18,
    overflow: "hidden",
  },
  uploadContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: { color: "#666", fontWeight: "600", marginTop: 8, fontSize: 15 },
  uploadHint: {
    color: "#999",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  changeOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  changeText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#f8a831",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { fontWeight: "700", fontSize: 16, color: "#222" },
});
