import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Profile() {
  const sections = [
    {
      title: "Edit Availability",
      icon: "time-outline",
      description: "Set your work schedule",
    },
    {
      title: "Notification Settings",
      icon: "notifications-outline",
      description: "Manage alerts",
    },
    {
      title: "Support & Help Center",
      icon: "help-circle-outline",
      description: "Get help or contact support",
    },
  ];

  return (
    <View style={styles.container}>
      {/* --- Top Navbar --- */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Profile Settings</Text>
        <Ionicons name="settings-outline" size={24} color="#333" />
      </View>

      {/* --- Main Content --- */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {sections.map((item, i) => (
          <TouchableOpacity key={i} style={styles.card}>
            <Ionicons name={item.icon as any} size={26} color="#f8a831" />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#777" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* --- Bottom Navigation Bar --- */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => router.push("/agent/dashboard")}>
          <Ionicons name="home-outline" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity>
          <MaterialIcons name="delivery-dining" size={26} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/agent/profile")}>
          <Ionicons name="person" size={26} color="#f8a831" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff9ed" },

  // --- Top Bar ---
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#f0e249",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  topTitle: { fontSize: 18, fontWeight: "700", color: "#333" },

  // --- Scroll Content ---
  scroll: { padding: 20, paddingBottom: 90 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ffe38f",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  textContainer: { flex: 1, marginLeft: 12 },
  title: { fontSize: 16, fontWeight: "600", color: "#333" },
  desc: { fontSize: 13, color: "#777", marginTop: 2 },

  // --- Bottom Navigation Bar ---
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    elevation: 8,
  },
});
