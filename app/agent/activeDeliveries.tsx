// File: app/agent/activeDeliveries.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ActiveDeliveries() {
  const [status, setStatus] = useState("Pending");

  const handleAccept = () => {
    setStatus("Accepted");
    Alert.alert("Delivery Accepted", "You have accepted this delivery!");
  };

  const handleReject = () => {
    Alert.alert(
      "Reject Delivery",
      "Please provide a reason for rejecting this order."
    );
  };

  return (
    <View style={styles.container}>
      {/* --- Top Navbar --- */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Active Deliveries</Text>
        <Ionicons name="bicycle-outline" size={24} color="#333" />
      </View>

      {/* --- Delivery Info --- */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.orderId}>Order #12345</Text>
          <Text style={styles.info}>Restaurant: Pizza Point</Text>
          <Text style={styles.info}>Customer: Alex Johnson</Text>
          <Text style={styles.info}>ETA: 15 mins</Text>
          <Text style={styles.status}>Status: {status}</Text>

          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#f8a831" }]}
              onPress={handleAccept}
            >
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#ffe38f" }]}
              onPress={handleReject}
            >
              <Text style={[styles.btnText, { color: "#333" }]}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Delivery Tracking Features --- */}
        <Text style={styles.sectionTitle}>Delivery Features</Text>

        <View style={styles.featureCard}>
          <Ionicons name="map-outline" size={24} color="#f8a831" />
          <Text style={styles.featureText}>
            Real-time tracking and route information.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Ionicons name="chatbubbles-outline" size={24} color="#f8a831" />
          <Text style={styles.featureText}>
            In-app messaging with customer support.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Ionicons name="navigate-circle-outline" size={24} color="#f8a831" />
          <Text style={styles.featureText}>
            Voice-guided GPS navigation for easy delivery.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <MaterialIcons name="access-time" size={24} color="#f8a831" />
          <Text style={styles.featureText}>
            Negotiate delivery times and update ETA dynamically.
          </Text>
        </View>
      </ScrollView>

      {/* --- Bottom Navigation Bar --- */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => router.push("/agent/dashboard")}>
          <Ionicons name="home-outline" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity>
          <MaterialIcons name="delivery-dining" size={26} color="#f8a831" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/agent/earnings")}>
          <Ionicons name="wallet-outline" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/agent/profile")}>
          <Ionicons name="person-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff9ed" },
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
  scroll: { padding: 20, paddingBottom: 90 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ffe38f",
    marginBottom: 16,
    elevation: 2,
  },
  orderId: { fontSize: 18, fontWeight: "700", color: "#333" },
  info: { fontSize: 14, color: "#666", marginTop: 4 },
  status: {
    marginTop: 10,
    fontWeight: "600",
    color: "#f8a831",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 14,
  },
  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
    color: "#333",
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ffe38f",
  },
  featureText: { marginLeft: 12, color: "#555", fontSize: 14 },
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
