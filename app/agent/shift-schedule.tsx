import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

interface Shift {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: "scheduled" | "completed" | "sick" | "absent" | "swapped";
  notes?: string;
}

export default function ShiftSchedule() {
  const { theme, spacing, borderRadius, fontSize, elevation } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [absenceReason, setAbsenceReason] = useState("");
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  // Mock shift data - replace with actual data from your backend
  const shifts: Shift[] = [
    {
      id: "1",
      date: new Date(2025, 11, 10),
      startTime: "09:00 AM",
      endTime: "05:00 PM",
      status: "scheduled",
    },
    {
      id: "2",
      date: new Date(2025, 11, 12),
      startTime: "02:00 PM",
      endTime: "10:00 PM",
      status: "scheduled",
    },
    {
      id: "3",
      date: new Date(2025, 11, 15),
      startTime: "09:00 AM",
      endTime: "05:00 PM",
      status: "completed",
    },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getShiftForDate = (date: Date) => {
    return shifts.find(
      (shift) =>
        shift.date.getDate() === date.getDate() &&
        shift.date.getMonth() === date.getMonth() &&
        shift.date.getFullYear() === date.getFullYear()
    );
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleSickCallIn = (shift: Shift) => {
    Alert.alert("Sick Call-In", "Are you sure you want to call in sick for this shift?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: () => {
          // TODO: Update shift status in backend
          Alert.alert("Success", "Sick leave recorded. Please rest and recover!");
        },
      },
    ]);
  };

  const handleAbsenceRequest = () => {
    if (!absenceReason.trim()) {
      Alert.alert("Error", "Please provide a reason for your absence.");
      return;
    }
    // TODO: Submit absence request to backend
    Alert.alert("Success", "Absence request submitted successfully!");
    setShowAbsenceModal(false);
    setAbsenceReason("");
  };

  const handleSwapShift = () => {
    // TODO: Show list of available agents to swap with
    Alert.alert("Success", "Shift swap request sent to available agents!");
    setShowSwapModal(false);
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const days = [];
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Render week day headers
    const headers = weekDays.map((day) => (
      <View key={day} style={styles.dayHeader}>
        <Text style={[styles.dayHeaderText, { color: theme.textSecondary, fontSize: fontSize.xs }]}>
          {day}
        </Text>
      </View>
    ));

    // Render empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Render days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const shift = getShiftForDate(date);
      const isToday =
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear();
      const isSelected =
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isToday && { backgroundColor: theme.primary + "20" },
            isSelected && { backgroundColor: theme.primary, borderRadius: borderRadius.md },
          ]}
          onPress={() => setSelectedDate(date)}
        >
          <Text
            style={[
              styles.dayText,
              { color: isSelected ? theme.textInverse : theme.text, fontSize: fontSize.sm },
            ]}
          >
            {day}
          </Text>
          {shift && (
            <View
              style={[
                styles.shiftIndicator,
                {
                  backgroundColor:
                    shift.status === "scheduled"
                      ? theme.success
                      : shift.status === "completed"
                        ? theme.primary
                        : theme.danger,
                  borderRadius: borderRadius.sm,
                },
              ]}
            >
              <Text style={[styles.shiftIndicatorText, { fontSize: 8 }]}>
                {shift.status === "scheduled" ? "📅" : shift.status === "completed" ? "✅" : "❌"}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.calendar}>
        <View style={styles.weekDayRow}>{headers}</View>
        <View style={styles.daysGrid}>{days}</View>
      </View>
    );
  };

  const selectedShiftData = getShiftForDate(selectedDate);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary, ...elevation.md }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textInverse} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textInverse, fontSize: fontSize.lg }]}>
          Shift Schedule
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Calendar Header */}
        <View
          style={[
            styles.calendarHeader,
            {
              backgroundColor: theme.surface,
              padding: spacing.md,
              margin: spacing.lg,
              borderRadius: borderRadius.lg,
              ...elevation.sm,
            },
          ]}
        >
          <TouchableOpacity onPress={handlePreviousMonth}>
            <Ionicons name="chevron-back" size={24} color={theme.primary} />
          </TouchableOpacity>
          <Text style={[styles.monthText, { color: theme.text, fontSize: fontSize.lg }]}>
            {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </Text>
          <TouchableOpacity onPress={handleNextMonth}>
            <Ionicons name="chevron-forward" size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        <View
          style={[
            styles.calendarContainer,
            {
              backgroundColor: theme.surface,
              margin: spacing.lg,
              padding: spacing.md,
              borderRadius: borderRadius.lg,
              ...elevation.sm,
            },
          ]}
        >
          {renderCalendar()}
        </View>

        {/* Legend */}
        <View style={[styles.legend, { marginHorizontal: spacing.lg, marginBottom: spacing.md }]}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.success }]} />
            <Text
              style={[styles.legendText, { color: theme.textSecondary, fontSize: fontSize.xs }]}
            >
              Scheduled
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.primary }]} />
            <Text
              style={[styles.legendText, { color: theme.textSecondary, fontSize: fontSize.xs }]}
            >
              Completed
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.danger }]} />
            <Text
              style={[styles.legendText, { color: theme.textSecondary, fontSize: fontSize.xs }]}
            >
              Absent/Sick
            </Text>
          </View>
        </View>

        {/* Shift Details */}
        {selectedShiftData ? (
          <View
            style={[
              styles.shiftDetails,
              {
                backgroundColor: theme.surface,
                margin: spacing.lg,
                padding: spacing.lg,
                borderRadius: borderRadius.lg,
                ...elevation.md,
              },
            ]}
          >
            <Text style={[styles.shiftTitle, { color: theme.text, fontSize: fontSize.lg }]}>
              Shift Details
            </Text>
            <View style={[styles.shiftInfo, { marginTop: spacing.md }]}>
              <Ionicons name="calendar" size={20} color={theme.primary} />
              <Text
                style={[
                  styles.shiftInfoText,
                  { color: theme.textSecondary, fontSize: fontSize.md },
                ]}
              >
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
            <View style={[styles.shiftInfo, { marginTop: spacing.sm }]}>
              <Ionicons name="time" size={20} color={theme.primary} />
              <Text
                style={[
                  styles.shiftInfoText,
                  { color: theme.textSecondary, fontSize: fontSize.md },
                ]}
              >
                {selectedShiftData.startTime} - {selectedShiftData.endTime}
              </Text>
            </View>
            <View style={[styles.shiftInfo, { marginTop: spacing.sm }]}>
              <Ionicons name="information-circle" size={20} color={theme.primary} />
              <Text
                style={[
                  styles.shiftInfoText,
                  { color: theme.textSecondary, fontSize: fontSize.md },
                ]}
              >
                Status:{" "}
                {selectedShiftData.status.charAt(0).toUpperCase() +
                  selectedShiftData.status.slice(1)}
              </Text>
            </View>

            {/* Action Buttons */}
            {selectedShiftData.status === "scheduled" && (
              <View style={[styles.actionButtons, { marginTop: spacing.lg }]}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: theme.danger,
                      padding: spacing.md,
                      borderRadius: borderRadius.md,
                      flex: 1,
                      marginRight: spacing.sm,
                    },
                  ]}
                  onPress={() => handleSickCallIn(selectedShiftData)}
                >
                  <Ionicons name="medkit" size={20} color={theme.textInverse} />
                  <Text
                    style={[
                      styles.actionButtonText,
                      { color: theme.textInverse, fontSize: fontSize.sm },
                    ]}
                  >
                    Sick Call-In
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: theme.warning,
                      padding: spacing.md,
                      borderRadius: borderRadius.md,
                      flex: 1,
                      marginRight: spacing.sm,
                    },
                  ]}
                  onPress={() => {
                    setSelectedShift(selectedShiftData);
                    setShowAbsenceModal(true);
                  }}
                >
                  <Ionicons name="alert-circle" size={20} color={theme.textInverse} />
                  <Text
                    style={[
                      styles.actionButtonText,
                      { color: theme.textInverse, fontSize: fontSize.sm },
                    ]}
                  >
                    Absence
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: theme.primary,
                      padding: spacing.md,
                      borderRadius: borderRadius.md,
                      flex: 1,
                    },
                  ]}
                  onPress={() => {
                    setSelectedShift(selectedShiftData);
                    setShowSwapModal(true);
                  }}
                >
                  <Ionicons name="swap-horizontal" size={20} color={theme.textInverse} />
                  <Text
                    style={[
                      styles.actionButtonText,
                      { color: theme.textInverse, fontSize: fontSize.sm },
                    ]}
                  >
                    Swap Shift
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View
            style={[
              styles.noShift,
              {
                backgroundColor: theme.surface,
                margin: spacing.lg,
                padding: spacing.xl,
                borderRadius: borderRadius.lg,
                ...elevation.sm,
              },
            ]}
          >
            <Ionicons name="calendar-outline" size={48} color={theme.textSecondary} />
            <Text
              style={[
                styles.noShiftText,
                { color: theme.textSecondary, fontSize: fontSize.md, marginTop: spacing.md },
              ]}
            >
              No shift scheduled for this date
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Absence Modal */}
      <Modal visible={showAbsenceModal} transparent animationType="slide">
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
              Request Absence
            </Text>
            <Text
              style={[
                styles.modalDescription,
                { color: theme.textSecondary, fontSize: fontSize.sm, marginTop: spacing.sm },
              ]}
            >
              Please provide a reason for your absence:
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.background,
                  color: theme.text,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  marginTop: spacing.md,
                  fontSize: fontSize.md,
                },
              ]}
              placeholder="e.g., Family emergency, Doctor appointment..."
              placeholderTextColor={theme.textTertiary}
              value={absenceReason}
              onChangeText={setAbsenceReason}
              multiline
              numberOfLines={4}
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
                  setShowAbsenceModal(false);
                  setAbsenceReason("");
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
                    backgroundColor: theme.primary,
                    padding: spacing.md,
                    borderRadius: borderRadius.md,
                    flex: 1,
                  },
                ]}
                onPress={handleAbsenceRequest}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    { color: theme.textInverse, fontSize: fontSize.md },
                  ]}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Swap Shift Modal */}
      <Modal visible={showSwapModal} transparent animationType="slide">
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
              Swap Shift
            </Text>
            <Text
              style={[
                styles.modalDescription,
                { color: theme.textSecondary, fontSize: fontSize.sm, marginTop: spacing.sm },
              ]}
            >
              Your shift swap request will be sent to available agents. You'll be notified when
              someone accepts.
            </Text>
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
                onPress={() => setShowSwapModal(false)}
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
                onPress={handleSwapShift}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    { color: theme.textInverse, fontSize: fontSize.md },
                  ]}
                >
                  Send Request
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
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monthText: {
    fontWeight: "700",
  },
  calendarContainer: {},
  calendar: {},
  weekDayRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  dayHeaderText: {
    fontWeight: "600",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dayText: {
    fontWeight: "500",
  },
  shiftIndicator: {
    position: "absolute",
    bottom: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  shiftIndicatorText: {
    textAlign: "center",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  legendText: {},
  shiftDetails: {},
  shiftTitle: {
    fontWeight: "700",
  },
  shiftInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  shiftInfoText: {
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "row",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    marginLeft: 4,
    fontWeight: "600",
  },
  noShift: {
    alignItems: "center",
  },
  noShiftText: {
    textAlign: "center",
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
  input: {
    minHeight: 100,
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
