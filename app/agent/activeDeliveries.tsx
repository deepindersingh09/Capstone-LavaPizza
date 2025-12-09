import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  subscribeToAgentOrders,
  subscribeToPendingOrders,
  assignAgentToOrder,
  updateAgentStatus,
  getAgent,
} from "@/lib/services/firestoreService";
import type { Order } from "@/types/models";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ActiveDeliveries() {
  const { theme, spacing, borderRadius, fontSize, elevation } = useTheme();
  const { user, agentData, firebaseUser } = useAuth();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to agent's active orders
  useEffect(() => {
    const agentId = user?.id || agentData?.id || firebaseUser?.uid;
    if (!agentId) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToAgentOrders(agentId, (orders) => {
      setActiveOrders(orders);
      setLoading(false);
    });

    return unsubscribe;
  }, [user?.id, agentData?.id, firebaseUser?.uid]);

  // Subscribe to pending orders
  useEffect(() => {
    const unsubscribe = subscribeToPendingOrders((orders) => {
      setPendingOrders(orders);
    });

    return unsubscribe;
  }, []);

  const handleAcceptOrder = async (order: Order) => {
    const agentId = user?.id || agentData?.id || firebaseUser?.uid;
    const agentName =
      user?.name ||
      agentData?.name ||
      firebaseUser?.displayName ||
      firebaseUser?.email?.split("@")[0] ||
      "Agent";
    const agentEmail = user?.email || agentData?.email || firebaseUser?.email || "";

    if (!agentId) {
      Alert.alert("Error", "Please login to accept orders");
      router.replace("/auth/login" as any);
      return;
    }

    try {
      // Ensure agent documents exist
      const existingAgent = await getAgent(agentId);
      if (!existingAgent) {
        await setDoc(doc(db, "users", agentId), {
          id: agentId,
          name: agentName,
          email: agentEmail,
          role: "agent",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        await setDoc(doc(db, "agents", agentId), {
          id: agentId,
          name: agentName,
          email: agentEmail,
          phone: "",
          vehicleType: "bike",
          vehicleNumber: "",
          vehicleColor: "",
          status: "available",
          isOnline: true,
          isVerified: false,
          rating: 0,
          totalDeliveries: 0,
          totalEarnings: 0,
          currentLocation: { latitude: 0, longitude: 0 },
          geohash: "",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }

      await assignAgentToOrder(order.id, agentId, agentName);

      try {
        await updateAgentStatus(agentId, "enroute");
      } catch (statusError) {
        console.log("Status update skipped:", statusError);
      }

      Alert.alert("Order Accepted!", `Order #${order.id.slice(-6)} assigned to you`);
    } catch (error) {
      console.error("Order acceptance error:", error);
      Alert.alert("Error", "Failed to accept order. Please try again.");
    }
  };

  const renderPendingOrder = ({ item }: { item: Order }) => (
    <View
      style={[
        styles.orderCard,
        {
          backgroundColor: theme.surface,
          padding: spacing.lg,
          marginHorizontal: spacing.lg,
          marginBottom: spacing.md,
          borderRadius: borderRadius.lg,
          borderLeftWidth: 4,
          borderLeftColor: theme.warning,
          ...elevation.md,
        },
      ]}
    >
      <Text style={[styles.orderId, { color: theme.text, fontSize: fontSize.lg }]}>
        Order #{item.id.slice(-6)}
      </Text>

      <View style={{ marginTop: spacing.sm }}>
        <Text style={[styles.info, { color: theme.textSecondary, fontSize: fontSize.sm }]}>
          👤 {item.customerName}
        </Text>
        <Text style={[styles.info, { color: theme.textSecondary, fontSize: fontSize.sm }]}>
          📍 {item.deliveryAddress.street}, {item.deliveryAddress.city}
        </Text>
        <Text
          style={[
            styles.price,
            { color: theme.text, fontSize: fontSize.md, marginTop: spacing.xs },
          ]}
        >
          💰 ${item.total.toFixed(2)}
        </Text>
      </View>

      <View style={[styles.buttonRow, { marginTop: spacing.md }]}>
        <TouchableOpacity
          style={[
            styles.acceptBtn,
            {
              flex: 1,
              backgroundColor: theme.success,
              padding: spacing.md,
              borderRadius: borderRadius.md,
              alignItems: "center",
            },
          ]}
          onPress={() => handleAcceptOrder(item)}
        >
          <Text style={[styles.btnText, { color: theme.textInverse, fontSize: fontSize.md }]}>
            ✓ Accept
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderActiveOrder = ({ item }: { item: Order }) => (
    <View
      style={[
        styles.orderCard,
        {
          backgroundColor: theme.surface,
          padding: spacing.lg,
          marginHorizontal: spacing.lg,
          marginBottom: spacing.md,
          borderRadius: borderRadius.lg,
          borderLeftWidth: 4,
          borderLeftColor: theme.primary,
          ...elevation.md,
        },
      ]}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={[styles.orderId, { color: theme.text, fontSize: fontSize.lg }]}>
          Order #{item.id.slice(-6)}
        </Text>
        <View
          style={{
            backgroundColor: theme.primary,
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: theme.textInverse, fontSize: fontSize.xs, fontWeight: "700" }}>
            {item.status.replace("_", " ").toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: spacing.sm }}>
        <Text style={[styles.info, { color: theme.textSecondary, fontSize: fontSize.sm }]}>
          👤 {item.customerName}
        </Text>
        <Text style={[styles.info, { color: theme.textSecondary, fontSize: fontSize.sm }]}>
          📍 {item.deliveryAddress.street}, {item.deliveryAddress.city}
        </Text>
        <Text
          style={[
            styles.price,
            { color: theme.text, fontSize: fontSize.md, marginTop: spacing.xs },
          ]}
        >
          💰 ${item.total.toFixed(2)}
        </Text>
      </View>

      <View style={[styles.buttonRow, { marginTop: spacing.md }]}>
        <TouchableOpacity
          style={[
            styles.acceptBtn,
            {
              flex: 1,
              backgroundColor: theme.primary,
              padding: spacing.md,
              borderRadius: borderRadius.md,
              alignItems: "center",
            },
          ]}
          onPress={() => router.push(`/agent/order-details?orderId=${item.id}` as any)}
        >
          <Text style={[styles.btnText, { color: theme.textInverse, fontSize: fontSize.md }]}>
            📍 View Details & Track
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.primary,
            padding: spacing.lg,
            ...elevation.md,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textInverse} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textInverse, fontSize: fontSize.lg }]}>
          Orders & Deliveries
        </Text>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: theme.textInverse,
              paddingHorizontal: spacing.sm,
              paddingVertical: 4,
              borderRadius: borderRadius.full,
            },
          ]}
        >
          <Text style={[styles.badgeText, { color: theme.primary, fontSize: fontSize.sm }]}>
            {activeOrders.length + pendingOrders.length}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Pending Orders Section */}
          {pendingOrders.length > 0 && (
            <View style={{ marginTop: spacing.lg }}>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: theme.text,
                    fontSize: fontSize.md,
                    marginLeft: spacing.lg,
                    marginBottom: spacing.sm,
                    fontWeight: "700",
                  },
                ]}
              >
                🔔 New Orders Available ({pendingOrders.length})
              </Text>
              {pendingOrders.map((order) => (
                <View key={order.id}>{renderPendingOrder({ item: order })}</View>
              ))}
            </View>
          )}

          {/* Active Orders Section */}
          {activeOrders.length > 0 && (
            <View style={{ marginTop: spacing.lg }}>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: theme.text,
                    fontSize: fontSize.md,
                    marginLeft: spacing.lg,
                    marginBottom: spacing.sm,
                    fontWeight: "700",
                  },
                ]}
              >
                🚀 My Active Deliveries ({activeOrders.length})
              </Text>
              {activeOrders.map((order) => (
                <View key={order.id}>{renderActiveOrder({ item: order })}</View>
              ))}
            </View>
          )}

          {/* Empty State */}
          {pendingOrders.length === 0 && activeOrders.length === 0 && (
            <View style={[styles.emptyContainer, { padding: spacing.xl, marginTop: spacing.xl }]}>
              <Ionicons name="bicycle-outline" size={64} color={theme.textSecondary} />
              <Text
                style={[
                  styles.emptyText,
                  { color: theme.textSecondary, fontSize: fontSize.lg, marginTop: spacing.md },
                ]}
              >
                No orders available
              </Text>
              <Text
                style={[
                  styles.emptySubtext,
                  { color: theme.textTertiary, fontSize: fontSize.sm, marginTop: spacing.xs },
                ]}
              >
                New orders will appear here automatically
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Bottom Navigation */}
      <View
        style={[
          styles.bottomNav,
          {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
            ...elevation.lg,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/agent/dashboard" as any)}
        >
          <Ionicons name="home-outline" size={24} color={theme.textSecondary} />
          <Text style={[styles.navText, { color: theme.textSecondary, fontSize: fontSize.xs }]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="delivery-dining" size={28} color={theme.primary} />
          <Text style={[styles.navText, { color: theme.primary, fontSize: fontSize.xs }]}>
            Deliveries
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/agent/earnings" as any)}
        >
          <Ionicons name="wallet-outline" size={24} color={theme.textSecondary} />
          <Text style={[styles.navText, { color: theme.textSecondary, fontSize: fontSize.xs }]}>
            Earnings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/agent/profile" as any)}
        >
          <Ionicons name="person-outline" size={24} color={theme.textSecondary} />
          <Text style={[styles.navText, { color: theme.textSecondary, fontSize: fontSize.xs }]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontWeight: "700",
    flex: 1,
    marginLeft: 16,
  },
  badge: {
    // Dynamic
  },
  badgeText: {
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    fontWeight: "600",
  },
  emptySubtext: {
    textAlign: "center",
  },
  sectionTitle: {
    fontWeight: "700",
  },
  orderCard: {
    // Dynamic
  },
  orderId: {
    fontWeight: "700",
  },
  info: {
    marginTop: 4,
  },
  price: {
    fontWeight: "600",
  },
  itemsLabel: {
    fontWeight: "600",
  },
  item: {
    marginLeft: 8,
  },
  buttonRow: {
    flexDirection: "row",
  },
  acceptBtn: {
    // Dynamic
  },
  rejectBtn: {
    // Dynamic
  },
  btnText: {
    fontWeight: "700",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 12,
    paddingBottom: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  navText: {
    fontWeight: "600",
    marginTop: 4,
  },
});
