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

export default function Earnings() {
  const earningHistory = [
    { id: "ORD-2345", date: "Nov 5, 2025", amount: "$14.50" },
    { id: "ORD-2338", date: "Nov 4, 2025", amount: "$21.00" },
    { id: "ORD-2324", date: "Nov 3, 2025", amount: "$17.75" },
    { id: "ORD-2309", date: "Nov 2, 2025", amount: "$19.25" },
    { id: "ORD-2301", date: "Nov 1, 2025", amount: "$16.00" },
  ];

  return (
    <View style={styles.container}>
      {/* --- Top Navbar --- */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Earnings & Payouts</Text>
        <Ionicons name="wallet-outline" size={24} color="#333" />
      </View>

      {/* --- Earnings Summary --- */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Today</Text>
          <Text style={styles.summaryAmount}>$58.00</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>This Week</Text>
          <Text style={styles.summaryAmount}>$340.00</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>This Month</Text>
          <Text style={styles.summaryAmount}>$1,280.00</Text>
        </View>
      </View>

      {/* --- Payout Request Button --- */}
      <TouchableOpacity style={styles.payoutBtn}>
        <Text style={styles.payoutText}>Request Payout</Text>
      </TouchableOpacity>

      {/* --- Earning History --- */}
      <Text style={styles.sectionTitle}>Earning History</Text>
      <ScrollView
        style={{ marginBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >
        {earningHistory.map((item, i) => (
          <View key={i} style={styles.historyCard}>
            <View>
              <Text style={styles.orderId}>{item.id}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={styles.amount}>{item.amount}</Text>
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

        <TouchableOpacity onPress={() => router.push("/agent/earnings")}>
          <Ionicons name="wallet" size={26} color="#f8a831" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/agent/profile")}>
          <Ionicons name="person" size={26} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff9ed" },

  // --- Top Navbar ---
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

  // --- Summary Section ---
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  summaryCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    width: "30%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#555",
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginTop: 4,
  },

  // --- Payout Button ---
  payoutBtn: {
    backgroundColor: "#f8a831",
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 3,
  },
  payoutText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  // --- Section Title ---
  sectionTitle: {
    marginTop: 25,
    marginBottom: 10,
    marginLeft: 20,
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },

  // --- History Cards ---
  historyCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ffe38f",
    elevation: 2,
  },
  orderId: {
    fontWeight: "600",
    color: "#333",
  },
  date: {
    color: "#777",
    fontSize: 13,
  },
  amount: {
    color: "#f8a831",
    fontWeight: "700",
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
