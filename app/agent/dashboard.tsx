import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Dashboard() {
  const userName = "John Doe"; // dynamically replace this later with logged-in user’s name

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="menu" size={24} color="#000" />
        <Text style={styles.headerTitle}>Delivery Dashboard</Text>
        <Ionicons name="notifications-outline" size={22} color="#000" />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Welcome Message */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome, {userName} 👋</Text>
          <Text style={styles.subWelcome}>
            Ready for your next delivery today?
          </Text>
        </View>

        {/* Active Deliveries with Routing */}
        <TouchableOpacity onPress={() => router.push("/agent/activeDeliveries")}>
          <Text style={styles.sectionTitle}>Active Deliveries</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardText}>Order #12345</Text>
          <Text style={styles.subText}>Restaurant: Pizza Point</Text>
          <Text style={styles.subText}>Customer: Alex Johnson</Text>
          <Text style={styles.subText}>ETA: 15 mins</Text>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionText}>Accept / Reject</Text>
          </TouchableOpacity>
        </View>

        {/* Delivery Progress */}
        <Text style={styles.sectionTitle}>Delivery Progress</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}></View>
        </View>
        <View style={styles.progressLabels}>
          <Text>Accepted</Text>
          <Text>On Way</Text>
          <Text>Delivered</Text>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Text style={styles.secondaryText}>Update Status</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryOutline}>
            <Text style={styles.secondaryOutlineText}>Send Live Location</Text>
          </TouchableOpacity>
        </View>

        {/* Earnings */}
        <Text style={styles.sectionTitle}>Earnings</Text>
        <View style={styles.card}>
          <Text style={styles.subText}>Today's Earnings: $58.00</Text>
          <Text style={styles.subText}>Weekly Earnings: $340.00</Text>
          <View style={styles.rowBetween}>
            <TouchableOpacity style={styles.actionBtnSmall}>
              <Text style={styles.actionText}>Payout Request</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.linkText}>View Full History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/agent/dashboard")}>
          <Ionicons name="home" size={26} color="#f8a831" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="bicycle" size={26} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/agent/earnings")}>
          <Ionicons name="wallet" size={26} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/agent/profile")}>
          <Ionicons name="person" size={26} color="#999" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 0.3,
    borderColor: "#ddd",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  welcomeContainer: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },
  subWelcome: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  cardText: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 4,
  },
  subText: {
    color: "#444",
    fontSize: 13,
    marginBottom: 2,
  },
  actionBtn: {
    backgroundColor: "#f8a831",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  actionBtnSmall: {
    backgroundColor: "#f8a831",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  actionText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "#f3f3f3",
    borderRadius: 3,
    marginVertical: 10,
  },
  progressBar: {
    width: "40%",
    height: "100%",
    backgroundColor: "#f0e249",
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  secondaryBtn: {
    backgroundColor: "#f8a831",
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  secondaryOutline: {
    borderWidth: 1,
    borderColor: "#f8a831",
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
  },
  secondaryText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  secondaryOutlineText: {
    color: "#f8a831",
    textAlign: "center",
    fontWeight: "600",
  },
  linkText: {
    color: "#f8a831",
    fontWeight: "600",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderColor: "#ddd",
  },
});
