import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";

const STORAGE_KEY = "@lava_settings_v1";
const YELLOW = "#FFC800";
const LIGHT = "#FFF2B8";

type SettingsState = {
  darkMode: boolean;
  pushNotifications: boolean;
  language: "English" | "French";
};

export default function Settings() {
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsState>({
    darkMode: false,
    pushNotifications: true,
    language: "English",
  });

  // Load saved settings
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setSettings(JSON.parse(raw));
    })();
  }, []);

  // Save on change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings)).catch(() => {});
  }, [settings]);

  const toggle = (k: keyof SettingsState) =>
    setSettings((s) => ({ ...s, [k]: !s[k] }));

  const setLanguage = (lang: SettingsState["language"]) =>
    setSettings((s) => ({ ...s, language: lang }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Account */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account</Text>
        <Link href="/profile" asChild>
          <Pressable style={styles.itemRow}>
            <Text style={styles.itemText}>Profile & Details</Text>
            <Ionicons name="chevron-forward" size={18} />
          </Pressable>
        </Link>
        <Link href="/delivery_address" asChild>
          <Pressable style={styles.itemRow}>
            <Text style={styles.itemText}>Saved Addresses</Text>
            <Ionicons name="chevron-forward" size={18} />
          </Pressable>
        </Link>
        <Pressable
          style={styles.itemRow}
          onPress={() => Alert.alert("Change Password", "Open change password flow here.")}
        >
          <Text style={styles.itemText}>Change Password</Text>
          <Ionicons name="key-outline" size={18} />
        </Pressable>
      </View>

      {/* Preferences */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Preferences</Text>

        <View style={styles.itemRow}>
          <Text style={styles.itemText}>Dark Mode</Text>
          <Switch
            value={settings.darkMode}
            onValueChange={() => toggle("darkMode")}
          />
        </View>

        <View style={styles.itemRow}>
          <Text style={styles.itemText}>Push Notifications</Text>
          <Switch
            value={settings.pushNotifications}
            onValueChange={() => toggle("pushNotifications")}
          />
        </View>

        <View style={[styles.itemRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.itemText}>Language</Text>
          <View style={styles.chipRow}>
            {(["English", "French"] as const).map((lang) => {
              const active = settings.language === lang;
              return (
                <Pressable
                  key={lang}
                  onPress={() => setLanguage(lang)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {lang}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      {/* Orders */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Orders</Text>
        <Link href="/order_history" asChild>
          <Pressable style={styles.itemRow}>
            <Text style={styles.itemText}>Order History</Text>
            <Ionicons name="chevron-forward" size={18} />
          </Pressable>
        </Link>
        <Link href="/(drawer)/(tabs)/home/notification" asChild>
          <Pressable style={styles.itemRow}>
            <Text style={styles.itemText}>Notification Settings</Text>
            <Ionicons name="chevron-forward" size={18} />
          </Pressable>
        </Link>
      </View>

      {/* About */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>About</Text>
        <Link href="/support" asChild>
          <Pressable style={styles.itemRow}>
            <Text style={styles.itemText}>Support</Text>
            <Ionicons name="chevron-forward" size={18} />
          </Pressable>
        </Link>
        <Link href="/policy/privacy" asChild>
          <Pressable style={styles.itemRow}>
            <Text style={styles.itemText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={18} />
          </Pressable>
        </Link>
        <Link href="/policy/terms" asChild>
          <Pressable style={styles.itemRow}>
            <Text style={styles.itemText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={18} />
          </Pressable>
        </Link>
        <View style={[styles.itemRow, { borderBottomWidth: 0 }]}>
          <Text style={[styles.itemText, { color: "#666" }]}>App Version</Text>
          <Text style={{ color: "#666" }}>1.0.0</Text>
        </View>
      </View>

      {/* Sign out */}
      <Pressable
        style={styles.cta}
        onPress={() => Alert.alert("Log out", "Are you sure?", [
          { text: "Cancel", style: "cancel" },
          { text: "Log Out", style: "destructive", onPress: () => {/* signOut() */} },
        ])}
      >
        <Text style={styles.ctaText}>Log Out</Text>
      </Pressable>
    </ScrollView>
  );
}

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
  headerTitle: { fontSize: 20, fontWeight: "800" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTitle: { fontSize: 14, fontWeight: "700", color: "#333", marginBottom: 6 },

  itemRow: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  itemText: { fontSize: 15 },

  chipRow: { flexDirection: "row", gap: 8 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: LIGHT,
  },
  chipActive: { backgroundColor: YELLOW },
  chipText: { fontWeight: "600" },
  chipTextActive: { fontWeight: "800" },

  cta: {
    marginTop: 18,
    marginHorizontal: 16,
    backgroundColor: YELLOW,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  ctaText: { fontWeight: "800" },
});
