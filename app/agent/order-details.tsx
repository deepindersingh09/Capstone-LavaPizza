import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  subscribeToOrder,
  updateOrderStatus,
  addTipToOrder,
  addRatingToOrder,
} from "@/lib/services/firestoreService";
import { requestLocationPermission, getCurrentLocation } from "@/lib/services/locationService";
import type { Order } from "@/types/models";

export default function OrderDetails() {
  const { theme, spacing, borderRadius, fontSize, elevation, isDark } = useTheme();
  const { user, agentData } = useAuth();
  const params = useLocalSearchParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [tipAmount, setTipAmount] = useState("");
  const [rating, setRating] = useState(5);
  const [ratingComment, setRatingComment] = useState("");

  // Subscribe to order updates
  useEffect(() => {
    if (!orderId) {
      Alert.alert("Error", "No order ID provided");
      router.back();
      return;
    }

    const unsubscribe = subscribeToOrder(orderId, (orderData) => {
      setOrder(orderData);
      setLoading(false);
    });

    return unsubscribe;
  }, [orderId]);

  // Get agent's current location
  useEffect(() => {
    const fetchLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        const location = await getCurrentLocation();
        if (location) {
          setCurrentLocation(location);
        }
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleCallCustomer = () => {
    if (!order?.customerPhone) return;

    Alert.alert("Call Customer", `Call ${order.customerName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call",
        onPress: () => {
          const phoneNumber = Platform.select({
            ios: `telprompt:${order.customerPhone}`,
            android: `tel:${order.customerPhone}`,
          });
          Linking.openURL(phoneNumber!);
        },
      },
    ]);
  };

  const handleNavigate = () => {
    if (!order?.deliveryAddress) return;

    const { street, city, province, postalCode } = order.deliveryAddress;
    const address = `${street}, ${city}, ${province} ${postalCode}`;
    const url = Platform.select({
      ios: `maps:?q=${encodeURIComponent(address)}`,
      android: `geo:?q=${encodeURIComponent(address)}`,
    });

    Linking.openURL(url!);
  };

  const handleChatCustomer = () => {
    router.push(`/agent/chat?orderId=${orderId}&customerName=${order?.customerName}` as any);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!orderId) return;

    try {
      await updateOrderStatus(orderId, newStatus);
      Alert.alert("Success", `Order status updated to ${newStatus}`);

      // Show tip modal when delivered
      if (newStatus === "delivered") {
        setShowTipModal(true);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
      console.error(error);
    }
  };

  const handleCollectTip = async () => {
    if (!orderId || !tipAmount) {
      Alert.alert("Error", "Please enter tip amount");
      return;
    }

    try {
      const tip = parseFloat(tipAmount);
      if (isNaN(tip) || tip < 0) {
        Alert.alert("Error", "Invalid tip amount");
        return;
      }

      await addTipToOrder(orderId, tip);
      setShowTipModal(false);
      setShowRatingModal(true);
      Alert.alert("Tip Collected!", `$${tip.toFixed(2)} tip added`);
    } catch (error) {
      Alert.alert("Error", "Failed to add tip");
      console.error(error);
    }
  };

  const handleSubmitRating = async () => {
    if (!orderId) return;

    try {
      await addRatingToOrder(orderId, rating, ratingComment);
      setShowRatingModal(false);
      Alert.alert("Delivery Complete!", "Thank you for completing this delivery", [
        { text: "OK", onPress: () => router.push("/agent/dashboard" as any) },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to submit rating");
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return theme.info;
      case "picked_up":
        return theme.warning;
      case "en_route":
        return theme.primary;
      case "delivered":
        return theme.success;
      default:
        return theme.textSecondary;
    }
  };

  const getNextStatus = () => {
    switch (order?.status) {
      case "assigned":
        return "picked_up";
      case "picked_up":
        return "en_route";
      case "en_route":
        return "delivered";
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl }}
        >
          <Ionicons name="alert-circle-outline" size={64} color={theme.danger} />
          <Text
            style={[
              styles.errorText,
              { color: theme.text, fontSize: fontSize.lg, marginTop: spacing.md },
            ]}
          >
            Order not found
          </Text>
          <TouchableOpacity
            style={[
              styles.backBtn,
              {
                backgroundColor: theme.primary,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                marginTop: spacing.lg,
              },
            ]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backBtnText, { color: theme.textInverse, fontSize: fontSize.md }]}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.primary, padding: spacing.lg, ...elevation.md },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textInverse} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textInverse, fontSize: fontSize.lg }]}>
          Order #{order.id.slice(-6)}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Live Map */}
        <View style={[styles.mapContainer, { height: 250, ...elevation.md }]}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: currentLocation?.latitude || 51.0447,
              longitude: currentLocation?.longitude || -114.0719,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            showsUserLocation
            showsMyLocationButton
          >
            {currentLocation && (
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
                title="You"
                pinColor={theme.success}
              />
            )}
            {/* Customer location marker (you can add customer coordinates here) */}
            <Marker
              coordinate={{ latitude: 51.0447 + 0.01, longitude: -114.0719 + 0.01 }}
              title={order.customerName}
              description={`${order.deliveryAddress.street}`}
              pinColor={theme.danger}
            />
          </MapView>
        </View>

        {/* Quick Actions */}
        <View style={[styles.quickActions, { padding: spacing.lg, gap: spacing.md }]}>
          <View style={{ flexDirection: "row", gap: spacing.md }}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  flex: 1,
                  backgroundColor: theme.success,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  ...elevation.sm,
                },
              ]}
              onPress={handleCallCustomer}
            >
              <Ionicons name="call" size={20} color={theme.textInverse} />
              <Text
                style={[styles.actionBtnText, { color: theme.textInverse, fontSize: fontSize.sm }]}
              >
                Call
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  flex: 1,
                  backgroundColor: theme.info,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  ...elevation.sm,
                },
              ]}
              onPress={handleChatCustomer}
            >
              <Ionicons name="chatbubble" size={20} color={theme.textInverse} />
              <Text
                style={[styles.actionBtnText, { color: theme.textInverse, fontSize: fontSize.sm }]}
              >
                Chat
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  flex: 1,
                  backgroundColor: theme.primary,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  ...elevation.sm,
                },
              ]}
              onPress={handleNavigate}
            >
              <Ionicons name="navigate" size={20} color={theme.textInverse} />
              <Text
                style={[styles.actionBtnText, { color: theme.textInverse, fontSize: fontSize.sm }]}
              >
                Navigate
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Status */}
        <View
          style={[
            styles.statusCard,
            {
              backgroundColor: theme.surface,
              marginHorizontal: spacing.lg,
              padding: spacing.lg,
              borderRadius: borderRadius.lg,
              marginBottom: spacing.md,
              ...elevation.sm,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fontSize.md }]}>
            Current Status
          </Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: getStatusColor(order.status),
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: borderRadius.full,
                marginTop: spacing.sm,
                alignSelf: "flex-start",
              },
            ]}
          >
            <Text style={[styles.statusText, { color: theme.textInverse, fontSize: fontSize.sm }]}>
              {getStatusLabel(order.status)}
            </Text>
          </View>

          {getNextStatus() && (
            <TouchableOpacity
              style={[
                styles.updateBtn,
                {
                  backgroundColor: theme.primary,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  marginTop: spacing.md,
                  alignItems: "center",
                },
              ]}
              onPress={() => handleUpdateStatus(getNextStatus()!)}
            >
              <Text
                style={[styles.updateBtnText, { color: theme.textInverse, fontSize: fontSize.md }]}
              >
                Mark as {getStatusLabel(getNextStatus()!)}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Customer Info */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: theme.surface,
              marginHorizontal: spacing.lg,
              padding: spacing.lg,
              borderRadius: borderRadius.lg,
              marginBottom: spacing.md,
              ...elevation.sm,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fontSize.md }]}>
            Customer Information
          </Text>
          <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={20} color={theme.text} />
              <Text style={[styles.infoText, { color: theme.text, fontSize: fontSize.sm }]}>
                {order.customerName}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call" size={20} color={theme.text} />
              <Text style={[styles.infoText, { color: theme.text, fontSize: fontSize.sm }]}>
                {order.customerPhone}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color={theme.text} />
              <Text style={[styles.infoText, { color: theme.text, fontSize: fontSize.sm }]}>
                {order.deliveryAddress.street}, {order.deliveryAddress.city}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View
          style={[
            styles.itemsCard,
            {
              backgroundColor: theme.surface,
              marginHorizontal: spacing.lg,
              padding: spacing.lg,
              borderRadius: borderRadius.lg,
              marginBottom: spacing.md,
              ...elevation.sm,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fontSize.md }]}>
            Order Items ({order.items.length})
          </Text>
          <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
            {order.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text
                  style={[styles.itemQty, { color: theme.textSecondary, fontSize: fontSize.sm }]}
                >
                  {item.quantity}x
                </Text>
                <Text
                  style={[styles.itemName, { color: theme.text, fontSize: fontSize.sm, flex: 1 }]}
                >
                  {item.name}
                </Text>
                <Text style={[styles.itemPrice, { color: theme.text, fontSize: fontSize.sm }]}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
            <View
              style={[
                styles.divider,
                { height: 1, backgroundColor: theme.border, marginVertical: spacing.sm },
              ]}
            />
            <View style={styles.itemRow}>
              <Text
                style={[
                  styles.totalLabel,
                  { color: theme.text, fontSize: fontSize.md, fontWeight: "700" },
                ]}
              >
                Total
              </Text>
              <Text
                style={[
                  styles.totalValue,
                  { color: theme.primary, fontSize: fontSize.lg, fontWeight: "800" },
                ]}
              >
                ${order.total.toFixed(2)}
              </Text>
            </View>
            {order.tip && (
              <View style={styles.itemRow}>
                <Text style={[styles.tipLabel, { color: theme.success, fontSize: fontSize.sm }]}>
                  Tip
                </Text>
                <Text
                  style={[
                    styles.tipValue,
                    { color: theme.success, fontSize: fontSize.md, fontWeight: "600" },
                  ]}
                >
                  ${order.tip.toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Tip Modal */}
      {showTipModal && (
        <View style={[styles.modalOverlay, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.surface,
                padding: spacing.xl,
                borderRadius: borderRadius.lg,
                marginHorizontal: spacing.xl,
                ...elevation.lg,
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: theme.text, fontSize: fontSize.xl, marginBottom: spacing.md },
              ]}
            >
              Collect Tip
            </Text>
            <Text
              style={[
                styles.modalSubtitle,
                { color: theme.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.lg },
              ]}
            >
              Did the customer give you a tip?
            </Text>

            <View
              style={[
                styles.tipInputContainer,
                { flexDirection: "row", alignItems: "center", marginBottom: spacing.lg },
              ]}
            >
              <Text
                style={[
                  styles.dollarSign,
                  { color: theme.text, fontSize: fontSize.xxl, marginRight: spacing.sm },
                ]}
              >
                $
              </Text>
              <TextInput
                style={[
                  styles.tipInput,
                  {
                    flex: 1,
                    backgroundColor: theme.background,
                    color: theme.text,
                    fontSize: fontSize.xl,
                    padding: spacing.md,
                    borderRadius: borderRadius.md,
                    borderWidth: 1,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="0.00"
                placeholderTextColor={theme.textTertiary}
                keyboardType="numeric"
                value={tipAmount}
                onChangeText={setTipAmount}
              />
            </View>

            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  {
                    flex: 1,
                    backgroundColor: theme.border,
                    padding: spacing.md,
                    borderRadius: borderRadius.md,
                    alignItems: "center",
                  },
                ]}
                onPress={() => {
                  setShowTipModal(false);
                  setShowRatingModal(true);
                }}
              >
                <Text style={[styles.modalBtnText, { color: theme.text, fontSize: fontSize.md }]}>
                  No Tip
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  {
                    flex: 1,
                    backgroundColor: theme.success,
                    padding: spacing.md,
                    borderRadius: borderRadius.md,
                    alignItems: "center",
                  },
                ]}
                onPress={handleCollectTip}
              >
                <Text
                  style={[styles.modalBtnText, { color: theme.textInverse, fontSize: fontSize.md }]}
                >
                  Add Tip
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <View style={[styles.modalOverlay, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.surface,
                padding: spacing.xl,
                borderRadius: borderRadius.lg,
                marginHorizontal: spacing.xl,
                ...elevation.lg,
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: theme.text, fontSize: fontSize.xl, marginBottom: spacing.md },
              ]}
            >
              Rate Customer
            </Text>
            <Text
              style={[
                styles.modalSubtitle,
                { color: theme.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.lg },
              ]}
            >
              How was your experience with {order.customerName}?
            </Text>

            <View
              style={[
                styles.starsContainer,
                {
                  flexDirection: "row",
                  gap: spacing.sm,
                  marginBottom: spacing.lg,
                  justifyContent: "center",
                },
              ]}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={40}
                    color={star <= rating ? theme.warning : theme.textSecondary}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={[
                styles.commentInput,
                {
                  backgroundColor: theme.background,
                  color: theme.text,
                  fontSize: fontSize.md,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  borderWidth: 1,
                  borderColor: theme.border,
                  marginBottom: spacing.lg,
                  minHeight: 80,
                  textAlignVertical: "top",
                },
              ]}
              placeholder="Add a comment (optional)"
              placeholderTextColor={theme.textTertiary}
              multiline
              value={ratingComment}
              onChangeText={setRatingComment}
            />

            <TouchableOpacity
              style={[
                styles.submitBtn,
                {
                  backgroundColor: theme.primary,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  alignItems: "center",
                },
              ]}
              onPress={handleSubmitRating}
            >
              <Text
                style={[styles.submitBtnText, { color: theme.textInverse, fontSize: fontSize.md }]}
              >
                Submit Rating
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  mapContainer: {
    overflow: "hidden",
  },
  quickActions: {
    // Dynamic
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionBtnText: {
    fontWeight: "700",
  },
  statusCard: {
    // Dynamic
  },
  sectionTitle: {
    fontWeight: "700",
  },
  statusBadge: {
    // Dynamic
  },
  statusText: {
    fontWeight: "700",
    textTransform: "capitalize",
  },
  updateBtn: {
    // Dynamic
  },
  updateBtnText: {
    fontWeight: "700",
  },
  infoCard: {
    // Dynamic
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoText: {
    flex: 1,
  },
  itemsCard: {
    // Dynamic
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemQty: {
    width: 30,
  },
  itemName: {
    // Dynamic
  },
  itemPrice: {
    fontWeight: "600",
  },
  divider: {
    // Dynamic
  },
  totalLabel: {
    flex: 1,
  },
  totalValue: {
    // Dynamic
  },
  tipLabel: {
    flex: 1,
  },
  tipValue: {
    // Dynamic
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontWeight: "700",
    textAlign: "center",
  },
  modalSubtitle: {
    textAlign: "center",
  },
  tipInputContainer: {
    // Dynamic
  },
  dollarSign: {
    fontWeight: "700",
  },
  tipInput: {
    fontWeight: "700",
  },
  modalBtn: {
    // Dynamic
  },
  modalBtnText: {
    fontWeight: "700",
  },
  starsContainer: {
    // Dynamic
  },
  commentInput: {
    // Dynamic
  },
  submitBtn: {
    // Dynamic
  },
  submitBtnText: {
    fontWeight: "700",
  },
  errorText: {
    fontWeight: "600",
    textAlign: "center",
  },
  backBtn: {
    // Dynamic
  },
  backBtnText: {
    fontWeight: "700",
  },
});
