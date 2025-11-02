import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

export default function DeliveryAgentDashboard() {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-width))[0];

  const [agent] = useState({
    name: "John Doe",
    email: "john.doe@gmail.com",
    phone: "+1 234 567 890",
    vehicle: "PB10-AB-2345",
    profileImage: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
  });

  const toggleMenu = () => {
    Animated.timing(slideAnim, {
      toValue: menuVisible ? -width : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setMenuVisible(!menuVisible);
  };

  return (
    <View style={styles.mainContainer}>
      {/* 🟨 Side Menu */}
      <Animated.View
        style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}
      >
        <View style={styles.menuHeader}>
          <Image source={{ uri: agent.profileImage }} style={styles.menuAvatar} />
          <Text style={styles.menuName}>{agent.name}</Text>
          <Text style={styles.menuEmail}>{agent.email}</Text>
        </View>
        <View style={styles.menuItems}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="home-outline" size={22} color="#333" />
            <Text style={styles.menuText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="cash-outline" size={22} color="#333" />
            <Text style={styles.menuText}>Earnings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={22} color="#333" />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={22} color="#333" />
            <Text style={styles.menuText}>Help Center</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, { borderTopWidth: 1, borderColor: "#eee" }]}
            onPress={() => router.replace("/auth/login")}
          >
            <Ionicons name="log-out-outline" size={22} color="red" />
            <Text style={[styles.menuText, { color: "red" }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* 🟨 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu-outline" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Dashboard</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={26} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 🟨 Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: agent.profileImage }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{agent.name}</Text>
            <Text style={styles.text}>{agent.phone}</Text>
            <Text style={styles.text}>Vehicle: {agent.vehicle}</Text>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push("/auth/signup-delivery")}
          >
            <MaterialIcons name="edit" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Active Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Deliveries</Text>
          <View style={styles.card}>
            <Text style={styles.orderTitle}>Order #12345</Text>
            <Text>Restaurant: Pizza Point</Text>
            <Text>Customer: Alex Johnson</Text>
            <Text>ETA: 15 mins</Text>
            <TouchableOpacity style={styles.btnYellow}>
              <Text style={styles.btnText}>Accept / Reject</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Progress</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressFill}></View>
          </View>
          <View style={styles.progressSteps}>
            <Text>Accepted</Text>
            <Text>On Way</Text>
            <Text>Delivered</Text>
          </View>
          <View style={styles.progressButtons}>
            <TouchableOpacity style={styles.btnYellow}>
              <Text style={styles.btnText}>Update Status</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOutline}>
              <Text style={styles.btnOutlineText}>Send Live Location</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Earnings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earnings</Text>
          <View style={styles.card}>
            <Text>Today’s Earnings: $58.00</Text>
            <Text>Weekly Earnings: $340.00</Text>
            <View style={styles.row}>
              <TouchableOpacity style={styles.btnYellow}>
                <Text style={styles.btnText}>Payout Request</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.link}>View Full History</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 🟨 Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="home" size={26} color="#f8a831" />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="bicycle-outline" size={26} color="#555" />
          <Text style={styles.navText}>Deliveries</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="cash-outline" size={26} color="#555" />
          <Text style={styles.navText}>Earnings</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person-outline" size={26} color="#555" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#FFF8E1" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#fff",
    elevation: 4,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#000" },
  scrollContainer: { padding: 16, paddingBottom: 90 },

  /* Side Menu */
  sideMenu: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: "#fff",
    zIndex: 10,
    elevation: 5,
    paddingTop: 60,
  },
  menuHeader: { alignItems: "center", marginBottom: 20 },
  menuAvatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  menuName: { fontWeight: "700", fontSize: 16 },
  menuEmail: { color: "#777", fontSize: 13 },
  menuItems: { paddingHorizontal: 20 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
  },
  menuText: { fontSize: 15, color: "#333" },

  /* Profile Card */
  profileCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: { width: 70, height: 70, borderRadius: 35, marginRight: 14 },
  profileInfo: { flex: 1 },
  name: { fontSize: 18, fontWeight: "600", color: "#000" },
  text: { color: "#555" },
  editBtn: {
    backgroundColor: "#f8a831",
    padding: 8,
    borderRadius: 8,
  },

  /* Sections */
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  orderTitle: { fontWeight: "600", fontSize: 16 },
  btnYellow: {
    backgroundColor: "#f8a831",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  btnText: { color: "#fff", fontWeight: "600" },
  progressBar: {
    height: 8,
    backgroundColor: "#f0e249",
    borderRadius: 8,
    marginVertical: 10,
    width: "100%",
  },
  progressFill: { width: "45%", height: "100%", backgroundColor: "#f8a831", borderRadius: 8 },
  progressSteps: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressButtons: { flexDirection: "row", justifyContent: "space-between" },
  btnOutline: {
    borderColor: "#f8a831",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnOutlineText: { color: "#f8a831", fontWeight: "600" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  link: { color: "#f8a831", fontWeight: "600" },

  /* Bottom Nav */
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    elevation: 10,
  },
  navText: { fontSize: 12, color: "#555" },
  navTextActive: { fontSize: 12, color: "#f8a831", fontWeight: "600" },
});
