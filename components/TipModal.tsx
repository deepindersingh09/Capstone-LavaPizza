import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createEarning } from "@/lib/services/firestoreService";
import type { Order } from "@/types/models";

const TIP_PRESETS = [0, 2, 5, 10];

interface TipModalProps {
  order: Order;
  visible: boolean;
  onClose: () => void;
}

export function TipModal({ order, visible, onClose }: TipModalProps) {
  const { theme, spacing, borderRadius, fontSize } = useTheme();
  const [selectedTip, setSelectedTip] = useState(0);
  const [customTip, setCustomTip] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const tipAmount = customTip ? parseFloat(customTip) : selectedTip;

    if (isNaN(tipAmount) || tipAmount < 0) return;

    setSubmitting(true);

    try {
      // Update order with tip
      const orderRef = doc(db, "orders", order.id);
      await updateDoc(orderRef, {
        tip: tipAmount,
        total: order.subtotal + order.deliveryFee + order.tax + tipAmount,
      });

      // Create earning for agent
      if (order.assignedAgentId) {
        await createEarning({
          agentId: order.assignedAgentId,
          orderId: order.id,
          amount: order.deliveryFee,
          tip: tipAmount,
          total: order.deliveryFee + tipAmount,
        });
      }

      onClose();
    } catch (error) {
      console.error("Error submitting tip:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View
          style={[
            styles.modal,
            {
              backgroundColor: theme.surface,
              borderRadius: borderRadius.lg,
              padding: spacing.xl,
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={{ color: theme.text, fontSize: fontSize.xl, fontWeight: "800" }}>
              Add a Tip 💛
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <Text style={{ color: theme.textSecondary, fontSize: fontSize.md, marginTop: spacing.sm }}>
            Show your appreciation for great service!
          </Text>

          <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.xl }}>
            {TIP_PRESETS.map((amount) => (
              <TouchableOpacity
                key={amount}
                onPress={() => {
                  setSelectedTip(amount);
                  setCustomTip("");
                }}
                style={{
                  flex: 1,
                  backgroundColor: selectedTip === amount ? theme.primary : theme.background,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: selectedTip === amount ? theme.primary : theme.border,
                }}
              >
                <Text
                  style={{
                    color: selectedTip === amount ? theme.textInverse : theme.text,
                    fontSize: fontSize.md,
                    fontWeight: "700",
                  }}
                >
                  ${amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={{ color: theme.textSecondary, fontSize: fontSize.sm, marginTop: spacing.lg }}>
            Or enter custom amount:
          </Text>
          <TextInput
            value={customTip}
            onChangeText={(text) => {
              setCustomTip(text);
              setSelectedTip(-1);
            }}
            placeholder="$0.00"
            placeholderTextColor={theme.textTertiary}
            keyboardType="decimal-pad"
            style={{
              backgroundColor: theme.background,
              color: theme.text,
              padding: spacing.md,
              borderRadius: borderRadius.md,
              fontSize: fontSize.lg,
              marginTop: spacing.sm,
              borderWidth: 1,
              borderColor: theme.border,
            }}
          />

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting}
            style={{
              backgroundColor: theme.primary,
              padding: spacing.lg,
              borderRadius: borderRadius.md,
              alignItems: "center",
              marginTop: spacing.xl,
            }}
          >
            <Text style={{ color: theme.textInverse, fontSize: fontSize.lg, fontWeight: "700" }}>
              {submitting ? "Processing..." : "Confirm Tip"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
