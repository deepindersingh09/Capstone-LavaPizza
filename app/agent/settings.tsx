import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

export default function Settings() {
  const { theme, spacing, borderRadius, fontSize, elevation, isDark, toggleTheme } = useTheme();

  const [notifications, setNotifications] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [shiftReminders, setShiftReminders] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [locationTracking, setLocationTracking] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "Are you sure you want to clear app cache? This will free up storage space.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            Alert.alert("Success", "Cache cleared successfully!");
          },
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert("Reset Settings", "Are you sure you want to reset all settings to default?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          setNotifications(true);
          setOrderAlerts(true);
          setShiftReminders(true);
          setEmailNotifications(false);
          setLocationTracking(true);
          setSoundEnabled(true);
          setVibrationEnabled(true);
          Alert.alert("Success", "Settings reset to default!");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary, ...elevation.md }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textInverse} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textInverse, fontSize: fontSize.lg }]}>
          Settings
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Appearance */}
        <View style={[styles.section, { marginTop: spacing.lg }]}>
          <Text
            style={[
              styles.sectionHeader,
              { color: theme.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.sm },
            ]}
          >
            APPEARANCE
          </Text>
          <View
            style={[
              styles.settingCard,
              {
                backgroundColor: theme.surface,
                padding: spacing.lg,
                borderRadius: borderRadius.lg,
                ...elevation.sm,
              },
            ]}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name={isDark ? "moon" : "sunny"} size={22} color={theme.primary} />
                <View style={{ marginLeft: spacing.md }}>
                  <Text style={[styles.settingTitle, { color: theme.text, fontSize: fontSize.md }]}>
                    Dark Mode
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: theme.textSecondary, fontSize: fontSize.xs },
                    ]}
                  >
                    {isDark ? "Dark theme enabled" : "Light theme enabled"}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={[styles.section, { marginTop: spacing.lg }]}>
          <Text
            style={[
              styles.sectionHeader,
              { color: theme.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.sm },
            ]}
          >
            NOTIFICATIONS
          </Text>
          <View
            style={[
              styles.settingCard,
              {
                backgroundColor: theme.surface,
                padding: spacing.lg,
                borderRadius: borderRadius.lg,
                ...elevation.sm,
              },
            ]}
          >
            <View style={[styles.settingRow, { marginBottom: spacing.md }]}>
              <View style={styles.settingInfo}>
                <Ionicons name="notifications" size={22} color={theme.primary} />
                <View style={{ marginLeft: spacing.md }}>
                  <Text style={[styles.settingTitle, { color: theme.text, fontSize: fontSize.md }]}>
                    Push Notifications
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: theme.textSecondary, fontSize: fontSize.xs },
                    ]}
                  >
                    Receive app notifications
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#fff"
              />
            </View>

            <View style={[styles.settingRow, { marginBottom: spacing.md }]}>
              <View style={styles.settingInfo}>
                <Ionicons name="fast-food" size={22} color={theme.primary} />
                <View style={{ marginLeft: spacing.md }}>
                  <Text style={[styles.settingTitle, { color: theme.text, fontSize: fontSize.md }]}>
                    Order Alerts
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: theme.textSecondary, fontSize: fontSize.xs },
                    ]}
                  >
                    Get notified of new orders
                  </Text>
                </View>
              </View>
              <Switch
                value={orderAlerts}
                onValueChange={setOrderAlerts}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#fff"
                disabled={!notifications}
              />
            </View>

            <View style={[styles.settingRow, { marginBottom: spacing.md }]}>
              <View style={styles.settingInfo}>
                <Ionicons name="time" size={22} color={theme.primary} />
                <View style={{ marginLeft: spacing.md }}>
                  <Text style={[styles.settingTitle, { color: theme.text, fontSize: fontSize.md }]}>
                    Shift Reminders
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: theme.textSecondary, fontSize: fontSize.xs },
                    ]}
                  >
                    Reminders before shifts
                  </Text>
                </View>
              </View>
              <Switch
                value={shiftReminders}
                onValueChange={setShiftReminders}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#fff"
                disabled={!notifications}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="mail" size={22} color={theme.primary} />
                <View style={{ marginLeft: spacing.md }}>
                  <Text style={[styles.settingTitle, { color: theme.text, fontSize: fontSize.md }]}>
                    Email Notifications
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: theme.textSecondary, fontSize: fontSize.xs },
                    ]}
                  >
                    Receive updates via email
                  </Text>
                </View>
              </View>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Sound & Vibration */}
        <View style={[styles.section, { marginTop: spacing.lg }]}>
          <Text
            style={[
              styles.sectionHeader,
              { color: theme.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.sm },
            ]}
          >
            SOUND & VIBRATION
          </Text>
          <View
            style={[
              styles.settingCard,
              {
                backgroundColor: theme.surface,
                padding: spacing.lg,
                borderRadius: borderRadius.lg,
                ...elevation.sm,
              },
            ]}
          >
            <View style={[styles.settingRow, { marginBottom: spacing.md }]}>
              <View style={styles.settingInfo}>
                <Ionicons name="volume-high" size={22} color={theme.primary} />
                <View style={{ marginLeft: spacing.md }}>
                  <Text style={[styles.settingTitle, { color: theme.text, fontSize: fontSize.md }]}>
                    Sound
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: theme.textSecondary, fontSize: fontSize.xs },
                    ]}
                  >
                    Play notification sounds
                  </Text>
                </View>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="phone-portrait" size={22} color={theme.primary} />
                <View style={{ marginLeft: spacing.md }}>
                  <Text style={[styles.settingTitle, { color: theme.text, fontSize: fontSize.md }]}>
                    Vibration
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: theme.textSecondary, fontSize: fontSize.xs },
                    ]}
                  >
                    Vibrate on notifications
                  </Text>
                </View>
              </View>
              <Switch
                value={vibrationEnabled}
                onValueChange={setVibrationEnabled}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Privacy & Security */}
        <View style={[styles.section, { marginTop: spacing.lg }]}>
          <Text
            style={[
              styles.sectionHeader,
              { color: theme.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.sm },
            ]}
          >
            PRIVACY & SECURITY
          </Text>
          <View
            style={[
              styles.settingCard,
              {
                backgroundColor: theme.surface,
                padding: spacing.lg,
                borderRadius: borderRadius.lg,
                ...elevation.sm,
              },
            ]}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="location" size={22} color={theme.primary} />
                <View style={{ marginLeft: spacing.md }}>
                  <Text style={[styles.settingTitle, { color: theme.text, fontSize: fontSize.md }]}>
                    Location Tracking
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: theme.textSecondary, fontSize: fontSize.xs },
                    ]}
                  >
                    Required for deliveries
                  </Text>
                </View>
              </View>
              <Switch
                value={locationTracking}
                onValueChange={setLocationTracking}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* App Management */}
        <View style={[styles.section, { marginTop: spacing.lg }]}>
          <Text
            style={[
              styles.sectionHeader,
              { color: theme.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.sm },
            ]}
          >
            APP MANAGEMENT
          </Text>
          <View
            style={[
              styles.settingCard,
              {
                backgroundColor: theme.surface,
                borderRadius: borderRadius.lg,
                ...elevation.sm,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.actionRow,
                { padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.border },
              ]}
              onPress={handleClearCache}
            >
              <Ionicons name="trash-outline" size={22} color={theme.primary} />
              <Text
                style={[
                  styles.actionText,
                  { color: theme.text, fontSize: fontSize.md, marginLeft: spacing.md },
                ]}
              >
                Clear Cache
              </Text>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionRow, { padding: spacing.lg }]}
              onPress={handleResetSettings}
            >
              <Ionicons name="refresh-outline" size={22} color={theme.primary} />
              <Text
                style={[
                  styles.actionText,
                  { color: theme.text, fontSize: fontSize.md, marginLeft: spacing.md },
                ]}
              >
                Reset Settings
              </Text>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <View style={[styles.section, { marginTop: spacing.lg, marginBottom: spacing.xl }]}>
          <Text
            style={[
              styles.sectionHeader,
              { color: theme.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.sm },
            ]}
          >
            ABOUT
          </Text>
          <View
            style={[
              styles.settingCard,
              {
                backgroundColor: theme.surface,
                padding: spacing.lg,
                borderRadius: borderRadius.lg,
                ...elevation.sm,
              },
            ]}
          >
            <View style={[styles.infoRow, { marginBottom: spacing.sm }]}>
              <Text
                style={[styles.infoLabel, { color: theme.textSecondary, fontSize: fontSize.sm }]}
              >
                App Version
              </Text>
              <Text style={[styles.infoValue, { color: theme.text, fontSize: fontSize.sm }]}>
                1.0.0
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text
                style={[styles.infoLabel, { color: theme.textSecondary, fontSize: fontSize.sm }]}
              >
                Build Number
              </Text>
              <Text style={[styles.infoValue, { color: theme.text, fontSize: fontSize.sm }]}>
                100
              </Text>
            </View>
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
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/agent/dashboard" as any)}
        >
          <Ionicons name="home-outline" size={24} color={theme.textSecondary} />
          <Text style={[styles.navText, { color: theme.textSecondary, fontSize: fontSize.xs }]}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/agent/activeDeliveries" as any)}
        >
          <MaterialIcons name="delivery-dining" size={28} color={theme.textSecondary} />
          <Text style={[styles.navText, { color: theme.textSecondary, fontSize: fontSize.xs }]}>
            Deliveries
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/agent/earnings" as any)}
        >
          <Ionicons name="wallet-outline" size={24} color={theme.textSecondary} />
          <Text style={[styles.navText, { color: theme.textSecondary, fontSize: fontSize.xs }]}>
            Earnings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/agent/profile" as any)}
        >
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
    padding: 16,
  },
  headerTitle: {
    fontWeight: "700",
    flex: 1,
    marginLeft: 16,
  },
  section: {
    marginHorizontal: 16,
  },
  sectionHeader: {
    fontWeight: "700",
    marginLeft: 4,
  },
  settingCard: {},
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingTitle: {
    fontWeight: "600",
  },
  settingDescription: {
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    flex: 1,
    fontWeight: "500",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {},
  infoValue: {
    fontWeight: "600",
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
  },
  navText: {
    fontWeight: "600",
    marginTop: 4,
  },
});
