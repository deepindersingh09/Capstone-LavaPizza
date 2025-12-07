import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
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
  subscribeToPendingOrders,
  assignAgentToOrder,
  updateAgentStatus,
} from "@/lib/services/firestoreService";
import type { Order } from "@/types/models";

export default function ActiveDeliveries() {
  const { theme, spacing, borderRadius, fontSize, elevation } = useTheme();
  const { user } = useAuth();
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToPendingOrders((orders) => {
      setPendingOrders(orders);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleAcceptOrder = async (order: Order) => {
    if (!user?.id || !user?.name) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      await assignAgentToOrder(order.id, user.id, user.name);
      await updateAgentStatus(user.id, "enroute");

      Alert.alert("Order Accepted!", `Order #${order.id.slice(-6)} assigned to you`);
      router.push("/agent/dashboard" as any);
    } catch (error) {
      Alert.alert("Error", "Failed to accept order");
      console.error(error);
    }
  };

  const handleRejectOrder = (order: Order) => {
    Alert.alert(
      "Reject Order",
      `Are you sure you want to reject Order #${order.id.slice(-6)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => {
            Alert.alert("Order Rejected", "Looking for another agent...");
          },
        },
      ]
    );
  };

  const renderOrder = ({ item }: { item: Order }) => (
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
          📞 {item.customerPhone}
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

      <View style={{ marginTop: spacing.sm }}>
        <Text style={[styles.itemsLabel, { color: theme.textSecondary, fontSize: fontSize.sm }]}>
          Items ({item.items.length}):
        </Text>
        {item.items.map((orderItem, idx) => (
          <Text key={idx} style={[styles.item, { color: theme.textSecondary, fontSize: fontSize.sm }]}>
            • {orderItem.quantity}x {orderItem.name}
          </Text>
        ))}
      </View>

      <View style={[styles.buttonRow, { marginTop: spacing.md, gap: spacing.sm }]}>
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

        <TouchableOpacity
          style={[
            styles.rejectBtn,
            {
              flex: 1,
              backgroundColor: theme.danger,
              padding: spacing.md,
              borderRadius: borderRadius.md,
              alignItems: "center",
            },
          ]}
          onPress={() => handleRejectOrder(item)}
        >
          <Text style={[styles.btnText, { color: theme.textInverse, fontSize: fontSize.md }]}>
            ✗ Reject
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
          Available Orders
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
            {pendingOrders.length}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : pendingOrders.length === 0 ? (
        <View style={[styles.emptyContainer, { padding: spacing.xl }]}>
          <Ionicons name="checkmark-circle-outline" size={64} color={theme.textSecondary} />
          <Text
            style={[
              styles.emptyText,
              { color: theme.textSecondary, fontSize: fontSize.lg, marginTop: spacing.md },
            ]}
          >
            No pending orders right now
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
      ) : (
        <FlatList
          data={pendingOrders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: spacing.lg, paddingBottom: 100 }}
        />
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
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/agent/dashboard" as any)}>
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

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/agent/earnings" as any)}>
          <Ionicons name="wallet-outline" size={24} color={theme.textSecondary} />
          <Text style={[styles.navText, { color: theme.textSecondary, fontSize: fontSize.xs }]}>
            Earnings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/agent/profile" as any)}>
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
    gap: 4,
  },
  navText: {
    fontWeight: "600",
  },
});
