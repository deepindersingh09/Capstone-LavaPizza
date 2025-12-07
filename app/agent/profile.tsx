import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {
  const { theme, spacing, borderRadius, fontSize, elevation, isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [profile, setProfile] = useState({
    name: user?.name || "Delivery Agent",
    email: user?.email || "agent@example.com",
    phone: user?.phone || "+1 234-567-8900",
    location: "Calgary, AB",
  });

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSaveProfile = () => {
    setIsEditing(false);
    Alert.alert("Profile Updated", "Your changes have been saved successfully.");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => router.replace("/auth/signup-delivery"),
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      {/* --- Header --- */}
      <View style={[styles.topBar, { backgroundColor: theme.primary, ...elevation.md }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textInverse} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: theme.textInverse, fontSize: fontSize.lg }]}>
          My Profile
        </Text>
        <TouchableOpacity onPress={handleEditToggle}>
          <Ionicons
            name={isEditing ? "close-outline" : "create-outline"}
            size={24}
            color={theme.textInverse}
          />
        </TouchableOpacity>
      </View>

      {/* --- Profile Info --- */}
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: theme.surface,
              padding: spacing.lg,
              marginBottom: spacing.md,
              borderRadius: borderRadius.lg,
              borderColor: theme.border,
              ...elevation.sm,
            },
          ]}
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/219/219983.png",
            }}
            style={styles.avatar}
          />
          <View style={styles.infoContainer}>
            {isEditing ? (
              <>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.border,
                      color: theme.text,
                      fontSize: fontSize.md,
                    },
                  ]}
                  value={profile.name}
                  onChangeText={(t) => setProfile({ ...profile, name: t })}
                  placeholderTextColor={theme.textTertiary}
                />
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.border,
                      color: theme.text,
                      fontSize: fontSize.md,
                    },
                  ]}
                  value={profile.email}
                  onChangeText={(t) => setProfile({ ...profile, email: t })}
                  placeholderTextColor={theme.textTertiary}
                />
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.border,
                      color: theme.text,
                      fontSize: fontSize.md,
                    },
                  ]}
                  value={profile.phone}
                  onChangeText={(t) => setProfile({ ...profile, phone: t })}
                  placeholderTextColor={theme.textTertiary}
                />
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.border,
                      color: theme.text,
                      fontSize: fontSize.md,
                    },
                  ]}
                  value={profile.location}
                  onChangeText={(t) => setProfile({ ...profile, location: t })}
                  placeholderTextColor={theme.textTertiary}
                />
                <TouchableOpacity
                  style={[
                    styles.saveBtn,
                    {
                      backgroundColor: theme.primary,
                      padding: spacing.sm,
                      borderRadius: borderRadius.md,
                    },
                  ]}
                  onPress={handleSaveProfile}
                >
                  <Text
                    style={[styles.saveText, { color: theme.textInverse, fontSize: fontSize.md }]}
                  >
                    Save Profile
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={[styles.name, { color: theme.text, fontSize: fontSize.lg }]}>
                  {profile.name}
                </Text>
                <Text
                  style={[styles.detail, { color: theme.textSecondary, fontSize: fontSize.sm }]}
                >
                  {profile.email}
                </Text>
                <Text
                  style={[styles.detail, { color: theme.textSecondary, fontSize: fontSize.sm }]}
                >
                  {profile.phone}
                </Text>
                <Text
                  style={[styles.detail, { color: theme.textSecondary, fontSize: fontSize.sm }]}
                >
                  {profile.location}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* --- Dark Mode --- */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.surface,
              padding: spacing.lg,
              marginBottom: spacing.md,
              borderRadius: borderRadius.lg,
              borderColor: theme.border,
              ...elevation.sm,
            },
          ]}
        >
          <View style={styles.rowBetween}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
              <Ionicons name={isDark ? "moon" : "sunny"} size={22} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fontSize.md }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: "#ccc", true: theme.primary }}
              thumbColor="#fff"
            />
          </View>
          <Text style={[styles.sectionDesc, { color: theme.textSecondary, fontSize: fontSize.sm }]}>
            {isDark ? "Dark theme is enabled" : "Light theme is enabled"}
          </Text>
        </View>

        {/* --- Availability --- */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.surface,
              padding: spacing.lg,
              marginBottom: spacing.md,
              borderRadius: borderRadius.lg,
              borderColor: theme.border,
              ...elevation.sm,
            },
          ]}
        >
          <View style={styles.rowBetween}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
              <Ionicons name="bicycle" size={22} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fontSize.md }]}>
                Availability
              </Text>
            </View>
            <Switch
              value={isAvailable}
              onValueChange={setIsAvailable}
              trackColor={{ false: "#ccc", true: theme.primary }}
              thumbColor="#fff"
            />
          </View>
          <Text style={[styles.sectionDesc, { color: theme.textSecondary, fontSize: fontSize.sm }]}>
            {isAvailable
              ? "You are currently available for delivery orders."
              : "You are currently offline."}
          </Text>
        </View>

        {/* --- Notification Settings --- */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.surface,
              padding: spacing.lg,
              marginBottom: spacing.md,
              borderRadius: borderRadius.lg,
              borderColor: theme.border,
              ...elevation.sm,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fontSize.md }]}>
            Notification Settings
          </Text>
          <Text
            style={[
              styles.sectionDesc,
              { color: theme.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xs },
            ]}
          >
            Manage alerts and reminders for orders and updates.
          </Text>
          <TouchableOpacity style={[styles.settingBtn, { marginTop: spacing.sm }]}>
            <Ionicons name="notifications-outline" size={22} color={theme.primary} />
            <Text style={[styles.settingText, { color: theme.text, fontSize: fontSize.sm }]}>
              Customize Notifications
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- Help & Support --- */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.surface,
              padding: spacing.lg,
              marginBottom: spacing.md,
              borderRadius: borderRadius.lg,
              borderColor: theme.border,
              ...elevation.sm,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fontSize.md }]}>
            Support & Help Center
          </Text>
          <TouchableOpacity style={[styles.settingBtn, { marginTop: spacing.sm }]}>
            <Ionicons name="chatbubbles-outline" size={22} color={theme.primary} />
            <Text style={[styles.settingText, { color: theme.text, fontSize: fontSize.sm }]}>
              Live Chat Support
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.settingBtn, { marginTop: spacing.sm }]}>
            <Ionicons name="help-circle-outline" size={22} color={theme.primary} />
            <Text style={[styles.settingText, { color: theme.text, fontSize: fontSize.sm }]}>
              FAQ & Tutorials
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- Logout Button --- */}
        <TouchableOpacity
          style={[
            styles.logoutBtn,
            {
              backgroundColor: theme.danger,
              padding: spacing.md,
              borderRadius: borderRadius.md,
              marginTop: spacing.sm,
            },
          ]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={[styles.logoutText, { color: "#fff", fontSize: fontSize.md }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* --- Bottom Nav --- */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: theme.surface, borderTopColor: theme.border, ...elevation.lg },
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
          <MaterialIcons name="delivery-dining" size={26} color={theme.textSecondary} />
          <Text style={[styles.navText, { color: theme.textSecondary, fontSize: fontSize.xs }]}>
            Deliveries
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={26} color={theme.primary} />
          <Text style={[styles.navText, { color: theme.primary, fontSize: fontSize.xs }]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  topTitle: { fontWeight: "700", flex: 1, marginLeft: 16 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  avatar: { width: 80, height: 80, borderRadius: 40, marginRight: 15 },
  infoContainer: { flex: 1 },
  name: { fontWeight: "600" },
  detail: { marginTop: 3 },
  input: {
    borderBottomWidth: 1,
    marginVertical: 6,
    paddingVertical: 4,
  },
  saveBtn: {
    alignItems: "center",
    marginTop: 8,
  },
  saveText: { fontWeight: "600" },
  section: {
    borderWidth: 1,
  },
  sectionTitle: { fontWeight: "600" },
  sectionDesc: { marginTop: 4 },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: { marginLeft: 8 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: { fontWeight: "600", marginLeft: 6 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  navText: {
    fontWeight: "600",
  },
});
