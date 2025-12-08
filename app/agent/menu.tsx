import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

export default function MenuPage() {
  const { theme, spacing, borderRadius, fontSize, elevation, isDark } = useTheme();
  const menuItems = [
    { label: "Profile", icon: "person-outline", route: "/agent/profile" },
    { label: "Vehicle Information", icon: "car-outline", route: "/agent/profile" }, // Link to vehicle page if you have one
    { label: "Shift Schedule", icon: "calendar-outline", route: "/agent/dashboard" },
    { label: "Earnings & Payouts", icon: "wallet-outline", route: "/agent/earnings" },
    { label: "Delivery History", icon: "time-outline", route: "/agent/earnings" },
    { label: "Settings", icon: "settings-outline", route: "/agent/dashboard" },
    { label: "Help & Support", icon: "help-circle-outline", route: "/agent/dashboard" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.primary}
      />

      {/* Header Area */}
      <View style={[styles.header, { backgroundColor: theme.primary, ...elevation.md }]}>
        <SafeAreaView>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={28} color={theme.textInverse} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.textInverse, fontSize: fontSize.lg }]}>
              Menu
            </Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Profile Summary in Menu */}
          <View style={styles.profileSection}>
            <View style={[styles.avatarContainer, { backgroundColor: theme.warning }]}>
              <Ionicons name="person" size={40} color="#fff" />
            </View>
            <View style={styles.profileText}>
              <Text style={[styles.name, { color: theme.textInverse, fontSize: fontSize.xl }]}>
                John Doe
              </Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color={theme.textInverse} />
                <Text style={[styles.rating, { color: theme.textInverse, fontSize: fontSize.sm }]}>
                  4.9 (120 deliveries)
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* Menu Options */}
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => router.push(item.route as any)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name={item.icon as any} size={22} color={theme.text} />
              <Text style={[styles.menuLabel, { color: theme.text, fontSize: fontSize.md }]}>
                {item.label}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace("/")}>
          <MaterialIcons name="logout" size={22} color={theme.danger} />
          <Text style={[styles.logoutText, { color: theme.danger, fontSize: fontSize.md }]}>
            Log Out
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* App Version */}
      <Text style={[styles.versionText, { color: theme.textTertiary, fontSize: fontSize.xs }]}>
        Lava Pizza Driver App v1.0.2
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { fontWeight: "700" },

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    marginTop: 10,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileText: { marginLeft: 15 },
  name: { fontWeight: "700" },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  rating: { marginLeft: 5, fontWeight: "600" },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  menuLeft: { flexDirection: "row", alignItems: "center" },
  menuLabel: { marginLeft: 15, fontWeight: "500" },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    paddingVertical: 15,
  },
  logoutText: { marginLeft: 15, fontWeight: "700" },

  versionText: {
    textAlign: "center",
    marginBottom: 20,
  },
});
