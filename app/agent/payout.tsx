import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

export default function PayoutPage() {
  const { theme, spacing, borderRadius, fontSize, elevation, isDark } = useTheme();
  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [accountDetails, setAccountDetails] = useState("");
  const [amount, setAmount] = useState("58.00"); // Defaulting to 'Today's' balance for demo

  // --- Step 1: Select Method ---
  const renderMethodSelection = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: theme.text, fontSize: fontSize.xl }]}>
        Select Payout Method
      </Text>
      <Text style={[styles.stepSubtitle, { color: theme.textSecondary, fontSize: fontSize.sm }]}>
        Where should we send your money?
      </Text>

      <TouchableOpacity
        style={[
          styles.methodCard,
          {
            backgroundColor: theme.surface,
            borderColor: selectedMethod === "bank" ? theme.warning : theme.border,
            ...elevation.sm,
          },
        ]}
        onPress={() => setSelectedMethod("bank")}
        accessible={true}
        accessibilityLabel="Select Bank Transfer"
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="bank-outline"
            size={28}
            color={selectedMethod === "bank" ? theme.warning : theme.text}
          />
        </View>
        <View style={styles.methodInfo}>
          <Text style={[styles.methodTitle, { color: theme.text, fontSize: fontSize.md }]}>
            Bank Transfer
          </Text>
          <Text style={[styles.methodDesc, { color: theme.textSecondary, fontSize: fontSize.xs }]}>
            1-3 business days
          </Text>
        </View>
        <View style={[styles.radio, { borderColor: theme.border }]}>
          {selectedMethod === "bank" && (
            <View style={[styles.radioSelected, { backgroundColor: theme.warning }]} />
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.methodCard,
          {
            backgroundColor: theme.surface,
            borderColor: selectedMethod === "card" ? theme.warning : theme.border,
            ...elevation.sm,
          },
        ]}
        onPress={() => setSelectedMethod("card")}
        accessible={true}
        accessibilityLabel="Select Instant Debit Card Transfer"
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name="card-outline"
            size={28}
            color={selectedMethod === "card" ? theme.warning : theme.text}
          />
        </View>
        <View style={styles.methodInfo}>
          <Text style={[styles.methodTitle, { color: theme.text, fontSize: fontSize.md }]}>
            Instant to Debit Card
          </Text>
          <Text style={[styles.methodDesc, { color: theme.textSecondary, fontSize: fontSize.xs }]}>
            Instant • $0.50 fee
          </Text>
        </View>
        <View style={[styles.radio, { borderColor: theme.border }]}>
          {selectedMethod === "card" && (
            <View style={[styles.radioSelected, { backgroundColor: theme.warning }]} />
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.methodCard,
          {
            backgroundColor: theme.surface,
            borderColor: selectedMethod === "paypal" ? theme.warning : theme.border,
            ...elevation.sm,
          },
        ]}
        onPress={() => setSelectedMethod("paypal")}
        accessible={true}
        accessibilityLabel="Select PayPal"
      >
        <View style={styles.iconContainer}>
          <FontAwesome5
            name="paypal"
            size={24}
            color={selectedMethod === "paypal" ? theme.warning : theme.text}
          />
        </View>
        <View style={styles.methodInfo}>
          <Text style={[styles.methodTitle, { color: theme.text, fontSize: fontSize.md }]}>
            PayPal
          </Text>
          <Text style={[styles.methodDesc, { color: theme.textSecondary, fontSize: fontSize.xs }]}>
            Instant
          </Text>
        </View>
        <View style={[styles.radio, { borderColor: theme.border }]}>
          {selectedMethod === "paypal" && (
            <View style={[styles.radioSelected, { backgroundColor: theme.warning }]} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  // --- Step 2: Enter Details ---
  const renderDetailsInput = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: theme.text, fontSize: fontSize.xl }]}>
        Enter Details
      </Text>
      <Text style={[styles.stepSubtitle, { color: theme.textSecondary, fontSize: fontSize.sm }]}>
        {selectedMethod === "bank"
          ? "Enter your bank account number."
          : selectedMethod === "paypal"
            ? "Enter your PayPal email."
            : "Enter your card number."}
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text, fontSize: fontSize.sm }]}>
          Withdrawal Amount
        </Text>
        <View
          style={[
            styles.amountInputWrapper,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.currencySymbol, { color: theme.text, fontSize: fontSize.xl }]}>
            $
          </Text>
          <TextInput
            style={[styles.amountInput, { color: theme.text, fontSize: fontSize.xl }]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholderTextColor={theme.textTertiary}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text, fontSize: fontSize.sm }]}>
          {selectedMethod === "bank"
            ? "Account Number"
            : selectedMethod === "paypal"
              ? "PayPal Email"
              : "Card Number"}
        </Text>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              color: theme.text,
              fontSize: fontSize.md,
            },
          ]}
          placeholder={selectedMethod === "paypal" ? "email@example.com" : "0000 0000 0000 0000"}
          placeholderTextColor={theme.textTertiary}
          value={accountDetails}
          onChangeText={setAccountDetails}
          keyboardType={selectedMethod === "paypal" ? "email-address" : "numeric"}
        />
      </View>
    </View>
  );

  // --- Step 3: Review ---
  const renderReview = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: theme.text, fontSize: fontSize.xl }]}>
        Review Request
      </Text>
      <Text style={[styles.stepSubtitle, { color: theme.textSecondary, fontSize: fontSize.sm }]}>
        Please confirm the details below.
      </Text>

      <View style={[styles.reviewCard, { backgroundColor: theme.surface, ...elevation.sm }]}>
        <View style={styles.reviewRow}>
          <Text style={[styles.reviewLabel, { color: theme.textSecondary, fontSize: fontSize.sm }]}>
            Method
          </Text>
          <Text style={[styles.reviewValue, { color: theme.text, fontSize: fontSize.sm }]}>
            {selectedMethod === "bank"
              ? "Bank Transfer"
              : selectedMethod === "paypal"
                ? "PayPal"
                : "Debit Card"}
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <View style={styles.reviewRow}>
          <Text style={[styles.reviewLabel, { color: theme.textSecondary, fontSize: fontSize.sm }]}>
            Destination
          </Text>
          <Text style={[styles.reviewValue, { color: theme.text, fontSize: fontSize.sm }]}>
            {accountDetails}
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <View style={styles.reviewRow}>
          <Text style={[styles.reviewLabel, { color: theme.textSecondary, fontSize: fontSize.sm }]}>
            Amount
          </Text>
          <Text style={[styles.reviewValue, { color: theme.text, fontSize: fontSize.sm }]}>
            ${amount}
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <View style={styles.reviewRow}>
          <Text style={[styles.reviewLabel, { color: theme.textSecondary, fontSize: fontSize.sm }]}>
            Fee
          </Text>
          <Text style={[styles.reviewValue, { color: theme.text, fontSize: fontSize.sm }]}>
            {selectedMethod === "card" ? "$0.50" : "$0.00"}
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <View style={styles.reviewRow}>
          <Text style={[styles.totalLabel, { color: theme.text, fontSize: fontSize.md }]}>
            Total Payout
          </Text>
          <Text style={[styles.totalValue, { color: theme.warning, fontSize: fontSize.lg }]}>
            ${(parseFloat(amount) - (selectedMethod === "card" ? 0.5 : 0)).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  // --- Step 4: Success ---
  const renderSuccess = () => (
    <View
      style={[
        styles.stepContainer,
        { alignItems: "center", justifyContent: "center", marginTop: 40 },
      ]}
    >
      <View style={[styles.successIconCircle, { backgroundColor: theme.success }]}>
        <Ionicons name="checkmark" size={50} color="#fff" />
      </View>
      <Text style={[styles.successTitle, { color: theme.text, fontSize: fontSize.xxl }]}>
        Transfer Initiated!
      </Text>
      <Text style={[styles.successDesc, { color: theme.textSecondary, fontSize: fontSize.md }]}>
        Your payment of ${amount} is on its way.
        {selectedMethod === "bank"
          ? " It should arrive in 1-3 business days."
          : " It should arrive instantly."}
      </Text>
    </View>
  );

  // --- Main Render ---
  return (
    <View style={[styles.mainContainer, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.primary}
      />

      {/* Header */}
      <View style={[styles.headerBackground, { backgroundColor: theme.primary, ...elevation.md }]}>
        <SafeAreaView>
          <View style={styles.topBar}>
            {step < 4 && (
              <TouchableOpacity onPress={() => (step === 1 ? router.back() : setStep(step - 1))}>
                <Ionicons name="arrow-back" size={24} color={theme.textInverse} />
              </TouchableOpacity>
            )}
            {step === 4 && <View style={{ width: 24 }} />}

            <Text style={[styles.topTitle, { color: theme.textInverse, fontSize: fontSize.lg }]}>
              {step === 4 ? "Receipt" : "Request Payout"}
            </Text>
            <View style={{ width: 24 }} />
          </View>
        </SafeAreaView>
      </View>

      {/* Progress Bar */}
      {step < 4 && (
        <View
          style={[styles.progressBarContainer, { backgroundColor: isDark ? "#3d2f0a" : "#ffe38f" }]}
        >
          <View
            style={[
              styles.progressBarFill,
              { width: `${(step / 3) * 100}%`, backgroundColor: theme.warning },
            ]}
          />
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={{ flex: 1, padding: spacing.lg }}>
          {step === 1 && renderMethodSelection()}
          {step === 2 && renderDetailsInput()}
          {step === 3 && renderReview()}
          {step === 4 && renderSuccess()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Action Button */}
      <View
        style={[styles.bottomArea, { backgroundColor: theme.surface, borderColor: theme.border }]}
      >
        <TouchableOpacity
          style={[
            styles.actionBtn,
            { backgroundColor: theme.warning },
            !selectedMethod && step === 1 ? { opacity: 0.5 } : {},
          ]}
          disabled={!selectedMethod && step === 1}
          onPress={() => {
            if (step === 1 && selectedMethod) setStep(2);
            else if (step === 2) {
              if (!accountDetails) Alert.alert("Missing Info", "Please enter your account details");
              else setStep(3);
            } else if (step === 3) setStep(4);
            else if (step === 4) router.back();
          }}
        >
          <Text style={[styles.actionBtnText, { color: "#fff", fontSize: fontSize.md }]}>
            {step === 1
              ? "Next Step"
              : step === 2
                ? "Review"
                : step === 3
                  ? "Confirm Transfer"
                  : "Back to Earnings"}
          </Text>
        </TouchableOpacity>
        <SafeAreaView edges={["bottom"]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },

  // Header
  headerBackground: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    zIndex: 10,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  topTitle: { fontWeight: "700" },

  // Progress Bar
  progressBarContainer: {
    height: 4,
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
  },

  stepContainer: { flex: 1 },
  stepTitle: { fontWeight: "700", marginBottom: 8 },
  stepSubtitle: { marginBottom: 24 },

  // Step 1: Methods
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  iconContainer: {
    width: 40,
    alignItems: "center",
  },
  methodInfo: { flex: 1, marginLeft: 10 },
  methodTitle: { fontWeight: "600" },
  methodDesc: { marginTop: 2 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // Step 2: Inputs
  inputGroup: { marginBottom: 20 },
  label: { fontWeight: "600", marginBottom: 8 },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
  },
  amountInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  currencySymbol: { fontWeight: "700" },
  amountInput: {
    flex: 1,
    padding: 14,
    fontWeight: "700",
  },

  // Step 3: Review
  reviewCard: {
    borderRadius: 12,
    padding: 20,
  },
  reviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  divider: { height: 1 },
  reviewLabel: {},
  reviewValue: { fontWeight: "600" },
  totalLabel: { fontWeight: "700" },
  totalValue: { fontWeight: "800" },

  // Step 4: Success
  successIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  successTitle: { fontWeight: "700", marginBottom: 12 },
  successDesc: { textAlign: "center", lineHeight: 22 },

  // Bottom Area
  bottomArea: {
    padding: 20,
    borderTopWidth: 1,
  },
  actionBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  actionBtnText: {
    fontWeight: "700",
  },
});
