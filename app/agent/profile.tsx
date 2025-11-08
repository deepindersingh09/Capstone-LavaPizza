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
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [profile, setProfile] = useState({
    name: "Rohit Kumar",
    email: "rohit.agent@example.com",
    phone: "+91 9876543210",
    location: "Ludhiana, Punjab",
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
    <View style={styles.container}>
      {/* --- Header --- */}
      <View style={styles.topBar}>
        <Text style={styles.topTitle}>My Profile</Text>
        <TouchableOpacity onPress={handleEditToggle}>
          <Ionicons
            name={isEditing ? "close-outline" : "create-outline"}
            size={24}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      {/* --- Profile Info --- */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.profileCard}>
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
                  style={styles.input}
                  value={profile.name}
                  onChangeText={(t) => setProfile({ ...profile, name: t })}
                />
                <TextInput
                  style={styles.input}
                  value={profile.email}
                  onChangeText={(t) => setProfile({ ...profile, email: t })}
                />
                <TextInput
                  style={styles.input}
                  value={profile.phone}
                  onChangeText={(t) => setProfile({ ...profile, phone: t })}
                />
                <TextInput
                  style={styles.input}
                  value={profile.location}
                  onChangeText={(t) => setProfile({ ...profile, location: t })}
                />
                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
                  <Text style={styles.saveText}>Save Profile</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.name}>{profile.name}</Text>
                <Text style={styles.detail}>{profile.email}</Text>
                <Text style={styles.detail}>{profile.phone}</Text>
                <Text style={styles.detail}>{profile.location}</Text>
              </>
            )}
          </View>
        </View>

        {/* --- Availability --- */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <Switch
              value={isAvailable}
              onValueChange={setIsAvailable}
              trackColor={{ false: "#ccc", true: "#f8a831" }}
              thumbColor={isAvailable ? "#fff" : "#f4f3f4"}
            />
          </View>
          <Text style={styles.sectionDesc}>
            {isAvailable
              ? "You are currently available for delivery orders."
              : "You are currently offline."}
          </Text>
        </View>

        {/* --- Notification Settings --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          <Text style={styles.sectionDesc}>
            Manage alerts and reminders for orders and updates.
          </Text>
          <TouchableOpacity style={styles.settingBtn}>
            <Ionicons name="notifications-outline" size={22} color="#f8a831" />
            <Text style={styles.settingText}>Customize Notifications</Text>
          </TouchableOpacity>
        </View>

        {/* --- Help & Support --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Help Center</Text>
          <TouchableOpacity style={styles.settingBtn}>
            <Ionicons name="chatbubbles-outline" size={22} color="#f8a831" />
            <Text style={styles.settingText}>Live Chat Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingBtn}>
            <Ionicons name="help-circle-outline" size={22} color="#f8a831" />
            <Text style={styles.settingText}>FAQ & Tutorials</Text>
          </TouchableOpacity>
        </View>

        {/* --- Logout Button --- */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* --- Bottom Nav --- */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => router.push("/agent/dashboard")}>
          <Ionicons name="home-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="delivery-dining" size={26} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person" size={26} color="#f8a831" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff9ed" },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0e249",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  topTitle: { fontSize: 18, fontWeight: "700", color: "#333" },
  scroll: { padding: 20, paddingBottom: 100 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    borderColor: "#ffe38f",
    borderWidth: 1,
  },
  avatar: { width: 80, height: 80, borderRadius: 40, marginRight: 15 },
  infoContainer: { flex: 1 },
  name: { fontSize: 18, fontWeight: "600", color: "#333" },
  detail: { fontSize: 13, color: "#666", marginTop: 3 },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginVertical: 6,
    paddingVertical: 4,
    fontSize: 14,
    color: "#333",
  },
  saveBtn: {
    backgroundColor: "#f8a831",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  saveText: { color: "#fff", fontWeight: "600" },
  section: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    borderColor: "#ffe38f",
    borderWidth: 1,
  },
  sectionTitle: { fontSize: 15, fontWeight: "600", color: "#333" },
  sectionDesc: { fontSize: 13, color: "#777", marginTop: 4 },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  settingText: { fontSize: 14, color: "#555", marginLeft: 8 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f44336",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  logoutText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    elevation: 8,
  },
});
