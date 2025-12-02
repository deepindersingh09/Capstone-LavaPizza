import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function PayoutPage() {
  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [accountDetails, setAccountDetails] = useState("");
  const [amount, setAmount] = useState("58.00"); // Defaulting to 'Today's' balance for demo

  // --- Step 1: Select Method ---
  const renderMethodSelection = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Payout Method</Text>
      <Text style={styles.stepSubtitle}>Where should we send your money?</Text>

      <TouchableOpacity
        style={[styles.methodCard, selectedMethod === "bank" && styles.selectedMethod]}
        onPress={() => setSelectedMethod("bank")}
        accessible={true}
        accessibilityLabel="Select Bank Transfer"
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="bank-outline" size={28} color={selectedMethod === "bank" ? "#f8a831" : "#555"} />
        </View>
        <View style={styles.methodInfo}>
          <Text style={styles.methodTitle}>Bank Transfer</Text>
          <Text style={styles.methodDesc}>1-3 business days</Text>
        </View>
        <View style={styles.radio}>
          {selectedMethod === "bank" && <View style={styles.radioSelected} />}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.methodCard, selectedMethod === "card" && styles.selectedMethod]}
        onPress={() => setSelectedMethod("card")}
        accessible={true}
        accessibilityLabel="Select Instant Debit Card Transfer"
      >
        <View style={styles.iconContainer}>
          <Ionicons name="card-outline" size={28} color={selectedMethod === "card" ? "#f8a831" : "#555"} />
        </View>
        <View style={styles.methodInfo}>
          <Text style={styles.methodTitle}>Instant to Debit Card</Text>
          <Text style={styles.methodDesc}>Instant • $0.50 fee</Text>
        </View>
        <View style={styles.radio}>
          {selectedMethod === "card" && <View style={styles.radioSelected} />}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.methodCard, selectedMethod === "paypal" && styles.selectedMethod]}
        onPress={() => setSelectedMethod("paypal")}
        accessible={true}
        accessibilityLabel="Select PayPal"
      >
        <View style={styles.iconContainer}>
          <FontAwesome5 name="paypal" size={24} color={selectedMethod === "paypal" ? "#f8a831" : "#555"} />
        </View>
        <View style={styles.methodInfo}>
          <Text style={styles.methodTitle}>PayPal</Text>
          <Text style={styles.methodDesc}>Instant</Text>
        </View>
        <View style={styles.radio}>
          {selectedMethod === "paypal" && <View style={styles.radioSelected} />}
        </View>
      </TouchableOpacity>
    </View>
  );

  // --- Step 2: Enter Details ---
  const renderDetailsInput = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Enter Details</Text>
      <Text style={styles.stepSubtitle}>
        {selectedMethod === "bank" ? "Enter your bank account number." : 
         selectedMethod === "paypal" ? "Enter your PayPal email." : 
         "Enter your card number."}
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Withdrawal Amount</Text>
        <View style={styles.amountInputWrapper}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
            {selectedMethod === "bank" ? "Account Number" : 
             selectedMethod === "paypal" ? "PayPal Email" : "Card Number"}
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder={selectedMethod === "paypal" ? "email@example.com" : "0000 0000 0000 0000"}
          placeholderTextColor="#aaa"
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
      <Text style={styles.stepTitle}>Review Request</Text>
      <Text style={styles.stepSubtitle}>Please confirm the details below.</Text>

      <View style={styles.reviewCard}>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Method</Text>
          <Text style={styles.reviewValue}>
            {selectedMethod === "bank" ? "Bank Transfer" : 
             selectedMethod === "paypal" ? "PayPal" : "Debit Card"}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Destination</Text>
          <Text style={styles.reviewValue}>{accountDetails}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Amount</Text>
          <Text style={styles.reviewValue}>${amount}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Fee</Text>
          <Text style={styles.reviewValue}>{selectedMethod === "card" ? "$0.50" : "$0.00"}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.reviewRow}>
          <Text style={styles.totalLabel}>Total Payout</Text>
          <Text style={styles.totalValue}>
            ${(parseFloat(amount) - (selectedMethod === "card" ? 0.50 : 0)).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  // --- Step 4: Success ---
  const renderSuccess = () => (
    <View style={[styles.stepContainer, { alignItems: 'center', justifyContent: 'center', marginTop: 40 }]}>
      <View style={styles.successIconCircle}>
        <Ionicons name="checkmark" size={50} color="#fff" />
      </View>
      <Text style={styles.successTitle}>Transfer Initiated!</Text>
      <Text style={styles.successDesc}>
        Your payment of ${amount} is on its way. 
        {selectedMethod === "bank" ? " It should arrive in 1-3 business days." : " It should arrive instantly."}
      </Text>
    </View>
  );

  // --- Main Render ---
  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0e249" />
      
      {/* Header */}
      <View style={styles.headerBackground}>
        <SafeAreaView>
          <View style={styles.topBar}>
            {step < 4 && (
                <TouchableOpacity onPress={() => step === 1 ? router.back() : setStep(step - 1)}>
                <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
            )}
            {step === 4 && <View style={{width: 24}} />} 
            
            <Text style={styles.topTitle}>
                {step === 4 ? "Receipt" : "Request Payout"}
            </Text>
            <View style={{ width: 24 }} />
          </View>
        </SafeAreaView>
      </View>

      {/* Progress Bar */}
      {step < 4 && (
        <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${(step / 3) * 100}%` }]} />
        </View>
      )}

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1}}>
        <ScrollView style={styles.contentContainer}>
            {step === 1 && renderMethodSelection()}
            {step === 2 && renderDetailsInput()}
            {step === 3 && renderReview()}
            {step === 4 && renderSuccess()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Action Button */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
            style={[styles.actionBtn, !selectedMethod && step === 1 ? styles.disabledBtn : {}]}
            disabled={!selectedMethod && step === 1}
            onPress={() => {
                if (step === 1 && selectedMethod) setStep(2);
                else if (step === 2) {
                    if(!accountDetails) Alert.alert("Missing Info", "Please enter your account details");
                    else setStep(3);
                }
                else if (step === 3) setStep(4);
                else if (step === 4) router.back();
            }}
        >
            <Text style={styles.actionBtnText}>
                {step === 1 ? "Next Step" : 
                 step === 2 ? "Review" : 
                 step === 3 ? "Confirm Transfer" : "Back to Earnings"}
            </Text>
        </TouchableOpacity>
        <SafeAreaView edges={['bottom']} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#fff9ed" },
  
  // Header
  headerBackground: {
    backgroundColor: "#f0e249",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    elevation: 4,
    zIndex: 10,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  topTitle: { fontSize: 18, fontWeight: "700", color: "#333" },

  // Progress Bar
  progressBarContainer: {
    height: 4,
    backgroundColor: "#ffe38f",
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#f8a831",
  },

  contentContainer: { flex: 1, padding: 20 },
  stepContainer: { flex: 1 },
  stepTitle: { fontSize: 22, fontWeight: "700", color: "#333", marginBottom: 8 },
  stepSubtitle: { fontSize: 14, color: "#666", marginBottom: 24 },

  // Step 1: Methods
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
    elevation: 2,
  },
  selectedMethod: {
    borderColor: "#f8a831",
    backgroundColor: "#fffdf5",
  },
  iconContainer: {
    width: 40,
    alignItems: "center",
  },
  methodInfo: { flex: 1, marginLeft: 10 },
  methodTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  methodDesc: { fontSize: 12, color: "#888", marginTop: 2 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#f8a831",
  },

  // Step 2: Inputs
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#444", marginBottom: 8 },
  textInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: "#333",
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  currencySymbol: { fontSize: 20, fontWeight: '700', color: '#333' },
  amountInput: {
    flex: 1,
    padding: 14,
    fontSize: 20,
    fontWeight: '700',
    color: "#333",
  },

  // Step 3: Review
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },
  reviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  divider: { height: 1, backgroundColor: "#f0f0f0" },
  reviewLabel: { fontSize: 14, color: "#666" },
  reviewValue: { fontSize: 14, fontWeight: "600", color: "#333" },
  totalLabel: { fontSize: 16, fontWeight: "700", color: "#333" },
  totalValue: { fontSize: 18, fontWeight: "800", color: "#f8a831" },

  // Step 4: Success
  successIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    elevation: 5,
  },
  successTitle: { fontSize: 24, fontWeight: "700", color: "#333", marginBottom: 12 },
  successDesc: { fontSize: 15, color: "#666", textAlign: "center", lineHeight: 22 },

  // Bottom Area
  bottomArea: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
  },
  actionBtn: {
    backgroundColor: "#f8a831",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledBtn: {
    backgroundColor: "#ffe38f",
    opacity: 0.7,
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});