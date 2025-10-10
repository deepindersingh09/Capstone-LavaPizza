import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";

export default function Support() {
  const router = useRouter();

  const open = async (url: string) => {
    const can = await Linking.canOpenURL(url);
    if (!can) return Alert.alert("Unavailable", "This action isn't supported on your device.");
    return Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 28 }}>
      <Text style={styles.title}>Support</Text>
      <Text style={styles.subtitle}>We’re here to help with anything Lava Pizza YYC.</Text>

      {/* Quick Actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Contact</Text>
        <View style={styles.rowWrap}>
          <Pressable style={styles.actionBtn} onPress={() => open("tel:+14035551234")}>
            <Ionicons name="call-outline" size={18} />
            <Text style={styles.actionText}>Call</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={() => open("mailto:support@lavapizzayyc.com")}>
            <Ionicons name="mail-outline" size={18} />
            <Text style={styles.actionText}>Email</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={() => open("sms:+14035551234")}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} />
            <Text style={styles.actionText}>Text</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={() => open("https://instagram.com/lavapizzayyc")}>
            <MaterialCommunityIcons name="instagram" size={18} />
            <Text style={styles.actionText}>Instagram</Text>
          </Pressable>
        </View>
      </View>

      {/* Order Help */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Order Help</Text>
        <Pressable style={styles.itemRow} onPress={() => router.push("/order_history")}>
          <Text style={styles.itemText}>Where is my order?</Text>
          <Ionicons name="chevron-forward" size={20} />
        </Pressable>
        <Pressable style={styles.itemRow} onPress={() => router.push("/delivery_address")}>
          <Text style={styles.itemText}>Update delivery address</Text>
          <Ionicons name="chevron-forward" size={20} />
        </Pressable>
        <Pressable style={styles.itemRow} onPress={() => router.push("/(drawer)/(tabs)/home/notification")}>
          <Text style={styles.itemText}>Notifications & alerts</Text>
          <Ionicons name="chevron-forward" size={20} />
        </Pressable>
        <Link href="/faq" asChild>
          <Pressable style={styles.itemRow}>
            <Text style={styles.itemText}>FAQ</Text>
            <Ionicons name="chevron-forward" size={20} />
          </Pressable>
        </Link>
      </View>

      {/* Store Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Store Information</Text>

        <Text style={styles.sectionLabel}>Hours</Text>
        <Text style={styles.mono}>
          Mon–Thu: 11:00 AM – 10:00 PM{"\n"}
          Fri–Sat: 11:00 AM – 12:00 AM{"\n"}
          Sun: 12:00 PM – 9:00 PM
        </Text>

        <Text style={[styles.sectionLabel, { marginTop: 14 }]}>Locations</Text>
        <View style={styles.location}>
          <Ionicons name="location-outline" size={18} />
          <Text style={styles.locationText}>Unit 112, 20 Saddlestone Dr NE, Calgary</Text>
        </View>
        <View style={styles.location}>
          <Ionicons name="location-outline" size={18} />
          <Text style={styles.locationText}>1211 14 St SW #4, Calgary</Text>
        </View>

        <Pressable style={[styles.itemRow, { marginTop: 8 }]} onPress={() => open("https://maps.google.com/?q=Lava+Pizza+YYC")}>
          <Text style={styles.itemText}>Open in Maps</Text>
          <Ionicons name="open-outline" size={20} />
        </Pressable>
      </View>

      {/* Policies */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Policies</Text>
        <Link href="/policy/refund" asChild>
          <Pressable style={styles.itemRow}>
            <Text style={styles.itemText}>Refunds & cancellations</Text>
            <Ionicons name="chevron-forward" size={20} />
          </Pressable>
        </Link>
        <Link href="/policy/privacy" asChild>
          <Pressable style={styles.itemRow}>
            <Text style={styles.itemText}>Privacy policy</Text>
            <Ionicons name="chevron-forward" size={20} />
          </Pressable>
        </Link>
        <Link href="/policy/terms" asChild>
          <Pressable style={styles.itemRow}>
            <Text style={styles.itemText}>Terms of service</Text>
            <Ionicons name="chevron-forward" size={20} />
          </Pressable>
        </Link>
      </View>

      {/* Footer CTA */}
      <Pressable style={styles.cta} onPress={() => open("mailto:support@lavapizzayyc.com")}>
        <Text style={styles.ctaText}>Contact Support</Text>
      </Pressable>
    </ScrollView>
  );
}

const YELLOW = "#FFC800";
const LIGHT = "#FFF2B8";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 22, fontWeight: "800" },
  subtitle: { marginTop: 6, color: "#555" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },

  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: LIGHT,
  },
  actionText: { fontWeight: "600" },

  itemRow: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: { fontSize: 15 },

  sectionLabel: { marginTop: 6, fontWeight: "700", color: "#333" },
  mono: { fontFamily: "System", marginTop: 4, color: "#444" },

  location: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  locationText: { flex: 1, color: "#333" },

  cta: {
    marginTop: 18,
    backgroundColor: YELLOW,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  ctaText: { fontWeight: "800" },
});
