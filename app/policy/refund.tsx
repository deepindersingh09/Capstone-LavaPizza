import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function RefundPolicy() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refunds & Cancellations</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={styles.title}>Refund & Cancellation Policy</Text>
        <Text style={styles.updated}>Last updated: November 2025</Text>

        <Text style={styles.sectionTitle}>Order Cancellations</Text>
        <Text style={styles.paragraph}>
          You may cancel your order within 5 minutes of placing it for a full refund. After this
          window, cancellations may incur a fee depending on the preparation stage.
        </Text>

        <Text style={styles.sectionTitle}>Refund Eligibility</Text>
        <Text style={styles.paragraph}>
          We offer full refunds in the following cases:
        </Text>
        <Text style={styles.bulletPoint}>• Incorrect or missing items</Text>
        <Text style={styles.bulletPoint}>• Food quality issues</Text>
        <Text style={styles.bulletPoint}>• Significant delivery delays (over 60 minutes)</Text>
        <Text style={styles.bulletPoint}>• Order never arrived</Text>

        <Text style={styles.sectionTitle}>Refund Processing</Text>
        <Text style={styles.paragraph}>
          Approved refunds are processed within 5-7 business days to your original payment method.
          For credit card payments, please allow an additional 2-3 business days for the credit to
          appear on your statement.
        </Text>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about refunds or cancellations, please contact our support team
          at support@lavapizzayyc.com or call +1 (403) 555-1234.
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
