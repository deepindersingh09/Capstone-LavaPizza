// app/checkout.tsx — Fully Functional Checkout with CartContext
import React, { useState, useEffect } from "react";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "./context/CartContext";

// Types
interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: "Visa" | "MasterCard" | "Amex";
  last4: string;
  holderName: string;
  isDefault: boolean;
}

export default function Checkout() {
  const router = useRouter();
  const { items: cartItems, clearCart, getTotal, itemCount } = useCart();

  // State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  // Modals
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Address Form
  const [addressForm, setAddressForm] = useState({
    label: "",
    street: "",
    city: "",
    province: "",
    postalCode: "",
  });

  // Payment Form
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    holderName: "",
    expiryDate: "",
    cvv: "",
  });

  // Constants
  const DELIVERY_FEE = 0; // No delivery fee
  const TAX_RATE = 0.05; // 5% GST

  // Load data on mount
  useEffect(() => {
    loadCheckoutData();
  }, []);

  const loadCheckoutData = async () => {
    try {
      setLoading(true);

      // Load addresses
      const addressData = await AsyncStorage.getItem("@addresses");
      if (addressData) {
        const addrs = JSON.parse(addressData);
        setAddresses(addrs);
        const defaultAddr = addrs.find((a: Address) => a.isDefault);
        if (defaultAddr) setSelectedAddress(defaultAddr.id);
      } else {
        // Set default address if none exist
        const defaultAddress: Address = {
          id: "addr1",
          label: "Home",
          street: "1301 - 16 Avenue Northwest",
          city: "Calgary",
          province: "AB",
          postalCode: "T2M 0L4",
          isDefault: true,
        };
        setAddresses([defaultAddress]);
        setSelectedAddress(defaultAddress.id);
        await AsyncStorage.setItem("@addresses", JSON.stringify([defaultAddress]));
      }

      // Load payment methods
      const paymentData = await AsyncStorage.getItem("@payment_methods");
      if (paymentData) {
        const methods = JSON.parse(paymentData);
        setPaymentMethods(methods);
        const defaultMethod = methods.find((m: PaymentMethod) => m.isDefault);
        if (defaultMethod) setSelectedPayment(defaultMethod.id);
      } else {
        // Set default payment methods
        const defaultMethods: PaymentMethod[] = [
          {
            id: "pay1",
            type: "MasterCard",
            last4: "9876",
            holderName: "Zaiden",
            isDefault: true,
          },
          {
            id: "pay2",
            type: "Visa",
            last4: "5432",
            holderName: "Zaiden",
            isDefault: false,
          },
        ];
        setPaymentMethods(defaultMethods);
        setSelectedPayment(defaultMethods[0].id);
        await AsyncStorage.setItem("@payment_methods", JSON.stringify(defaultMethods));
      }
    } catch (error) {
      console.error("Error loading checkout data:", error);
      Alert.alert("Error", "Failed to load checkout data");
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const subtotal = getTotal();
  const tax = subtotal * TAX_RATE;
  const total = subtotal + DELIVERY_FEE + tax;

  // Get selected address and payment
  const currentAddress = addresses.find((a) => a.id === selectedAddress);
  const currentPayment = paymentMethods.find((p) => p.id === selectedPayment);

  // Add new address
  const handleAddAddress = async () => {
    if (!addressForm.label || !addressForm.street || !addressForm.city || !addressForm.province || !addressForm.postalCode) {
      Alert.alert("Missing Information", "Please fill in all address fields");
      return;
    }

    const newAddress: Address = {
      id: `addr${Date.now()}`,
      label: addressForm.label,
      street: addressForm.street,
      city: addressForm.city,
      province: addressForm.province,
      postalCode: addressForm.postalCode,
      isDefault: addresses.length === 0,
    };

    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses);
    await AsyncStorage.setItem("@addresses", JSON.stringify(updatedAddresses));

    if (addresses.length === 0) {
      setSelectedAddress(newAddress.id);
    }

    setAddressForm({ label: "", street: "", city: "", province: "", postalCode: "" });
    setShowAddressForm(false);
    Alert.alert("Success", "Address added successfully");
  };

  // Add new payment method
  const handleAddPayment = async () => {
    if (!paymentForm.cardNumber || !paymentForm.holderName || !paymentForm.expiryDate || !paymentForm.cvv) {
      Alert.alert("Missing Information", "Please fill in all payment fields");
      return;
    }

    // Basic card validation
    if (paymentForm.cardNumber.length < 16) {
      Alert.alert("Invalid Card", "Please enter a valid card number");
      return;
    }

    // Detect card type
    let cardType: "Visa" | "MasterCard" | "Amex" = "Visa";
    if (paymentForm.cardNumber.startsWith("5")) cardType = "MasterCard";
    else if (paymentForm.cardNumber.startsWith("34") || paymentForm.cardNumber.startsWith("37")) cardType = "Amex";

    const newPayment: PaymentMethod = {
      id: `pay${Date.now()}`,
      type: cardType,
      last4: paymentForm.cardNumber.slice(-4),
      holderName: paymentForm.holderName,
      isDefault: paymentMethods.length === 0,
    };

    const updatedPayments = [...paymentMethods, newPayment];
    setPaymentMethods(updatedPayments);
    await AsyncStorage.setItem("@payment_methods", JSON.stringify(updatedPayments));

    if (paymentMethods.length === 0) {
      setSelectedPayment(newPayment.id);
    }

    setPaymentForm({ cardNumber: "", holderName: "", expiryDate: "", cvv: "" });
    setShowPaymentForm(false);
    Alert.alert("Success", "Payment method added successfully");
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Empty Cart", "Your cart is empty");
      return;
    }

    if (!selectedAddress) {
      Alert.alert("No Address", "Please select a delivery address");
      return;
    }

    if (!selectedPayment) {
      Alert.alert("No Payment Method", "Please select a payment method");
      return;
    }

    Alert.alert(
      "Confirm Order",
      `Place order for $${total.toFixed(2)} (including 5% GST)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            setPlacing(true);
            try {
              // Simulate API call
              await new Promise((resolve) => setTimeout(resolve, 2000));

              // Create order
              const order = {
                id: `order${Date.now()}`,
                items: cartItems,
                address: currentAddress,
                payment: currentPayment,
                subtotal,
                deliveryFee: DELIVERY_FEE,
                tax,
                total,
                status: "confirmed",
                createdAt: new Date().toISOString(),
              };

              // Save order history
              const ordersData = await AsyncStorage.getItem("@order_history");
              const orders = ordersData ? JSON.parse(ordersData) : [];
              orders.unshift(order);
              await AsyncStorage.setItem("@order_history", JSON.stringify(orders));

              // Clear cart using CartContext
              clearCart();

              setPlacing(false);

              Alert.alert(
                "Order Placed! 🎉",
                `Your order #${order.id.slice(-6)} has been confirmed and will be delivered soon.`,
                [
                  {
                    text: "View Orders",
                    onPress: () => router.push("/orders"),
                  },
                  {
                    text: "Continue Shopping",
                    onPress: () => router.push("/"),
                  },
                ]
              );
            } catch (error) {
              setPlacing(false);
              console.error("Order error:", error);
              Alert.alert("Error", "Failed to place order. Please try again.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#FFC107" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <TouchableOpacity onPress={() => router.push("/cart")}>
          <View>
            <Ionicons name="cart-outline" size={26} color="black" />
            {itemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{itemCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Cart Items Count */}
      <View style={styles.cartInfo}>
        <Ionicons name="bag-handle-outline" size={20} color="#666" />
        <Text style={styles.cartInfoText}>
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in cart • Total includes 5% GST
        </Text>
      </View>

      {/* Address Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        {currentAddress ? (
          <TouchableOpacity
            style={styles.addressCard}
            onPress={() => setShowAddressModal(true)}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.addressHeader}>
                <Text style={styles.addressLabel}>{currentAddress.label}</Text>
                {currentAddress.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={styles.addressText}>
                {currentAddress.street}
                {"\n"}
                {currentAddress.city}, {currentAddress.province}
                {"\n"}
                {currentAddress.postalCode}
              </Text>
            </View>
            <MaterialIcons name="edit" size={20} color="#FFC107" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddressForm(true)}
          >
            <Ionicons name="add-circle-outline" size={24} color="#FFC107" />
            <Text style={styles.addButtonText}>Add Address</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Payment Method Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        {currentPayment ? (
          <TouchableOpacity
            style={styles.paymentCard}
            onPress={() => setShowPaymentModal(true)}
          >
            <View style={styles.paymentInfo}>
              <MaterialIcons name="credit-card" size={24} color="black" />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.paymentType}>
                  {currentPayment.type} •••• {currentPayment.last4}
                </Text>
                <Text style={styles.paymentHolder}>{currentPayment.holderName}</Text>
              </View>
            </View>
            <MaterialIcons name="edit" size={20} color="#FFC107" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowPaymentForm(true)}
          >
            <Ionicons name="add-circle-outline" size={24} color="#FFC107" />
            <Text style={styles.addButtonText}>Add Payment Method</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Order Summary */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>GST (5%)</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total (inc. tax)</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Place Order Button */}
      <TouchableOpacity
        style={[styles.placeOrderBtn, placing && styles.placeOrderBtnDisabled]}
        onPress={handlePlaceOrder}
        disabled={placing || cartItems.length === 0}
      >
        {placing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.placeOrderText}>Place Order • ${total.toFixed(2)} (inc. tax)</Text>
        )}
      </TouchableOpacity>

      {/* Address Selection Modal */}
      <Modal visible={showAddressModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Address</Text>
              <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {addresses.map((addr) => (
                <TouchableOpacity
                  key={addr.id}
                  style={[
                    styles.modalOption,
                    selectedAddress === addr.id && styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedAddress(addr.id);
                    setShowAddressModal(false);
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.optionLabel}>{addr.label}</Text>
                    <Text style={styles.optionText}>
                      {addr.street}, {addr.city}, {addr.province} {addr.postalCode}
                    </Text>
                  </View>
                  <MaterialIcons
                    name={
                      selectedAddress === addr.id
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={24}
                    color={selectedAddress === addr.id ? "#FFC107" : "gray"}
                  />
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.addNewButton}
                onPress={() => {
                  setShowAddressModal(false);
                  setShowAddressForm(true);
                }}
              >
                <Ionicons name="add-circle-outline" size={24} color="#FFC107" />
                <Text style={styles.addNewText}>Add New Address</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Payment Selection Modal */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Payment</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.modalOption,
                    selectedPayment === method.id && styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedPayment(method.id);
                    setShowPaymentModal(false);
                  }}
                >
                  <View style={styles.paymentInfo}>
                    <MaterialIcons name="credit-card" size={24} color="black" />
                    <View style={{ marginLeft: 12 }}>
                      <Text style={styles.optionLabel}>
                        {method.type} •••• {method.last4}
                      </Text>
                      <Text style={styles.optionText}>{method.holderName}</Text>
                    </View>
                  </View>
                  <MaterialIcons
                    name={
                      selectedPayment === method.id
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={24}
                    color={selectedPayment === method.id ? "#FFC107" : "gray"}
                  />
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.addNewButton}
                onPress={() => {
                  setShowPaymentModal(false);
                  setShowPaymentForm(true);
                }}
              >
                <Ionicons name="add-circle-outline" size={24} color="#FFC107" />
                <Text style={styles.addNewText}>Add New Payment Method</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Address Form Modal */}
      <Modal visible={showAddressForm} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Address</Text>
              <TouchableOpacity onPress={() => setShowAddressForm(false)}>
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.formScroll}>
              <TextInput
                style={styles.input}
                placeholder="Label (e.g., Home, Office)"
                value={addressForm.label}
                onChangeText={(text) => setAddressForm({ ...addressForm, label: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Street Address"
                value={addressForm.street}
                onChangeText={(text) => setAddressForm({ ...addressForm, street: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="City"
                value={addressForm.city}
                onChangeText={(text) => setAddressForm({ ...addressForm, city: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Province"
                value={addressForm.province}
                onChangeText={(text) => setAddressForm({ ...addressForm, province: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Postal Code"
                value={addressForm.postalCode}
                onChangeText={(text) => setAddressForm({ ...addressForm, postalCode: text })}
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleAddAddress}>
                <Text style={styles.submitButtonText}>Add Address</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Payment Form Modal */}
      <Modal visible={showPaymentForm} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Payment Method</Text>
              <TouchableOpacity onPress={() => setShowPaymentForm(false)}>
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.formScroll}>
              <TextInput
                style={styles.input}
                placeholder="Card Number"
                keyboardType="numeric"
                maxLength={16}
                value={paymentForm.cardNumber}
                onChangeText={(text) =>
                  setPaymentForm({ ...paymentForm, cardNumber: text.replace(/\D/g, "") })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Cardholder Name"
                value={paymentForm.holderName}
                onChangeText={(text) => setPaymentForm({ ...paymentForm, holderName: text })}
              />
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 8 }]}
                  placeholder="MM/YY"
                  maxLength={5}
                  value={paymentForm.expiryDate}
                  onChangeText={(text) => setPaymentForm({ ...paymentForm, expiryDate: text })}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="CVV"
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                  value={paymentForm.cvv}
                  onChangeText={(text) =>
                    setPaymentForm({ ...paymentForm, cvv: text.replace(/\D/g, "") })
                  }
                />
              </View>
              <TouchableOpacity style={styles.submitButton} onPress={handleAddPayment}>
                <Text style={styles.submitButtonText}>Add Payment Method</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cartBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF5252",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  cartInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  cartInfoText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  addressCard: {
    flexDirection: "row",
    backgroundColor: "#FFFBF5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: "#FFC107",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
  },
  addressText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  paymentCard: {
    flexDirection: "row",
    backgroundColor: "#FFFBF5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentType: {
    fontSize: 15,
    fontWeight: "600",
  },
  paymentHolder: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF8E1",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#FFE082",
    borderStyle: "dashed",
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#F4B400",
  },
  summarySection: {
    marginBottom: 24,
  },
  summaryBox: {
    backgroundColor: "#FFFBF5",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#666",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#FFE082",
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFC107",
  },
  placeOrderBtn: {
    backgroundColor: "#FFC107",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 32,
    shadowColor: "#FFC107",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  placeOrderBtnDisabled: {
    opacity: 0.6,
  },
  placeOrderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  modalOptionSelected: {
    borderColor: "#FFC107",
    backgroundColor: "#FFFBF5",
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  optionText: {
    fontSize: 13,
    color: "#666",
  },
  addNewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    marginTop: 8,
  },
  addNewText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#F4B400",
  },
  formScroll: {
    maxHeight: 400,
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  inputRow: {
    flexDirection: "row",
  },
  submitButton: {
    backgroundColor: "#FFC107",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
});