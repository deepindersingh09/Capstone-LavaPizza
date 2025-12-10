import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

// Mock Data for Pizza App Notifications
const NOTIFICATIONS = [
  {
    id: "1",
    title: "New Order Assigned",
    message: "Order #12345 is ready for pickup at Pizza Point.",
    time: "2m ago",
    type: "order",
  },
  {
    id: "2",
    title: "Big Tip Received! 💰",
    message: "You received a $10.00 tip from Alex Johnson.",
    time: "15m ago",
    type: "money",
  },
  {
    id: "3",
    title: "High Demand Area",
    message: "Downtown is currently busy. +$2.00 peak pay active.",
    time: "1h ago",
    type: "info",
  },
  {
    id: "4",
    title: "Shift Reminder",
    message: "Your shift starts in 2 hours.",
    time: "3h ago",
    type: "system",
  },
  {
    id: "5",
    title: "Weekly Payout",
    message: "$340.00 has been transferred to your wallet.",
    time: "1d ago",
    type: "money",
  },
];

export default function Notifications() {
  const { theme, spacing, borderRadius, fontSize, elevation, isDark } = useTheme();

  const renderItem = ({ item }: { item: any }) => {
    let iconName: any = "bell-outline";
    let iconColor: string = theme.text;
    let bgIcon: string = theme.surface;

    // Customize icons based on notification type
    if (item.type === "order") {
      iconName = "pizza";
      iconColor = theme.warning;
      bgIcon = isDark ? "#3d2f0a" : "#fff4e0";
    } else if (item.type === "money") {
      iconName = "cash";
      iconColor = theme.success;
      bgIcon = isDark ? "#0a2f0f" : "#e8f5e9";
    } else if (item.type === "info") {
      iconName = "information";
      iconColor = theme.info;
      bgIcon = isDark ? "#0a1f2f" : "#e3f2fd";
    }

    return (
      <View style={[styles.card, { backgroundColor: theme.surface, ...elevation.sm }]}>
        <View style={[styles.iconBox, { backgroundColor: bgIcon }]}>
          <MaterialCommunityIcons name={iconName} size={24} color={iconColor} />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: theme.text, fontSize: fontSize.md }]}>
              {item.title}
            </Text>
            <Text style={[styles.time, { color: theme.textTertiary, fontSize: fontSize.xs }]}>
              {item.time}
            </Text>
          </View>
          <Text style={[styles.message, { color: theme.textSecondary, fontSize: fontSize.sm }]}>
            {item.message}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.primary}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary, ...elevation.md }]}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={theme.textInverse} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.textInverse, fontSize: fontSize.lg }]}>
              Notifications
            </Text>
            <View style={{ width: 24 }} />
          </View>
        </SafeAreaView>
      </View>

      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: spacing.lg }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { fontWeight: "700" },
  backBtn: { padding: 4 },

  card: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  textContainer: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: { fontWeight: "700" },
  time: {},
  message: { lineHeight: 18 },
});
