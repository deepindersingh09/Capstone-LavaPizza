import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

// Enable smooth animation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Profile() {
  const [expanded, setExpanded] = useState<string | null>(null);

  // Section Data
  const sections = [
    {
      title: "Edit Availability",
      icon: "time-outline",
      description: "Manage when you’re available to take orders",
      features: [
        "Set specific time slots for availability",
        "Toggle on/off availability status",
        "Receive notifications for booking requests during available times",
        "Customize availability based on location or day of the week",
      ],
    },
    {
      title: "Notification Settings",
      icon: "notifications-outline",
      description: "Manage alerts and reminders",
      features: [
        "Customize notification preferences for order updates",
        "Set quiet hours for notifications to avoid disturbances",
        "Choose notification sounds for different types of alerts",
        "Enable push notifications for exclusive deals and promotions",
        "Integrate with calendar apps for order reminders",
      ],
    },
    {
      title: "Support & Help Center",
      icon: "help-circle-outline",
      description: "Get help, FAQs, and assistance",
      features: [
        "24/7 live chat support for immediate assistance",
        "Comprehensive FAQ section with troubleshooting tips",
        "Video tutorials for app navigation and common issues",
        "Feedback form for reporting bugs or suggesting improvements",
      ],
    },
  ];

  const toggleExpand = (title: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === title ? null : title);
  };

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
        {sections.map((section, index) => (
          <View key={index} style={styles.card}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => toggleExpand(section.title)}
            >
              <Ionicons name={section.icon as any} size={26} color="#f8a831" />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{section.title}</Text>
                <Text style={styles.desc}>{section.description}</Text>
              </View>
              <Ionicons
                name={
                  expanded === section.title
                    ? "chevron-up-outline"
                    : "chevron-down-outline"
                }
                size={22}
                color="#777"
              />
            </TouchableOpacity>

            {expanded === section.title && (
              <View style={styles.featureList}>
                {section.features.map((feature, i) => (
                  <View key={i} style={styles.featureItem}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={18}
                      color="#f8a831"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
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

  // --- Cards ---
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ffe38f",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  textContainer: { flex: 1, marginLeft: 12 },
  title: { fontSize: 16, fontWeight: "600", color: "#333" },
  desc: { fontSize: 13, color: "#777", marginTop: 2 },

  // --- Feature List ---
  featureList: {
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  featureText: {
    fontSize: 13.5,
    color: "#555",
    flexShrink: 1,
  },

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
