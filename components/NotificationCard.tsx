import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  type: "order" | "promo" | "system";
};

function Icon({ type }: { type: NotificationItem["type"] }) {
  if (type === "order") return <MaterialCommunityIcons name="pizza" size={22} />;
  if (type === "promo") return <Ionicons name="pricetags-outline" size={22} />;
  return <Ionicons name="notifications-outline" size={22} />;
}

export default function NotificationCard({ item }: { item: NotificationItem }) {
  return (
    <View style={[styles.card, !item.read && styles.unread]}>
      <View style={styles.row}>
        <View style={styles.dot} />
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <Text style={styles.body}>{item.body}</Text>
      <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#ececec",
    backgroundColor: "#fff",
  },
  unread: { borderColor: "#ffd666", backgroundColor: "#fffdf3" },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#FFB300", marginRight: 8 },
  title: { fontSize: 15, fontWeight: "700", flex: 1 },
  body: { fontSize: 13, color: "#444", marginTop: 4 },
  time: { fontSize: 11, color: "#777", marginTop: 8 },
});
