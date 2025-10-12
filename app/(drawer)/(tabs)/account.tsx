// By Ravneet Kaur
import React from "react";
import { useRouter } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function Profile() {
  const router = useRouter();

  const options = [
    "Notifications",
    "General",
    "Payment",
    "Order History",
    "Track Order", 
    "Update Delivery Info",
  ];

  return (
    <View style={styles.container}>
      {/* Remove the custom header - the Tabs header will show */}
      
      {/* Profile */}
      <View style={styles.profileSection}>
        <Image
          source={require("../../../assets/images/profile_picture.png")}
          style={styles.profilepicture}
        />
        <View style={styles.profileText}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>Zaiden</Text>
            <TouchableOpacity>
              <MaterialIcons name="edit" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={styles.email}>zaiden.45@gmail.com</Text>
          <Text style={styles.phone}>8256981236</Text>
        </View>
      </View>

      {/* Options */}
      <View style={styles.options}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.optionRow}
            onPress={() => {
              if (option === "General") router.push("/general");
              else if (option === "Notifications")
                router.push("../../notification_setting");
              else if (option === "Payment") router.push("/payment");
              else if (option === "Order History")
                router.push("/orders");
              else if (option === "Track Order")
                router.push("../../../order_tracking/12345"); 
                // 👆 replace 12345 with actual orderId dynamically
              else if (option === "Update Delivery Info")
                router.push("/delivery_address");
            }}
          >
            <Text style={styles.optionText}>{option}</Text>
            <Ionicons name="chevron-forward" size={22} color="black" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => {/* signOut() */}}>
        <Text style={styles.logoutText}>Log Out of Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 16, // Changed from 40
  },
  // Remove header styles - they're not needed anymore
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  profilepicture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    marginLeft: 25,
  },
  profileText: { flex: 1, marginLeft: 10 },
  nameRow: { flexDirection: "row", alignItems: "center" },
  name: { fontSize: 20, fontWeight: "bold", marginRight: 8, marginLeft: 2 },
  email: { fontSize: 16, fontWeight: "600", marginLeft: 2 },
  phone: { fontSize: 16, fontWeight: "600", color: "gray", marginLeft: 2 },
  options: { borderTopWidth: 1, borderColor: "#ddd", marginBottom: 30 },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  optionText: { fontSize: 16 },
  logoutButton: {
    backgroundColor: "#FFD700",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: { fontSize: 16, fontWeight: "bold" },
});