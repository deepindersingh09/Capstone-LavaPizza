import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

export default function HelpSupport() {
  const { theme, spacing, borderRadius, fontSize, elevation } = useTheme();

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [vehicleType, setVehicleType] = useState("Bike");
  const [vehicleNumber, setVehicleNumber] = useState("ABC-1234");
  const [vehicleColor, setVehicleColor] = useState("Red");
  const [issueDescription, setIssueDescription] = useState("");

  const handleUpdateVehicle = () => {
    if (!vehicleNumber.trim() || !vehicleColor.trim()) {
      Alert.alert("Error", "Please fill in all vehicle information.");
      return;
    }
    // TODO: Update vehicle info in backend
    Alert.alert("Success", "Vehicle information updated successfully!");
    setShowVehicleModal(false);
  };

  const handleReportIssue = () => {
    if (!issueDescription.trim()) {
      Alert.alert("Error", "Please describe the issue.");
      return;
    }
    // TODO: Submit issue to support system
    Alert.alert("Success", "Issue reported successfully! Our support team will contact you soon.");
    setShowIssueModal(false);
    setIssueDescription("");
  };

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleEmail = () => {
    Linking.openURL("mailto:support@lavapizza.com?subject=Agent Support Request");
  };

  const handleChat = () => {
    Alert.alert(
      "Live Chat Support",
      "Live chat will be available soon! For immediate assistance, please call us at 1-800-LAVAPIZZA or email support@lavapizza.com",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary, ...elevation.md }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textInverse} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textInverse, fontSize: fontSize.lg }]}>
          Help & Support
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Vehicle Information */}
        <View style={[styles.section, { marginTop: spacing.lg }]}>
          <Text
            style={[
              styles.sectionHeader,
              { color: theme.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.sm },
            ]}
          >
            VEHICLE INFORMATION
          </Text>
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.surface,
                padding: spacing.lg,
                borderRadius: borderRadius.lg,
                ...elevation.sm,
              },
            ]}
          >
            <View style={[styles.vehicleInfo, { marginBottom: spacing.md }]}>
              <View style={[styles.infoRow, { marginBottom: spacing.sm }]}>
                <Ionicons name="car-sport" size={20} color={theme.primary} />
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme.textSecondary, fontSize: fontSize.sm, marginLeft: spacing.sm },
                  ]}
                >
                  Vehicle Type:
                </Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: theme.text, fontSize: fontSize.sm, fontWeight: "600" },
                  ]}
                >
                  {vehicleType}
                </Text>
              </View>
              <View style={[styles.infoRow, { marginBottom: spacing.sm }]}>
                <Ionicons name="card" size={20} color={theme.primary} />
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme.textSecondary, fontSize: fontSize.sm, marginLeft: spacing.sm },
                  ]}
                >
                  License Plate:
                </Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: theme.text, fontSize: fontSize.sm, fontWeight: "600" },
                  ]}
                >
                  {vehicleNumber}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="color-palette" size={20} color={theme.primary} />
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme.textSecondary, fontSize: fontSize.sm, marginLeft: spacing.sm },
                  ]}
                >
                  Color:
                </Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: theme.text, fontSize: fontSize.sm, fontWeight: "600" },
                  ]}
                >
                  {vehicleColor}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: theme.primary,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
              onPress={() => setShowVehicleModal(true)}
            >
              <Ionicons name="create-outline" size={20} color={theme.textInverse} />
              <Text
                style={[
                  styles.buttonText,
                  { color: theme.textInverse, fontSize: fontSize.md, marginLeft: spacing.sm },
                ]}
              >
                Change Vehicle
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={[styles.section, { marginTop: spacing.lg }]}>
          <Text
            style={[
              styles.sectionHeader,
              { color: theme.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.sm },
            ]}
          >
            QUICK ACTIONS
          </Text>
          <View
            style={[
              styles.card,
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
              onPress={() => setShowIssueModal(true)}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.danger + "20" }]}>
                <Ionicons name="warning" size={24} color={theme.danger} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.actionTitle, { color: theme.text, fontSize: fontSize.md }]}>
                  Report an Issue
                </Text>
                <Text
                  style={[
                    styles.actionDescription,
                    { color: theme.textSecondary, fontSize: fontSize.xs },
                  ]}
                >
                  Vehicle problem or app issue
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionRow,
                { padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.border },
              ]}
              onPress={handleChat}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.success + "20" }]}>
                <Ionicons name="chatbubbles" size={24} color={theme.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.actionTitle, { color: theme.text, fontSize: fontSize.md }]}>
                  Live Chat
                </Text>
                <Text
                  style={[
                    styles.actionDescription,
                    { color: theme.textSecondary, fontSize: fontSize.xs },
                  ]}
                >
                  Chat with support team
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionRow, { padding: spacing.lg }]}
              onPress={() => router.push("/agent/shift-schedule" as any)}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.primary + "20" }]}>
                <Ionicons name="calendar" size={24} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.actionTitle, { color: theme.text, fontSize: fontSize.md }]}>
                  Shift Schedule
                </Text>
                <Text
                  style={[
                    styles.actionDescription,
                    { color: theme.textSecondary, fontSize: fontSize.xs },
                  ]}
                >
                  View and manage your shifts
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Support */}
        <View style={[styles.section, { marginTop: spacing.lg }]}>
          <Text
            style={[
              styles.sectionHeader,
              { color: theme.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.sm },
            ]}
          >
            CONTACT SUPPORT
          </Text>
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.surface,
                borderRadius: borderRadius.lg,
                ...elevation.sm,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.contactRow,
                { padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.border },
              ]}
              onPress={() => handleCall("1-800-LAVAPIZZA")}
            >
              <Ionicons name="call" size={22} color={theme.primary} />
              <View style={{ marginLeft: spacing.md }}>
                <Text style={[styles.contactTitle, { color: theme.text, fontSize: fontSize.md }]}>
                  Call Support
                </Text>
                <Text
                  style={[styles.contactValue, { color: theme.primary, fontSize: fontSize.sm }]}
                >
                  1-800-LAVAPIZZA
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.contactRow, { padding: spacing.lg }]}
              onPress={handleEmail}
            >
              <Ionicons name="mail" size={22} color={theme.primary} />
              <View style={{ marginLeft: spacing.md }}>
                <Text style={[styles.contactTitle, { color: theme.text, fontSize: fontSize.md }]}>
                  Email Support
                </Text>
                <Text
                  style={[styles.contactValue, { color: theme.primary, fontSize: fontSize.sm }]}
                >
                  support@lavapizza.com
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ */}
        <View style={[styles.section, { marginTop: spacing.lg, marginBottom: spacing.xl }]}>
          <Text
            style={[
              styles.sectionHeader,
              { color: theme.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.sm },
            ]}
          >
            FREQUENTLY ASKED QUESTIONS
          </Text>
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.surface,
                borderRadius: borderRadius.lg,
                ...elevation.sm,
              },
            ]}
          >
            <View
              style={[
                styles.faqItem,
                { padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.border },
              ]}
            >
              <Text style={[styles.faqQuestion, { color: theme.text, fontSize: fontSize.md }]}>
                How do I accept an order?
              </Text>
              <Text
                style={[
                  styles.faqAnswer,
                  { color: theme.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xs },
                ]}
              >
                Go to the Deliveries tab and tap "Accept" on available orders. Make sure you're
                online to receive orders.
              </Text>
            </View>
            <View
              style={[
                styles.faqItem,
                { padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.border },
              ]}
            >
              <Text style={[styles.faqQuestion, { color: theme.text, fontSize: fontSize.md }]}>
                What if I need to change my vehicle?
              </Text>
              <Text
                style={[
                  styles.faqAnswer,
                  { color: theme.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xs },
                ]}
              >
                Use the "Change Vehicle" button above to update your vehicle information. Changes
                will be reviewed by our team.
              </Text>
            </View>
            <View style={[styles.faqItem, { padding: spacing.lg }]}>
              <Text style={[styles.faqQuestion, { color: theme.text, fontSize: fontSize.md }]}>
                How do I report a vehicle issue?
              </Text>
              <Text
                style={[
                  styles.faqAnswer,
                  { color: theme.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xs },
                ]}
              >
                Tap "Report an Issue" above, describe the problem, and our support team will assist
                you immediately.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Vehicle Update Modal */}
      <Modal visible={showVehicleModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.surface,
                padding: spacing.lg,
                borderRadius: borderRadius.lg,
                ...elevation.lg,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text, fontSize: fontSize.lg }]}>
              Update Vehicle Information
            </Text>

            <Text
              style={[
                styles.inputLabel,
                { color: theme.textSecondary, fontSize: fontSize.sm, marginTop: spacing.md },
              ]}
            >
              Vehicle Type
            </Text>
            <View style={[styles.pickerRow, { marginTop: spacing.sm }]}>
              {["Bike", "Scooter", "Car"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.pickerOption,
                    {
                      backgroundColor: vehicleType === type ? theme.primary : theme.background,
                      padding: spacing.sm,
                      borderRadius: borderRadius.md,
                      flex: 1,
                      marginHorizontal: spacing.xs,
                    },
                  ]}
                  onPress={() => setVehicleType(type)}
                >
                  <Text
                    style={[
                      styles.pickerText,
                      {
                        color: vehicleType === type ? theme.textInverse : theme.text,
                        fontSize: fontSize.sm,
                        textAlign: "center",
                      },
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text
              style={[
                styles.inputLabel,
                { color: theme.textSecondary, fontSize: fontSize.sm, marginTop: spacing.md },
              ]}
            >
              License Plate Number
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.background,
                  color: theme.text,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  marginTop: spacing.sm,
                  fontSize: fontSize.md,
                },
              ]}
              placeholder="ABC-1234"
              placeholderTextColor={theme.textTertiary}
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
              autoCapitalize="characters"
            />

            <Text
              style={[
                styles.inputLabel,
                { color: theme.textSecondary, fontSize: fontSize.sm, marginTop: spacing.md },
              ]}
            >
              Vehicle Color
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.background,
                  color: theme.text,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  marginTop: spacing.sm,
                  fontSize: fontSize.md,
                },
              ]}
              placeholder="Red"
              placeholderTextColor={theme.textTertiary}
              value={vehicleColor}
              onChangeText={setVehicleColor}
            />

            <View style={[styles.modalButtons, { marginTop: spacing.lg }]}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: theme.border,
                    padding: spacing.md,
                    borderRadius: borderRadius.md,
                    flex: 1,
                    marginRight: spacing.sm,
                  },
                ]}
                onPress={() => setShowVehicleModal(false)}
              >
                <Text
                  style={[styles.modalButtonText, { color: theme.text, fontSize: fontSize.md }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: theme.primary,
                    padding: spacing.md,
                    borderRadius: borderRadius.md,
                    flex: 1,
                  },
                ]}
                onPress={handleUpdateVehicle}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    { color: theme.textInverse, fontSize: fontSize.md },
                  ]}
                >
                  Update
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Report Issue Modal */}
      <Modal visible={showIssueModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.surface,
                padding: spacing.lg,
                borderRadius: borderRadius.lg,
                ...elevation.lg,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text, fontSize: fontSize.lg }]}>
              Report an Issue
            </Text>
            <Text
              style={[
                styles.modalDescription,
                { color: theme.textSecondary, fontSize: fontSize.sm, marginTop: spacing.sm },
              ]}
            >
              Please describe the issue you're experiencing:
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.background,
                  color: theme.text,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  marginTop: spacing.md,
                  fontSize: fontSize.md,
                },
              ]}
              placeholder="e.g., Flat tire, engine problem, app crash..."
              placeholderTextColor={theme.textTertiary}
              value={issueDescription}
              onChangeText={setIssueDescription}
              multiline
              numberOfLines={5}
            />
            <View style={[styles.modalButtons, { marginTop: spacing.lg }]}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: theme.border,
                    padding: spacing.md,
                    borderRadius: borderRadius.md,
                    flex: 1,
                    marginRight: spacing.sm,
                  },
                ]}
                onPress={() => {
                  setShowIssueModal(false);
                  setIssueDescription("");
                }}
              >
                <Text
                  style={[styles.modalButtonText, { color: theme.text, fontSize: fontSize.md }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: theme.danger,
                    padding: spacing.md,
                    borderRadius: borderRadius.md,
                    flex: 1,
                  },
                ]}
                onPress={handleReportIssue}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    { color: theme.textInverse, fontSize: fontSize.md },
                  ]}
                >
                  Report
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  card: {},
  vehicleInfo: {},
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    flex: 1,
  },
  infoValue: {},
  button: {},
  buttonText: {
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  actionTitle: {
    fontWeight: "600",
  },
  actionDescription: {
    marginTop: 2,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactTitle: {
    fontWeight: "600",
  },
  contactValue: {
    marginTop: 2,
  },
  faqItem: {},
  faqQuestion: {
    fontWeight: "600",
  },
  faqAnswer: {
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontWeight: "700",
  },
  modalDescription: {
    lineHeight: 20,
  },
  inputLabel: {
    fontWeight: "600",
  },
  pickerRow: {
    flexDirection: "row",
  },
  pickerOption: {},
  pickerText: {
    fontWeight: "600",
  },
  textInput: {},
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
  },
  modalButton: {
    alignItems: "center",
  },
  modalButtonText: {
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
