import { router } from "expo-router";
import React from "react";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotal, isLoading } = useCart();

  const increaseQty = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) updateQuantity(id, item.quantity + 1);
  };

  const decreaseQty = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item && item.quantity > 1) updateQuantity(id, item.quantity - 1);
  };

  const handleRemove = (id: string, name: string) => {
    Alert.alert(
      "Remove Item",
      `Remove ${name} from cart?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => removeItem(id) },
      ]
    );
  };

  const subtotal = getTotal();
  const tax = subtotal * 0.05; // 5% GST
  const total = subtotal + tax;

  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color="#FFC107" />
        <Text style={styles.emptyText}>Loading cart...</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color="#E8E8E8" />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtext}>Add items to get started</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => router.push("/(drawer)/(tabs)/home")}
        >
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Cart</Text>
          <Text style={styles.itemCount}>{items.length} {items.length === 1 ? 'item' : 'items'}</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* Cart Items */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {items.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              {item.size && (
                <View style={styles.sizeContainer}>
                  <Text style={styles.itemDetail}>Size: {item.size}</Text>
                </View>
              )}
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>

              {item.details && item.details.length > 0 && (
                <View style={styles.detailsContainer}>
                  {item.details.map((detail, index) => (
                    <Text key={index} style={styles.itemDetail}>
                      • {detail}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            {/* Quantity Controls */}
            <View style={styles.rightSection}>
              <View style={styles.qtyContainer}>
                <TouchableOpacity 
                  style={styles.qtyButton} 
                  onPress={() => decreaseQty(item.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={16} color="#1A1A1A" />
                </TouchableOpacity>

                <Text style={styles.qtyValue}>{item.quantity}</Text>

                <TouchableOpacity 
                  style={styles.qtyButton} 
                  onPress={() => increaseQty(item.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={16} color="#1A1A1A" />
                </TouchableOpacity>
              </View>

              {/* Item Total */}
              <Text style={styles.itemTotal}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>

              {/* Delete */}
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleRemove(item.id, item.name)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={20} color="#FF5252" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Add some bottom padding */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
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
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.checkoutButton} 
          onPress={() => router.push("/checkout")}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          <Ionicons name="arrow-forward" size={20} color="#1A1A1A" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBF5",
    paddingTop: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFBF5",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
  shopButton: {
    backgroundColor: "#FFC107",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#FFC107",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  sizeContainer: {
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFC107",
    marginBottom: 8,
  },
  detailsContainer: {
    marginTop: 4,
  },
  itemDetail: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBF5",
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#FFE082",
    padding: 4,
  },
  qtyButton: {
    backgroundColor: "#FFC107",
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  qtyValue: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    minWidth: 20,
    textAlign: "center",
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginVertical: 8,
  },
  deleteButton: {
    padding: 4,
  },
  footer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  summaryBox: {
    backgroundColor: "#FFFBF5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#FFE082",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  divider: {
    height: 1,
    backgroundColor: "#FFE082",
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFC107",
  },
  checkoutButton: {
    backgroundColor: "#FFC107",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#FFC107",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
});