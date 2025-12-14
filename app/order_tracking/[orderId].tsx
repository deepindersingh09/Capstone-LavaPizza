import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
  Linking,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type LatLng = { lat: number; lng: number };

type Order = {
  status: string;
  etaMinutes?: number;

  restaurantAddress?: {
    location?: { latitude?: number; longitude?: number };
    street?: string;
    city?: string;
  };

  deliveryAddress?: {
    location?: { latitude?: number; longitude?: number };
    street?: string;
    city?: string;
  };

  driver?: {
    name?: string;
    phone?: string;
    location?: { latitude?: number; longitude?: number };
  };

  updatedAt?: any;
};

const STATUS_STEPS = [
  { key: "PENDING", label: "Pending" },
  { key: "PREPARING", label: "Preparing" },
  { key: "READY", label: "Ready" },
  { key: "COMPLETED", label: "Completed" },
] as const;

type StatusKey = (typeof STATUS_STEPS)[number]["key"];

function toLatLng(lat?: number, lng?: number): LatLng | null {
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  return { lat, lng };
}

// ✅ Normalize Firestore status → what UI expects
function normalizeStatus(raw: any): StatusKey {
  const s = String(raw ?? "").trim();

  // common cases from your checkout/admin
  const upper = s.toUpperCase();

  // map your checkout value
  if (upper === "PENDING") return "PENDING";
  if (upper === "PREPARING") return "PREPARING";
  if (upper === "READY") return "READY";
  if (upper === "COMPLETED") return "COMPLETED";

  // fallback
  return "PENDING";
}

export default function OrderTracking() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const id = String(orderId || "");
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ REAL-TIME Firestore listener: orders/{orderId}
  useEffect(() => {
    if (!id) {
      setOrder(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const ref = doc(db, "orders", id);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setOrder(null);
          setLoading(false);
          return;
        }

        const data = snap.data() as any;

        // IMPORTANT: we keep raw order but status is normalized in UI
        const normalized: Order = {
          status: data.status ?? "PENDING",
          etaMinutes: data.etaMinutes,
          restaurantAddress: data.restaurantAddress,
          deliveryAddress: data.deliveryAddress,
          driver: data.driver,
          updatedAt: data.updatedAt,
        };

        setOrder(normalized);
        setLoading(false);
      },
      (err) => {
        console.error("❌ Order tracking onSnapshot error:", err);
        setOrder(null);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [id]);

  const statusKey: StatusKey = useMemo(() => normalizeStatus(order?.status), [order?.status]);

  const activeIndex = useMemo(() => {
    const idx = STATUS_STEPS.findIndex((s) => s.key === statusKey);
    return idx === -1 ? 0 : idx;
  }, [statusKey]);

  const storeLoc = toLatLng(
    order?.restaurantAddress?.location?.latitude,
    order?.restaurantAddress?.location?.longitude
  );

  const customerLoc = toLatLng(
    order?.deliveryAddress?.location?.latitude,
    order?.deliveryAddress?.location?.longitude
  );

  const driverLoc = toLatLng(order?.driver?.location?.latitude, order?.driver?.location?.longitude);

  // Fit map to available markers (store + customer + driver)
  useEffect(() => {
    if (!order || !mapRef.current) return;

    const pts: LatLng[] = [storeLoc, customerLoc, driverLoc].filter(Boolean) as LatLng[];
    if (pts.length === 0) return;

    const coords = pts.map((p) => ({ latitude: p.lat, longitude: p.lng }));
    mapRef.current.fitToCoordinates(coords, {
      edgePadding: { top: 80, bottom: 260, left: 60, right: 60 },
      animated: true,
    });
  }, [order?.status, order?.etaMinutes, storeLoc?.lat, customerLoc?.lat, driverLoc?.lat]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={YELLOW} />
          <Text style={{ marginTop: 10 }}>Loading your order…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <View style={styles.center}>
          <Text>Order not found.</Text>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={18} />
            <Text style={{ marginLeft: 6, fontWeight: "600" }}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const driverPhone = order.driver?.phone;

  const callDriver = () => {
    if (!driverPhone) return Alert.alert("Driver", "No phone available.");
    Linking.openURL(`tel:${driverPhone}`);
  };

  const textDriver = () => {
    if (!driverPhone) return Alert.alert("Driver", "No phone available.");
    Linking.openURL(`sms:${driverPhone}`);
  };

  const regionFallback = {
    latitude: storeLoc?.lat ?? 51.0447,
    longitude: storeLoc?.lng ?? -114.0719,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  };

  // ✅ map padding so markers are not hidden behind the bottom panel
  const mapBottomPadding = 240 + insets.bottom;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </Pressable>
          <Text style={styles.headerTitle}>Track Order</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Map */}
        <View style={styles.mapWrap}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={regionFallback}
            mapPadding={{ top: 80, right: 20, bottom: mapBottomPadding, left: 20 }}
          >
            {storeLoc && (
              <Marker
                coordinate={{ latitude: storeLoc.lat, longitude: storeLoc.lng }}
                title="Lava Pizza YYC"
                description="Store"
                pinColor={Platform.OS === "ios" ? undefined : "orange"}
              />
            )}

            {customerLoc && (
              <Marker
                coordinate={{ latitude: customerLoc.lat, longitude: customerLoc.lng }}
                title="Your Address"
                description="Delivery destination"
              />
            )}

            {driverLoc && (
              <Marker
                coordinate={{ latitude: driverLoc.lat, longitude: driverLoc.lng }}
                title={order.driver?.name ?? "Driver"}
                description="Current driver location"
              />
            )}
          </MapView>

          {/* Bottom Panel (absolute, safe area aware) */}
          <View style={[styles.panel, { paddingBottom: 14 + insets.bottom }]}>
            <View style={styles.rowSpace}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.statusTitle}>
                  {STATUS_STEPS[activeIndex]?.label ?? "In progress"}
                </Text>

                {typeof order.etaMinutes === "number" && (
                  <Text style={styles.subtle}>ETA ~ {order.etaMinutes} min</Text>
                )}
              </View>

              <View style={styles.actions}>
                <Pressable style={styles.smallBtn} onPress={callDriver}>
                  <Ionicons name="call-outline" size={16} />
                  <Text style={styles.smallBtnText}>Call</Text>
                </Pressable>

                <Pressable style={styles.smallBtn} onPress={textDriver}>
                  <Ionicons name="chatbubble-ellipses-outline" size={16} />
                  <Text style={styles.smallBtnText}>Text</Text>
                </Pressable>
              </View>
            </View>

            {/* Stepper */}
            <View style={styles.stepper}>
              {STATUS_STEPS.map((s, i) => {
                const done = i <= activeIndex;
                return (
                  <View key={s.key} style={styles.stepItem}>
                    <View style={[styles.dot, done && styles.dotActive]} />
                    <Text style={[styles.stepLabel, done && styles.stepLabelActive]}>
                      {s.label}
                    </Text>
                  </View>
                );
              })}
            </View>

            {!!order.driver?.name && (
              <Text style={styles.subtle}>
                Driver:{" "}
                <Text style={{ fontWeight: "600", color: "#111" }}>{order.driver.name}</Text>
              </Text>
            )}

            {/* Debug helper (you can remove later) */}
            <Text style={[styles.subtle, { marginTop: 4 }]}>
              Status from DB:{" "}
              <Text style={{ color: "#111", fontWeight: "700" }}>{String(order.status)}</Text>
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const YELLOW = "#FFC800";
const LIGHT = "#FFF2B8";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "800" },

  mapWrap: { flex: 1 },
  map: { flex: 1 },

  // ✅ absolute panel prevents “out of screen” on iPhone
  panel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingTop: 14,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    borderColor: "#eee",
  },

  rowSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statusTitle: { fontSize: 22, fontWeight: "900" },
  subtle: { color: "#666", marginTop: 2 },

  actions: { flexDirection: "row", gap: 10 },

  smallBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  smallBtnText: { fontWeight: "800" },

  // ✅ stepper now wraps instead of going off screen
  stepper: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  stepItem: { flexDirection: "row", alignItems: "center" },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#ddd", marginRight: 6 },
  dotActive: { backgroundColor: YELLOW },
  stepLabel: { color: "#888", fontSize: 12 },
  stepLabelActive: { color: "#111", fontWeight: "800" },

  backBtn: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: LIGHT,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
