import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar, Platform } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

// Mock Data for Pizza App Notifications
const NOTIFICATIONS = [
  { id: '1', title: 'New Order Assigned', message: 'Order #12345 is ready for pickup at Pizza Point.', time: '2m ago', type: 'order' },
  { id: '2', title: 'Big Tip Received! 💰', message: 'You received a $10.00 tip from Alex Johnson.', time: '15m ago', type: 'money' },
  { id: '3', title: 'High Demand Area', message: 'Downtown is currently busy. +$2.00 peak pay active.', time: '1h ago', type: 'info' },
  { id: '4', title: 'Shift Reminder', message: 'Your shift starts in 2 hours.', time: '3h ago', type: 'system' },
  { id: '5', title: 'Weekly Payout', message: '$340.00 has been transferred to your wallet.', time: '1d ago', type: 'money' },
];

export default function Notifications() {

  const renderItem = ({ item }: { item: any }) => {
    let iconName: any = "bell-outline";
    let iconColor = "#555";
    let bgIcon = "#f0f0f0";

    // Customize icons based on notification type
    if (item.type === 'order') { iconName = "pizza"; iconColor = "#f8a831"; bgIcon = "#fff4e0"; }
    else if (item.type === 'money') { iconName = "cash"; iconColor = "#4CAF50"; bgIcon = "#e8f5e9"; }
    else if (item.type === 'info') { iconName = "information"; iconColor = "#2196F3"; bgIcon = "#e3f2fd"; }

    return (
      <View style={styles.card}>
        <View style={[styles.iconBox, { backgroundColor: bgIcon }]}>
          <MaterialCommunityIcons name={iconName} size={24} color={iconColor} />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <Text style={styles.message}>{item.message}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0e249" />
      
      {/* Header */}
      <View style={styles.header}>
        <SafeAreaView>
            <View style={styles.headerContent}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 24 }} /> 
            </View>
        </SafeAreaView>
      </View>

      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff9ed" },
  header: {
    backgroundColor: "#f0e249",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    elevation: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#333" },
  backBtn: { padding: 4 },
  
  listContent: { padding: 20 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  textContainer: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: { fontSize: 15, fontWeight: "700", color: "#333" },
  time: { fontSize: 12, color: "#999" },
  message: { fontSize: 13, color: "#666", lineHeight: 18 },
});