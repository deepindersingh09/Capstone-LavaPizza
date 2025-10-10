import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {MaterialIcons, Ionicons} from "@expo/vector-icons"; 

export default function General() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState("Device");

  return (
    <View style={styles.container}>
      {/* Header */} 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="black"/>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>General</Text>
        <View style={{ width: 30 }} />
        {/* keeps title centered */}
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
            <MaterialIcons name={darkMode === option ? "radio-button-checked" : "radio-button-unchecked"} size={22} color="black"/>
          </TouchableOpacity>
        ))}
      </View>

      {/* Options Box */}
      <View style={styles.card}>
        {["About", "Rewards Terms", "Delete Account", "Privacy Policy"].map(
          (item, index) => (
            <TouchableOpacity key={index} style={styles.optionRow}>
              <Text
                style={[
                  styles.optionText,
                  item === "Delete Account" ? { color: "red" } : null,
                ]}
              >
                {item}
              </Text>
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

  backArrow: {
    fontSize: 26,
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

  arrow: {
    fontSize: 18,
    color: "gray",
  },
});
