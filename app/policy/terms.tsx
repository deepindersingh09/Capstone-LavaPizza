import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TermsOfService() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.updated}>Last updated: November 2025</Text>

        <Text style={styles.sectionTitle}>Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing and using Lava Pizza YYC's services, you accept and agree to be bound by
          these Terms of Service. If you do not agree to these terms, please do not use our
          services.
        </Text>

        <Text style={styles.sectionTitle}>Use of Service</Text>
        <Text style={styles.paragraph}>
          You agree to use our service only for lawful purposes and in accordance with these Terms.
          You must not:
        </Text>
        <Text style={styles.bulletPoint}>
          • Use the service in any way that violates applicable laws
        </Text>
        <Text style={styles.bulletPoint}>• Impersonate any person or entity</Text>
        <Text style={styles.bulletPoint}>
          • Interfere with or disrupt the service or servers
        </Text>
        <Text style={styles.bulletPoint}>• Attempt to gain unauthorized access</Text>

        <Text style={styles.sectionTitle}>Orders and Payments</Text>
        <Text style={styles.paragraph}>
          All orders are subject to acceptance and availability. Prices are subject to change
          without notice. Payment must be made at the time of order placement.
        </Text>

        <Text style={styles.sectionTitle}>Delivery</Text>
        <Text style={styles.paragraph}>
          We strive to deliver orders within the estimated time. However, delivery times are
          estimates and may vary due to factors beyond our control.
        </Text>

        <Text style={styles.sectionTitle}>Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          Lava Pizza YYC shall not be liable for any indirect, incidental, special, or consequential
          damages arising out of or in connection with our services.
        </Text>

        <Text style={styles.sectionTitle}>Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify these terms at any time. Continued use of the service after
          changes constitutes acceptance of the modified terms.
        </Text>

        <Text style={styles.sectionTitle}>Contact Information</Text>
        <Text style={styles.paragraph}>
          For questions about these Terms of Service, please contact us at legal@lavapizzayyc.com or
          +1 (403) 555-1234.
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
