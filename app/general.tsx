import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {MaterialIcons, Ionicons} from "@expo/vector-icons"; 

export default function General() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState("Device");

  return (
    <View style={styles.container}>
      {/* Header */ }
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(drawer)/(tabs)/account')}>
          <Ionicons name="arrow-back" size={28} color="black"/>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>General</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Dark Mode Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dark Mode</Text>

        {["On", "Off"].map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.optionRow}
            onPress={() => setDarkMode(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
            <MaterialIcons 
              name={darkMode === option ? "radio-button-checked" : "radio-button-unchecked"} 
              size={22} 
              color="black"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Options Box */}
      <View style={styles.card}>
        {["About", "Rewards Terms", "Delete Account", "Privacy Policy"].map(
          (item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.optionRow}
              onPress={() => {
                if (item === "About") {
                  router.push("/about");
                } else if (item === "Rewards Terms") {
                  router.push("/rewards");
                } else if (item === "Privacy Policy") {
                  router.push("/privacy");
                } else if (item === "Delete Account") {
                  // Handle delete account
                }
                // Add other handlers as needed
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  item === "Delete Account" ? { color: "red" } : null,
                ]}
              >
                {item}
              </Text>
              {/* Add chevron icon for navigation items */}
              {item !== "Delete Account" && (
                <Ionicons name="chevron-forward" size={22} color="#666" />
              )}
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#f7f6f6ff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 20,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
  },
});