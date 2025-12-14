import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase"; // adjust if your path is different

type OrderDoc = {
  status?: string; // pending | accepted | preparing | out_for_delivery | delivered | cancelled
  createdAt?: any;
  deliveryAddress?: string;
  address?: string; // some apps use "address"
  orderNumber?: string; // optional
  deliveryType?: "delivery" | "pickup";
  assignedAgentId?: string | null;
};

export default function OrderStatusScreen() {
  // Expecting route like: /order-status?orderId=ABC123
  // Or if you do /orders/[id], then use params.id instead.
  const params = useLocalSearchParams();
  const orderId = (params.orderId as string) || (params.id as string) || "";

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDoc | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setOrder(null);
      return;
    }

    const ref = doc(db, "orders", orderId);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setOrder(null);
          setLoading(false);
          return;
        }
        setOrder(snap.data() as OrderDoc);
        setLoading(false);
      },
      (err) => {
        console.log("OrderStatus onSnapshot error:", err);
        setLoading(false);
        Alert.alert("Error", "Could not load order status.");
      }
    );

    return () => unsub();
  }, [orderId]);

  const status = (order?.status || "pending").toLowerCase();

  // Map your Firestore status values to timeline steps
  const steps = useMemo(() => {
    // You can rename these to match YOUR real status strings
    const timeline = [
      {
        key: "preparing",
        icon: "checkmark-circle" as const,
        title: "In Process",
        desc: "Processing your order",
      },
      {
        key: "out_for_delivery",
        icon: "bicycle" as const,
        title: "On the way",
        desc: "Your order is already on its way.",
      },
      {
        key: "delivered",
        icon: "gift" as const,
        title: "Delivered",
        desc: "Your order has been delivered.",
      },
    ];

    // Decide what counts as “completed” for each step
    const done = (stepKey: string) => {
      if (status === "cancelled") return false;

      // pending / accepted / preparing = only step 1 is active-ish
      if (stepKey === "preparing") {
        return ["accepted", "preparing", "out_for_delivery", "delivered"].includes(status);
      }
      if (stepKey === "out_for_delivery") {
        return ["out_for_delivery", "delivered"].includes(status);
      }
      if (stepKey === "delivered") {
        return ["delivered"].includes(status);
      }
      return false;
    };

    return timeline.map((s) => ({
      ...s,
      isDone: done(s.key),
      color: done(s.key) ? "#FFD700" : "gray",
    }));
  }, [status]);

  const displayOrderId = order?.orderNumber ? `#${order.orderNumber}` : `#${orderId || "----"}`;

  const addressText =
    order?.deliveryType === "pickup"
      ? "Pickup Order"
      : order?.deliveryAddress || order?.address || "No address found";

  const copyId = async () => {
    if (!orderId) return;
    await Clipboard.setStringAsync(orderId);
    Alert.alert("Copied", "Order ID copied to clipboard.");
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={{ marginTop: 10, color: "gray" }}>Loading order…</Text>
      </View>
    );
  }

  if (!orderId || !order) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Order not found</Text>
        <Text style={{ marginTop: 6, color: "gray" }}>
          Make sure you opened this screen with a valid orderId.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.heading}>Order Status</Text>

      {/* Order ID */}
      <View style={styles.orderRow}>
        <Text style={styles.orderId}>Order ID: {displayOrderId}</Text>
        <TouchableOpacity onPress={copyId}>
          <Ionicons name="copy-outline" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Timeline */}
      <Text style={styles.sectionTitle}>Time line</Text>

      {steps.map((s, idx) => (
        <View key={s.key} style={styles.timelineItem}>
          <Ionicons name={s.icon} size={28} color={s.color} />
          <View style={styles.timelineText}>
            <Text style={styles.timelineTitle}>{s.title}</Text>
            <Text style={styles.timelineDesc}>{s.desc}</Text>
          </View>
          <Text style={styles.time}>
            {s.isDone ? "✓" : idx === 0 && status === "pending" ? "…" : "---"}
          </Text>
        </View>
      ))}

      {/* Delivery Address */}
      <Text style={styles.sectionTitle}>Delivery Address</Text>
      <Text style={{ color: "gray", marginBottom: 10 }}>{addressText}</Text>

      {/* Placeholder map/image (keep your existing) */}
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
