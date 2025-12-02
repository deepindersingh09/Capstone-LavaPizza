import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
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

  // Function to navigate to Payout flow
  const handlePayoutPress = () => {
    router.push("/agent/payout"); 
  };

  return (
    <View style={styles.mainContainer}>
      {/* Set StatusBar color to match header */}
      <StatusBar barStyle="dark-content" backgroundColor="#f0e249" />

      {/* --- Top Navbar Area (Yellow Background) --- */}
      <View style={styles.headerBackground}>
        <SafeAreaView>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            
            <Text style={styles.topTitle}>Earnings & Payouts</Text>
            
            {/* Wallet Icon - Navigates to Payout */}
            <TouchableOpacity onPress={handlePayoutPress}>
                <Ionicons name="wallet-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {/* --- Content Area --- */}
      <View style={styles.contentContainer}>
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

        {/* --- Payout Request Button - Navigates to Payout --- */}
        <TouchableOpacity style={styles.payoutBtn} onPress={handlePayoutPress}>
          <Text style={styles.payoutText}>Request Payout</Text>
        </TouchableOpacity>

        {/* --- Earning History --- */}
        <Text style={styles.sectionTitle}>Earning History</Text>
        
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={{ paddingBottom: 100 }} // padding for bottom bar
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
      </View>

      {/* --- Bottom Navigation Bar --- */}
      <View style={styles.bottomBarWrapper}>
         <View style={styles.bottomBar}>
            <TouchableOpacity onPress={() => router.push("/agent/dashboard")}>
              <Ionicons name="home-outline" size={24} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity>
              <MaterialIcons name="delivery-dining" size={28} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/agent/earnings")}>
              <Ionicons name="wallet" size={26} color="#f8a831" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/agent/profile")}>
              <Ionicons name="person-outline" size={26} color="#333" />
            </TouchableOpacity>
        </View>
        {/* Handle iPhone Home Indicator safe area */}
        <SafeAreaView edges={['bottom']} style={{backgroundColor: '#fff'}}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: "#fff9ed" 
  },
  contentContainer: {
    flex: 1,
  },

  // --- Header Styling ---
  headerBackground: {
    backgroundColor: "#f0e249",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, // Handle Android Status Bar
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  topTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: "#333",
    textAlign: 'center',
  },

  // --- Summary Section ---
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between", 
    marginTop: 20,
    paddingHorizontal: 20, 
  },
  summaryCard: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 12,
    width: "31%", 
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 15, 
    fontWeight: "800",
    color: "#222",
  },

  // --- Payout Button ---
  payoutBtn: {
    backgroundColor: "#f8a831",
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12, 
    elevation: 3,
    shadowColor: "#f8a831",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
  },
  payoutText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  // --- Section Title ---
  sectionTitle: {
    marginTop: 25,
    marginBottom: 12,
    marginLeft: 20,
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },

  // --- History Cards ---
  scrollArea: {
    flex: 1,
  },
  historyCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", 
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ffe38f",
    shadowColor: "#ffe38f",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
  },
  orderId: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  date: {
    color: "#888",
    fontSize: 12,
  },
  amount: {
    color: "#f8a831",
    fontSize: 15,
    fontWeight: "700",
  },

  // --- Bottom Navigation Bar ---
  bottomBarWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 0 : 12, 
  },
});