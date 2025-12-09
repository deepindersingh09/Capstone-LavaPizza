import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const { theme, spacing, borderRadius, fontSize, elevation, isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || "Delivery Agent",
    email: user?.email || "agent@example.com",
    phone: user?.phone || "+1 234-567-8900",
    location: "Calgary, AB",
  });

  // Load saved profile image on mount
  useEffect(() => {
    loadProfileImage();
  }, []);

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem("@profile_image");
      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (error) {
      console.error("Error loading profile image:", error);
    }
  };

  const handleChangeProfilePicture = async () => {
    Alert.alert("Change Profile Picture", "Choose how to add your photo", [
      {
        text: "Take Photo",
        onPress: () => pickImage("camera"),
      },
      {
        text: "Choose from Gallery",
        onPress: () => pickImage("gallery"),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const pickImage = async (source: "camera" | "gallery") => {
    try {
      if (source === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Required", "Camera permission is required to take photos.");
          return;
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Required", "Gallery permission is required to choose photos.");
          return;
        }
      }

      setImageLoading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);

        // Save to AsyncStorage
        await AsyncStorage.setItem("@profile_image", imageUri);
        Alert.alert("Success", "Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to update profile picture.");
    } finally {
      setImageLoading(false);
    }
  };

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
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleChangeProfilePicture}
            activeOpacity={0.8}
          >
            {imageLoading ? (
              <View
                style={[
                  styles.avatar,
                  { justifyContent: "center", alignItems: "center", backgroundColor: theme.border },
                ]}
              >
                <ActivityIndicator size="large" color={theme.primary} />
              </View>
            ) : (
              <>
                <Image
                  source={
                    profileImage
                      ? { uri: profileImage }
                      : { uri: "https://cdn-icons-png.flaticon.com/512/219/219983.png" }
                  }
                  style={styles.avatar}
                />
                <View style={[styles.cameraIconContainer, { backgroundColor: theme.primary }]}>
                  <Ionicons name="camera" size={18} color={theme.textInverse} />
                </View>
              </>
            )}
          </TouchableOpacity>
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
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color={theme.primary} />
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
  avatarContainer: {
    position: "relative",
  },
  avatar: { width: 80, height: 80, borderRadius: 40, marginRight: 15 },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
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
