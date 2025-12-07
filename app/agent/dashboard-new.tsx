import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToAgentOrders, setAgentOnline, updateAgentStatus } from "@/lib/services/firestoreService";
import { startLocationTracking, type LocationSubscription } from "@/lib/services/locationService";
import type { Order } from "@/types/models";

export default function Dashboard() {
  const { theme, spacing, borderRadius, fontSize, elevation } = useTheme();
  const { user, agentData } = useAuth();

  const [isOnline, setIsOnline] = useState(false);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [locationSubscription, setLocationSubscription] = useState<LocationSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to agent's orders
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = subscribeToAgentOrders(user.id, (orders) => {
      setActiveOrders(orders);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [user?.id]);

  // Handle online/offline toggle
  const handleToggleOnline = async (value: boolean) => {
    if (!user?.id) return;

    try {
      setIsOnline(value);
      await setAgentOnline(user.id, value);

      if (value) {
        // Start location tracking when going online
        const subscription = await startLocationTracking(user.id);
        if (subscription) {
          setLocationSubscription(subscription);
          Alert.alert("You're Online!", "You'll now receive delivery requests");
        } else {
          Alert.alert("Location Error", "Please enable location permissions");
          setIsOnline(false);
        }
      } else {
        // Stop location tracking when going offline
        if (locationSubscription) {
          locationSubscription.remove();
          setLocationSubscription(null);
        }
        await updateAgentStatus(user.id, "offline");
        Alert.alert("You're Offline", "You won't receive new delivery requests");
      }
    } catch (error) {
      console.error("Error toggling online status:", error);
      Alert.alert("Error", "Failed to update status");
      setIsOnline(!value);
    }
  };

  const todayEarnings = agentData?.totalEarnings || 0;
  const totalDeliveries = agentData?.totalDeliveries || 0;
  const rating = agentData?.rating || 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary, ...elevation.md }]}>
        <TouchableOpacity onPress={() => router.push("/agent/menu" as any)}>
          <Ionicons name="menu" size={24} color={theme.textInverse} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textInverse, fontSize: fontSize.lg }]}>
          Delivery Dashboard
        </Text>
        <TouchableOpacity onPress={() => router.push("/agent/notifications" as any)}>
          <View>
            <Ionicons name="notifications-outline" size={24} color={theme.textInverse} />
            {activeOrders.length > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.danger }]}>
                <Text style={[styles.badgeText, { fontSize: fontSize.xs }]}>
                  {activeOrders.length}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={{ padding: spacing.lg }}>
          <Text style={[styles.welcome, { color: theme.text, fontSize: fontSize.xxl }]}>
            Welcome, {user?.name || "Agent"}! 👋
          </Text>
          <Text style={[styles.subWelcome, { color: theme.textSecondary, fontSize: fontSize.md }]}>
            {isOnline ? "You're online and ready for deliveries" : "Go online to start earning"}
          </Text>
        </View>

        {/* Online/Offline Toggle */}
        <View
          style={[
            styles.statusCard,
            {
              backgroundColor: theme.surface,
              marginHorizontal: spacing.lg,
              padding: spacing.lg,
              borderRadius: borderRadius.lg,
              ...elevation.sm,
            },
          ]}
        >
          <View style={styles.statusRow}>
            <View>
              <Text style={[styles.statusLabel, { color: theme.text, fontSize: fontSize.md }]}>
                {isOnline ? "🟢 Online" : "⚫ Offline"}
              </Text>
              <Text style={[styles.statusSub, { color: theme.textSecondary, fontSize: fontSize.sm }]}>
                {isOnline ? "Accepting deliveries" : "Tap to go online"}
              </Text>
            </View>
            <Switch
              value={isOnline}
              onValueChange={handleToggleOnline}
              trackColor={{ false: theme.borderDark, true: theme.success }}
              thumbColor={theme.surface}
            />
          </View>
        </View>

        {/* Stats */}
        <View style={[styles.statsContainer, { paddingHorizontal: spacing.lg, marginTop: spacing.lg }]}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.surface,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                ...elevation.sm,
              },
            ]}
          >
            <Text style={[styles.statValue, { color: theme.primary, fontSize: fontSize.xl }]}>
              ${todayEarnings.toFixed(2)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary, fontSize: fontSize.sm }]}>
              Today's Earnings
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.surface,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                ...elevation.sm,
              },
            ]}
          >
            <Text style={[styles.statValue, { color: theme.text, fontSize: fontSize.xl }]}>
              {totalDeliveries}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary, fontSize: fontSize.sm }]}>
              Total Deliveries
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.surface,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                ...elevation.sm,
              },
            ]}
          >
            <Text style={[styles.statValue, { color: theme.warning, fontSize: fontSize.xl }]}>
              ⭐ {rating.toFixed(1)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary, fontSize: fontSize.sm }]}>
              Rating
            </Text>
          </View>
        </View>

        {/* Active Orders */}
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
          <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fontSize.lg }]}>
            Active Deliveries ({activeOrders.length})
          </Text>

          {isLoading ? (
            <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: spacing.lg }} />
          ) : activeOrders.length === 0 ? (
            <View
              style={[
                styles.emptyState,
                {
                  backgroundColor: theme.surface,
                  padding: spacing.xl,
                  borderRadius: borderRadius.lg,
                  marginTop: spacing.md,
                  ...elevation.sm,
                },
              ]}
            >
              <Ionicons name="bicycle-outline" size={48} color={theme.textSecondary} />
              <Text style={[styles.emptyText, { color: theme.textSecondary, fontSize: fontSize.md, marginTop: spacing.md }]}>
                {isOnline ? "No active deliveries" : "Go online to receive orders"}
              </Text>
            </View>
          ) : (
            activeOrders.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={[
                  styles.orderCard,
                  {
                    backgroundColor: theme.surface,
                    padding: spacing.lg,
                    borderRadius: borderRadius.lg,
                    marginTop: spacing.md,
                    borderLeftWidth: 4,
                    borderLeftColor: theme.primary,
                    ...elevation.md,
                  },
                ]}
                onPress={() => router.push(`/agent/order-details/${order.id}` as any)}
              >
                <View style={styles.orderHeader}>
                  <Text style={[styles.orderId, { color: theme.text, fontSize: fontSize.md }]}>
                    Order #{order.id.slice(-6)}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: theme.primaryDark,
                        paddingHorizontal: spacing.sm,
                        paddingVertical: 4,
                        borderRadius: borderRadius.sm,
                      },
                    ]}
                  >
                    <Text style={[styles.statusBadgeText, { color: theme.textInverse, fontSize: fontSize.xs }]}>
                      {order.status.replace("_", " ").toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={{ marginTop: spacing.sm }}>
                  <Text style={[styles.orderDetail, { color: theme.textSecondary, fontSize: fontSize.sm }]}>
                    👤 {order.customerName}
                  </Text>
                  <Text style={[styles.orderDetail, { color: theme.textSecondary, fontSize: fontSize.sm }]}>
                    📍 {order.deliveryAddress.street}, {order.deliveryAddress.city}
                  </Text>
                  <Text style={[styles.orderDetail, { color: theme.text, fontSize: fontSize.md, marginTop: spacing.xs }]}>
                    💰 ${order.total.toFixed(2)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.viewBtn,
                    {
                      backgroundColor: theme.primary,
                      padding: spacing.sm,
                      borderRadius: borderRadius.md,
                      marginTop: spacing.md,
                    },
                  ]}
                  onPress={() => router.push("/agent/update-status" as any)}
                >
                  <Text style={[styles.viewBtnText, { color: theme.textInverse, fontSize: fontSize.md }]}>
                    Update Status
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}

          <TouchableOpacity
            style={[
              styles.viewAllBtn,
              {
                backgroundColor: theme.surface,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                marginTop: spacing.md,
                borderWidth: 1,
                borderColor: theme.border,
              },
            ]}
            onPress={() => router.push("/agent/activeDeliveries" as any)}
          >
            <Text style={[styles.viewAllText, { color: theme.primary, fontSize: fontSize.md }]}>
              View All Deliveries →
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
          <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fontSize.lg }]}>
            Quick Actions
          </Text>

          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[
                styles.actionCard,
                {
                  backgroundColor: theme.surface,
                  padding: spacing.lg,
                  borderRadius: borderRadius.md,
                  ...elevation.sm,
                },
              ]}
              onPress={() => router.push("/agent/earnings" as any)}
            >
              <Ionicons name="wallet-outline" size={32} color={theme.primary} />
              <Text style={[styles.actionText, { color: theme.text, fontSize: fontSize.sm, marginTop: spacing.sm }]}>
                Earnings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionCard,
                {
                  backgroundColor: theme.surface,
                  padding: spacing.lg,
                  borderRadius: borderRadius.md,
                  ...elevation.sm,
                },
              ]}
              onPress={() => router.push("/agent/live-location" as any)}
            >
              <Ionicons name="navigate-outline" size={32} color={theme.success} />
              <Text style={[styles.actionText, { color: theme.text, fontSize: fontSize.sm, marginTop: spacing.sm }]}>
                Location
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionCard,
                {
                  backgroundColor: theme.surface,
                  padding: spacing.lg,
                  borderRadius: borderRadius.md,
                  ...elevation.sm,
                },
              ]}
              onPress={() => router.push("/agent/profile" as any)}
            >
              <Ionicons name="person-outline" size={32} color={theme.info} />
              <Text style={[styles.actionText, { color: theme.text, fontSize: fontSize.sm, marginTop: spacing.sm }]}>
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

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
          <Ionicons name="home" size={24} color={theme.primary} />
          <Text style={[styles.navText, { color: theme.primary, fontSize: fontSize.xs }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/agent/activeDeliveries" as any)}>
          <MaterialIcons name="delivery-dining" size={28} color={theme.textSecondary} />
          <Text style={[styles.navText, { color: theme.textSecondary, fontSize: fontSize.xs }]}>Deliveries</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/agent/earnings" as any)}>
          <Ionicons name="wallet-outline" size={24} color={theme.textSecondary} />
          <Text style={[styles.navText, { color: theme.textSecondary, fontSize: fontSize.xs }]}>Earnings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/agent/profile" as any)}>
          <Ionicons name="person-outline" size={24} color={theme.textSecondary} />
          <Text style={[styles.navText, { color: theme.textSecondary, fontSize: fontSize.xs }]}>Profile</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontWeight: "700",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "700",
  },
  welcome: {
    fontWeight: "800",
  },
  subWelcome: {
    marginTop: 4,
  },
  statusCard: {
    // Dynamic styles from theme
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusLabel: {
    fontWeight: "700",
  },
  statusSub: {
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontWeight: "800",
  },
  statLabel: {
    marginTop: 4,
    textAlign: "center",
  },
  sectionTitle: {
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
  },
  orderCard: {
    // Dynamic styles
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orderId: {
    fontWeight: "700",
  },
  statusBadge: {
    // Dynamic
  },
  statusBadgeText: {
    fontWeight: "700",
  },
  orderDetail: {
    marginTop: 4,
  },
  viewBtn: {
    alignItems: "center",
  },
  viewBtnText: {
    fontWeight: "700",
  },
  viewAllBtn: {
    alignItems: "center",
  },
  viewAllText: {
    fontWeight: "600",
  },
  actionsGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  actionCard: {
    flex: 1,
    alignItems: "center",
  },
  actionText: {
    fontWeight: "600",
    textAlign: "center",
  },
  bottomNav: {
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
