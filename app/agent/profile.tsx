import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";


export default function Profile() {
  const sections = [
    { title: "Edit Availability", icon: "time-outline", description: "Set your work schedule" },
    { title: "Notification Settings", icon: "notifications-outline", description: "Manage alerts" },
    { title: "Support & Help Center", icon: "help-circle-outline", description: "Get help or contact support" },
  ];

  return (
    <View style={styles.container}>
      

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

     
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff9ed" },
  scroll: { padding: 20, paddingBottom: 80 },
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
});
