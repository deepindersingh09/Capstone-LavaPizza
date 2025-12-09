// app/agent/notifications-settings.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

export default function NotificationsSettings() {
  const { theme, spacing, borderRadius, fontSize, elevation } = useTheme();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [shiftReminders, setShiftReminders] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [promotionalEmails, setPromotionalEmails] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary, ...elevation.md }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textInverse} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textInverse, fontSize: fontSize.lg }]}>
          Notification Settings
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}>
        {/* Push Notifications Section */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.surface,
              padding: spacing.lg,
              marginBottom: spacing.md,
              borderRadius: borderRadius.lg,
              borderColor: theme.border,
              borderWidth: 1,
              ...elevation.sm,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="notifications" size={24} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fontSize.md }]}>
              Push Notifications
            </Text>
          </View>

          <View style={[styles.settingRow, { marginTop: spacing.md }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: theme.text, fontSize: fontSize.sm }]}>
                Enable Push Notifications
              </Text>
              <Text
                style={[styles.settingDesc, { color: theme.textSecondary, fontSize: fontSize.xs }]}
              >
                Receive notifications on your device
              </Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: "#ccc", true: theme.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.settingRow, { marginTop: spacing.md }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: theme.text, fontSize: fontSize.sm }]}>
                New Order Alerts
              </Text>
              <Text
                style={[styles.settingDesc, { color: theme.textSecondary, fontSize: fontSize.xs }]}
              >
                Get notified when new orders are available
              </Text>
            </View>
            <Switch
              value={orderAlerts}
              onValueChange={setOrderAlerts}
              trackColor={{ false: "#ccc", true: theme.primary }}
              thumbColor="#fff"
              disabled={!pushNotifications}
            />
          </View>

          <View style={[styles.settingRow, { marginTop: spacing.md }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: theme.text, fontSize: fontSize.sm }]}>
                Shift Reminders
              </Text>
              <Text
                style={[styles.settingDesc, { color: theme.textSecondary, fontSize: fontSize.xs }]}
              >
                Reminders for upcoming shifts
              </Text>
            </View>
            <Switch
              value={shiftReminders}
              onValueChange={setShiftReminders}
              trackColor={{ false: "#ccc", true: theme.primary }}
              thumbColor="#fff"
              disabled={!pushNotifications}
            />
          </View>
        </View>

        {/* Sound & Vibration */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.surface,
              padding: spacing.lg,
              marginBottom: spacing.md,
              borderRadius: borderRadius.lg,
              borderColor: theme.border,
              borderWidth: 1,
              ...elevation.sm,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="volume-high" size={24} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fontSize.md }]}>
              Sound & Vibration
            </Text>
          </View>

          <View style={[styles.settingRow, { marginTop: spacing.md }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: theme.text, fontSize: fontSize.sm }]}>
                Notification Sound
              </Text>
              <Text
                style={[styles.settingDesc, { color: theme.textSecondary, fontSize: fontSize.xs }]}
              >
                Play sound for notifications
              </Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: "#ccc", true: theme.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.settingRow, { marginTop: spacing.md }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: theme.text, fontSize: fontSize.sm }]}>
                Vibration
              </Text>
              <Text
                style={[styles.settingDesc, { color: theme.textSecondary, fontSize: fontSize.xs }]}
              >
                Vibrate for notifications
              </Text>
            </View>
            <Switch
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              trackColor={{ false: "#ccc", true: theme.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Email Notifications */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.surface,
              padding: spacing.lg,
              marginBottom: spacing.md,
              borderRadius: borderRadius.lg,
              borderColor: theme.border,
              borderWidth: 1,
              ...elevation.sm,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="mail" size={24} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fontSize.md }]}>
              Email Notifications
            </Text>
          </View>

          <View style={[styles.settingRow, { marginTop: spacing.md }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: theme.text, fontSize: fontSize.sm }]}>
                Email Notifications
              </Text>
              <Text
                style={[styles.settingDesc, { color: theme.textSecondary, fontSize: fontSize.xs }]}
              >
                Receive important updates via email
              </Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: "#ccc", true: theme.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.settingRow, { marginTop: spacing.md }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: theme.text, fontSize: fontSize.sm }]}>
                Promotional Emails
              </Text>
              <Text
                style={[styles.settingDesc, { color: theme.textSecondary, fontSize: fontSize.xs }]}
              >
                Special offers and promotions
              </Text>
            </View>
            <Switch
              value={promotionalEmails}
              onValueChange={setPromotionalEmails}
              trackColor={{ false: "#ccc", true: theme.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Info Note */}
        <View
          style={[
            styles.infoBox,
            {
              backgroundColor: theme.info + "20",
              padding: spacing.md,
              borderRadius: borderRadius.md,
              borderWidth: 1,
              borderColor: theme.info,
            },
          ]}
        >
          <Ionicons name="information-circle" size={20} color={theme.info} />
          <Text
            style={[
              styles.infoText,
              { color: theme.text, fontSize: fontSize.xs, marginLeft: spacing.sm },
            ]}
          >
            You can change these settings at any time. Some notifications may be required for the
            app to function properly.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: {
    fontWeight: "700",
    flex: 1,
    marginLeft: 16,
  },
  section: {
    // Styles applied inline
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionTitle: {
    fontWeight: "700",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingLabel: {
    fontWeight: "600",
  },
  settingDesc: {
    marginTop: 2,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoText: {
    flex: 1,
    lineHeight: 18,
  },
});
