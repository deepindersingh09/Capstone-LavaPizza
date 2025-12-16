import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: string;
  timestamp: any;
  deliveryAddress?: string;
  paymentMethod?: string;
  customerName?: string;
}

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    checkGuestMode();
    fetchOrders();
  }, []);

  const checkGuestMode = async () => {
    const guestMode = await AsyncStorage.getItem("@guest_mode");
    setIsGuest(guestMode === "1");
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Check if user is in guest mode
      const guestMode = await AsyncStorage.getItem("@guest_mode");
      if (guestMode === "1") {
        setOrders([]);
        setLoading(false);
        return;
      }

      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log("❌ No authenticated user");
        setOrders([]);
        setLoading(false);
        return;
      }

      console.log("📦 Fetching orders for user:", currentUser.email);

      // Query orders collection filtered by user email
      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef,
        where("userEmail", "==", currentUser.email),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(q);
      const fetchedOrders: Order[] = [];

      querySnapshot.forEach((doc) => {
        fetchedOrders.push({
          id: doc.id,
          ...doc.data(),
        } as Order);
      });

      console.log(`✅ Fetched ${fetchedOrders.length} orders`);
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";

    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#FFA500";
      case "preparing":
        return "#2196F3";
      case "on the way":
        return "#9C27B0";
      case "delivered":
        return "#4CAF50";
      case "cancelled":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => router.push(`/order_tracking/${item.id}` as any)}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderIdContainer}>
          <Ionicons name="receipt-outline" size={20} color="#D97706" />
          <Text style={styles.orderId}>Order #{item.id.slice(-6).toUpperCase()}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status || "Pending"}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{formatDate(item.timestamp)}</Text>
        </View>

        {item.deliveryAddress && (
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.detailText} numberOfLines={1}>
              {item.deliveryAddress}
            </Text>
          </View>
        )}

        <View style={styles.itemsContainer}>
          <Text style={styles.itemsLabel}>Items ({item.items?.length || 0}):</Text>
          {item.items?.slice(0, 3).map((orderItem, index) => (
            <Text key={index} style={styles.itemText} numberOfLines={1}>
              • {orderItem.quantity}x {orderItem.name}
            </Text>
          ))}
          {item.items?.length > 3 && (
            <Text style={styles.moreItems}>+ {item.items.length - 3} more items</Text>
          )}
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${item.total?.toFixed(2) || "0.00"}</Text>
        </View>
      </View>

      <View style={styles.viewDetailsRow}>
        <Text style={styles.viewDetailsText}>View Details</Text>
        <Ionicons name="chevron-forward" size={20} color="#D97706" />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {isGuest ? (
        <>
          <Ionicons name="person-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Guest Mode</Text>
          <Text style={styles.emptyText}>Sign in to view your order history</Text>
          <TouchableOpacity style={styles.signInButton} onPress={() => router.push("/auth/login")}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Ionicons name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptyText}>
            Your order history will appear here once you place an order
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push("./(tabs)/account")}
          >
            <Text style={styles.browseButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D97706" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            orders.length === 0 ? styles.emptyListContainer : styles.listContainer
          }
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#D97706"]}
              tintColor="#D97706"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  orderIdContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  orderDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  itemsContainer: {
    marginTop: 8,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
  },
  itemsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  itemText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 3,
  },
  moreItems: {
    fontSize: 13,
    color: "#D97706",
    fontStyle: "italic",
    marginTop: 2,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D97706",
  },
  viewDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  viewDetailsText: {
    fontSize: 14,
    color: "#D97706",
    fontWeight: "600",
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: "#D97706",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signInButton: {
    backgroundColor: "#D97706",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
