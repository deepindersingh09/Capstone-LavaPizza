// app/auth/adminDetails.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { router } from "expo-router";

export default function AdminDetails() {
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const handleSignup = () => {
    if (!restaurantName || !restaurantAddress) {
      return Alert.alert("Missing info", "Enter all required fields.");
    }

    Alert.alert("Signup Completed ✅", "Static signup successful for now!");
    router.replace("/auth/login");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
      />

      <Text style={styles.heading}>Restaurant Details</Text>
      <Text style={styles.subtext}>Complete your admin profile</Text>

      {/* Profile Image Placeholder */}
      <TouchableOpacity
        style={styles.imageUpload}
        onPress={() => Alert.alert("Info", "Image upload will work later.")}
      >
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImg} />
        ) : (
          <Text style={{ color: "#555" }}>Upload Manager Photo</Text>
        )}
      </TouchableOpacity>

      {/* Restaurant Name */}
      <TextInput
        style={styles.input}
        placeholder="Restaurant Name *"
        value={restaurantName}
        onChangeText={setRestaurantName}
      />

      {/* Restaurant Address */}
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Restaurant Address *"
        value={restaurantAddress}
        onChangeText={setRestaurantAddress}
        multiline
      />

      {/* Signup Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Already have an account?{" "}
        <Text
          style={styles.footerLink}
          onPress={() => router.push("/auth/login")}
        >
          Sign in
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff7e6", padding: 24, justifyContent: "center" },
  logo: { width: 110, height: 110, alignSelf: "center", marginBottom: 10 },
  heading: { fontSize: 24, fontWeight: "700", textAlign: "center", color: "#f8a831" },
  subtext: { textAlign: "center", marginBottom: 20, color: "#444" },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ffe38f",
    marginBottom: 14,
  },

  imageUpload: {
    width: 140,
    height: 140,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#f8a831",
    borderRadius: 75,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  profileImg: { width: "100%", height: "100%", borderRadius: 75 },

  button: {
    backgroundColor: "#f8a831",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: { fontWeight: "700", fontSize: 16, color: "#222" },

  footerText: { textAlign: "center", marginTop: 16, color: "#555" },
  footerLink: { color: "#d47b00", fontWeight: "700" },
});
