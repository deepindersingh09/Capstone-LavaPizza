import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();

  // ---------- States ----------
  const [availability, setAvailability] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("05:00 PM");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [quietHours, setQuietHours] = useState(false);
  const [pushDeals, setPushDeals] = useState(false);
  const [feedback, setFeedback] = useState("");

  // ---------- Days for availability ----------
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <View style={styles.container}>
      {/* --- Top Navbar --- */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Profile Settings</Text>
        <Ionicons name="settings-outline" size={24} color="#333" />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* ----------------- EDIT AVAILABILITY ----------------- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Edit Availability</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Available for orders</Text>
            <Switch
              value={availability}
              onValueChange={setAvailability}
              trackColor={{ true: "#f8a831", false: "#ccc" }}
            />
          </View>

          {availability && (
            <View style={{ marginTop: 10 }}>
              <Text style={styles.label}>Select Day</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {days.map((day) => (
                  <TouchableOpacity
                    key={day}
                    onPress={() => setSelectedDay(day)}
                    style={[
                      styles.dayButton,
                      selectedDay === day && styles.dayButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        selectedDay === day && styles.dayTextActive,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.timeRow}>
                <View style={styles.timeBox}>
                  <Text style={styles.subLabel}>Start Time</Text>
                  <TextInput
                    value={startTime}
                    onChangeText={setStartTime}
                    style={styles.timeInput}
                  />
                </View>
                <View style={styles.timeBox}>
                  <Text style={styles.subLabel}>End Time</Text>
                  <TextInput
                    value={endTime}
                    onChangeText={setEndTime}
                    style={styles.timeInput}
                  />
                </View>
              </View>

              <Text style={[styles.subLabel, { marginTop: 10 }]}>
                Location-based availability
              </Text>
              <TouchableOpacity style={styles.secondaryBtn}>
                <Ionicons name="location-outline" size={18} color="#fff" />
                <Text style={styles.secondaryText}>Use Current Location</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ----------------- NOTIFICATION SETTINGS ----------------- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Enable Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ true: "#f8a831", false: "#ccc" }}
            />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Set Quiet Hours</Text>
            <Switch
              value={quietHours}
              onValueChange={setQuietHours}
              trackColor={{ true: "#f8a831", false: "#ccc" }}
            />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Exclusive Deals & Promotions</Text>
            <Switch
              value={pushDeals}
              onValueChange={setPushDeals}
              trackColor={{ true: "#f8a831", false: "#ccc" }}
            />
          </View>

          <TouchableOpacity style={[styles.secondaryBtn, { marginTop: 12 }]}>
            <Ionicons name="calendar-outline" size={18} color="#fff" />
            <Text style={styles.secondaryText}>
              Integrate with Calendar App
            </Text>
          </TouchableOpacity>
        </View>

        {/* ----------------- SUPPORT & HELP CENTER ----------------- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Support & Help Center</Text>

          <TouchableOpacity style={styles.supportItem}>
            <Ionicons name="chatbubbles-outline" size={20} color="#f8a831" />
            <Text style={styles.supportText}>24/7 Live Chat Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportItem}>
            <Ionicons name="book-outline" size={20} color="#f8a831" />
            <Text style={styles.supportText}>FAQ & Troubleshooting Tips</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportItem}>
            <Ionicons name="videocam-outline" size={20} color="#f8a831" />
            <Text style={styles.supportText}>Video Tutorials</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 12 }}>
            <Text style={styles.subLabel}>Submit Feedback</Text>
            <TextInput
              placeholder="Write your feedback here..."
              value={feedback}
              onChangeText={setFeedback}
              style={styles.feedbackInput}
              multiline
            />
            <TouchableOpacity style={styles.submitBtn}>
              <Text style={styles.submitText}>Submit Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* --- Bottom Navigation --- */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => router.push("/agent/dashboard")}>
          <Ionicons name="home-outline" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity>
          <MaterialIcons name="delivery-dining" size={26} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/agent/profile")}>
          <Ionicons name="person" size={26} color="#f8a831" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff9ed" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#f0e249",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  topTitle: { fontSize: 18, fontWeight: "700", color: "#333" },
  scroll: { padding: 20, paddingBottom: 90 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ffe38f",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  label: { fontSize: 14, color: "#444", fontWeight: "500" },
  subLabel: { fontSize: 13, color: "#555", fontWeight: "500" },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
  dayButton: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 6,
  },
  dayButtonActive: { backgroundColor: "#f8a831" },
  dayText: { fontSize: 13, color: "#333" },
  dayTextActive: { color: "#fff" },

  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  timeBox: { flex: 0.48 },
  timeInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
    backgroundColor: "#fff",
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8a831",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  secondaryText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
  supportItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  supportText: { marginLeft: 8, color: "#333", fontSize: 14 },
  feedbackInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    marginTop: 6,
    height: 80,
    textAlignVertical: "top",
  },
  submitBtn: {
    backgroundColor: "#f8a831",
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "700" },
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
