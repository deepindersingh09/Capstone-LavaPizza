import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function OrderStatusScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.heading}>Order Status</Text>

      {/* Order ID */}
      <View style={styles.orderRow}>
        <Text style={styles.orderId}>Order ID: #54sdch05xd06</Text>
        <TouchableOpacity>
          <Ionicons name="copy-outline" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Timeline */}
      <Text style={styles.sectionTitle}>Time line</Text>
      <View style={styles.timelineItem}>
        <Ionicons name="checkmark-circle" size={28} color="#FFD700" />
        <View style={styles.timelineText}>
          <Text style={styles.timelineTitle}>In Process</Text>
          <Text style={styles.timelineDesc}>Processing your order</Text>
        </View>
        <Text style={styles.time}>24:15</Text>
      </View>

      <View style={styles.timelineItem}>
        <Ionicons name="bicycle" size={28} color="#FFD700" />
        <View style={styles.timelineText}>
          <Text style={styles.timelineTitle}>On the way</Text>
          <Text style={styles.timelineDesc}>
            Your order is already on its way.
          </Text>
        </View>
        <Text style={styles.time}>2:07</Text>
      </View>

      <View style={styles.timelineItem}>
        <Ionicons name="gift" size={28} color="gray" />
        <View style={styles.timelineText}>
          <Text style={styles.timelineTitle}>Delivered</Text>
          <Text style={styles.timelineDesc}>
            Your order has been delivered.
          </Text>
        </View>
        <Text style={styles.time}>---</Text>
      </View>

      {/* Delivery Address */}
      <Text style={styles.sectionTitle}>Delivery Address</Text>
      <Image source={require("../assets/images/menu/pizza2.png")} style={styles.map} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  orderId: { fontSize: 14, color: "gray" },
  sectionTitle: { fontWeight: "bold", fontSize: 16, marginVertical: 10 },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  timelineText: { flex: 1, marginLeft: 10 },
  timelineTitle: { fontSize: 15, fontWeight: "600" },
  timelineDesc: { fontSize: 13, color: "gray" },
  time: { fontSize: 13, color: "gray" },
  map: { width: "100%", height: 180, borderRadius: 10, marginTop: 10 },
});
