import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Alert, Linking, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type LatLng = { lat: number; lng: number };

type Order = {
  status: "RECEIVED" | "PREPARING" | "BAKING" | "OUT_FOR_DELIVERY" | "DELIVERED" | string;
  etaMinutes?: number;
  updatedAt?: number;
  store?: { name?: string; location?: LatLng };
  customer?: { location?: LatLng };
  driver?: { name?: string; phone?: string; location?: LatLng; heading?: number };
};

const STATUS_STEPS = [
  { key: "RECEIVED", label: "Received" },
  { key: "PREPARING", label: "Preparing" },
  { key: "BAKING", label: "Baking" },
  { key: "OUT_FOR_DELIVERY", label: "Out for delivery" },
  { key: "DELIVERED", label: "Delivered" },
] as const;

export default function OrderTracking() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView>(null);

  // 👉 MOCK: seed an order and simulate movement + status changes
  useEffect(() => {
    // Calgary-ish coordinates
    const storeLoc: LatLng = { lat: 51.0605, lng: -113.9730 };     // NE location
    const customerLoc: LatLng = { lat: 51.0486, lng: -114.0708 };  // DT Calgary

    const seed: Order = {
      status: "RECEIVED",
      etaMinutes: 22,
      updatedAt: Date.now(),
      store: { name: "Lava Pizza YYC - NE", location: storeLoc },
      customer: { location: customerLoc },
      driver: {
        name: "Gurpreet",
        phone: "+14035550123",
        location: { ...storeLoc },
        heading: 90,
      },
    };

    setOrder(seed);
    setLoading(false);

    // Status timeline (seconds from now)
    const timers: (number | NodeJS.Timeout)[] = [];
    timers.push(setTimeout(() => setOrder((o) => o && { ...o, status: "PREPARING" }), 2500));
    timers.push(setTimeout(() => setOrder((o) => o && { ...o, status: "BAKING" }), 5500));
    timers.push(setTimeout(() => setOrder((o) => o && { ...o, status: "OUT_FOR_DELIVERY" }), 8500));

    // Driver movement tick (every 1.5s) once OUT_FOR_DELIVERY
    let moveInterval: NodeJS.Timeout | number | null = null;
    const startMoveTimer = setTimeout(() => {
      moveInterval = setInterval(() => {
        setOrder((o) => {
          if (!o || !o.driver?.location || !o.customer?.location) return o;
          if (o.status === "DELIVERED") return o;

          // move a small step toward the customer
          const cur = o.driver.location;
          const dest = o.customer.location;

          // simple lerp
          const step = 0.18; // 0..1 (higher moves faster)
          const nextLat = cur.lat + (dest.lat - cur.lat) * step;
          const nextLng = cur.lng + (dest.lng - cur.lng) * step;

          // compute remaining distance to decide delivery
          const dLat = dest.lat - nextLat;
          const dLng = dest.lng - nextLng;
          const dist = Math.sqrt(dLat * dLat + dLng * dLng);

          const nextEta = Math.max(0, (o.etaMinutes ?? 22) - 1);

          if (dist < 0.0025) {
            // Arrived
            return { ...o, driver: { ...o.driver!, location: dest }, etaMinutes: 0, status: "DELIVERED" };
          }

          return {
            ...o,
            driver: { ...o.driver!, location: { lat: nextLat, lng: nextLng } },
            etaMinutes: nextEta,
            updatedAt: Date.now(),
          };
        });
      }, 1500);
    }, 9000);
    timers.push(startMoveTimer);

    // Safety auto-deliver after ~20s from movement start
    timers.push(setTimeout(() => {
      setOrder((o) => (o ? { ...o, status: "DELIVERED", etaMinutes: 0 } : o));
      if (moveInterval) clearInterval(moveInterval);
    }, 9000 + 20000));

    return () => {
      timers.forEach(clearTimeout);
      if (moveInterval) clearInterval(moveInterval);
    };
  }, [orderId]);

  // Fit map to markers when order changes
  useEffect(() => {
    if (!order || !mapRef.current) return;
    const pts: LatLng[] = [
      order.store?.location,
      order.customer?.location,
      order.driver?.location,
    ].filter(Boolean) as LatLng[];
    if (pts.length === 0) return;

    const coords = pts.map((p) => ({ latitude: p.lat, longitude: p.lng }));
    mapRef.current.fitToCoordinates(coords, {
      edgePadding: { top: 80, bottom: 220, left: 60, right: 60 },
      animated: true,
    });
  }, [order]);

  const activeIndex = useMemo(() => {
    const idx = STATUS_STEPS.findIndex((s) => s.key === order?.status);
    return idx === -1 ? 0 : idx;
  }, [order?.status]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFC800" />
        <Text style={{ marginTop: 10 }}>Loading your order…</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text>Order not found.</Text>
        <Pressable style={styles.backBtn} onPress={() => router.replace("./order-history")}>
          <Ionicons name="arrow-back" size={18} />
          <Text style={{ marginLeft: 6, fontWeight: "600" }}>Back to Order History</Text>
        </Pressable>
      </View>
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
    latitude: order.store?.location?.lat ?? 51.0447,
    longitude: order.store?.location?.lng ?? -114.0719,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.replace("./order-history")} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </Pressable>
        <Text style={styles.headerTitle}>Track Order</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Map */}
      <MapView ref={mapRef} style={styles.map} initialRegion={regionFallback}>
        {order.store?.location && (
          <Marker
            coordinate={{ latitude: order.store.location.lat, longitude: order.store.location.lng }}
            title={order.store.name ?? "Lava Pizza YYC"}
            description="Store"
            pinColor={Platform.OS === "ios" ? undefined : "orange"}
          />
        )}
        {order.customer?.location && (
          <Marker
            coordinate={{ latitude: order.customer.location.lat, longitude: order.customer.location.lng }}
            title="Your Address"
            description="Delivery destination"
          />
        )}
        {order.driver?.location && (
          <Marker
            coordinate={{ latitude: order.driver.location.lat, longitude: order.driver.location.lng }}
            title={order.driver.name ?? "Driver"}
            description="Current driver location"
          />
        )}
      </MapView>

      {/* Bottom Panel */}
      <View style={styles.panel}>
        <View style={styles.rowSpace}>
          <View>
            <Text style={styles.statusTitle}>
              {STATUS_STEPS[activeIndex]?.label ?? "In progress"}
            </Text>
            {!!order.etaMinutes && <Text style={styles.subtle}>ETA ~ {order.etaMinutes} min</Text>}
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
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
                <Text style={[styles.stepLabel, done && styles.stepLabelActive]}>{s.label}</Text>
                {i < STATUS_STEPS.length - 1 && (
                  <View style={[styles.stepLine, done && styles.stepLineActive]} />
                )}
              </View>
            );
          })}
        </View>

        {/* Driver info */}
        {order.driver?.name && (
          <Text style={styles.subtle}>
            Driver: <Text style={{ fontWeight: "600", color: "#111" }}>{order.driver.name}</Text>
          </Text>
        )}
      </View>
    </View>
  );
}

const YELLOW = "#FFC800";
const LIGHT = "#FFF2B8";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 18, fontWeight: "800" },

  map: { flex: 1 },

  panel: {
    backgroundColor: "#fff",
    padding: 14,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    borderColor: "#eee",
  },
  rowSpace: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statusTitle: { fontSize: 18, fontWeight: "800" },
  subtle: { color: "#666", marginTop: 2 },

  stepper: {
    marginTop: 12,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepItem: { flex: 1, alignItems: "center", flexDirection: "row" },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#ddd" },
  dotActive: { backgroundColor: YELLOW },
  stepLabel: { marginLeft: 8, color: "#888", fontSize: 12 },
  stepLabelActive: { color: "#111", fontWeight: "700" },
  stepLine: { flex: 1, height: 2, backgroundColor: "#eee", marginHorizontal: 8 },
  stepLineActive: { backgroundColor: YELLOW },

  smallBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  smallBtnText: { fontWeight: "700" },

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
