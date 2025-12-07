import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PrivacyPolicy() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.updated}>Last updated: November 2025</Text>

        <Text style={styles.sectionTitle}>Information We Collect</Text>
        <Text style={styles.paragraph}>
          We collect information you provide directly to us, including:
        </Text>
        <Text style={styles.bulletPoint}>• Name, email address, and phone number</Text>
        <Text style={styles.bulletPoint}>• Delivery address and payment information</Text>
        <Text style={styles.bulletPoint}>• Order history and preferences</Text>
        <Text style={styles.bulletPoint}>• Location data (with your permission)</Text>

        <Text style={styles.sectionTitle}>How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the information we collect to:
        </Text>
        <Text style={styles.bulletPoint}>• Process and deliver your orders</Text>
        <Text style={styles.bulletPoint}>• Communicate with you about orders and promotions</Text>
        <Text style={styles.bulletPoint}>• Improve our services and customer experience</Text>
        <Text style={styles.bulletPoint}>• Prevent fraud and ensure security</Text>

        <Text style={styles.sectionTitle}>Information Sharing</Text>
        <Text style={styles.paragraph}>
          We do not sell your personal information. We may share your information with:
        </Text>
        <Text style={styles.bulletPoint}>• Delivery partners to fulfill your order</Text>
        <Text style={styles.bulletPoint}>• Payment processors to handle transactions</Text>
        <Text style={styles.bulletPoint}>• Service providers who assist our operations</Text>

        <Text style={styles.sectionTitle}>Data Security</Text>
        <Text style={styles.paragraph}>
          We implement appropriate security measures to protect your personal information. However,
          no method of transmission over the internet is 100% secure.
        </Text>

        <Text style={styles.sectionTitle}>Your Rights</Text>
        <Text style={styles.paragraph}>
          You have the right to access, update, or delete your personal information. Contact us at
          privacy@lavapizzayyc.com to exercise these rights.
        </Text>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have questions about this Privacy Policy, please contact us at
          privacy@lavapizzayyc.com or +1 (403) 555-1234.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 20,
    marginBottom: 8,
  },
  updated: {
    fontSize: 13,
    color: "#888",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: "#333",
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 24,
    color: "#333",
    marginLeft: 10,
    marginBottom: 6,
  },
});
