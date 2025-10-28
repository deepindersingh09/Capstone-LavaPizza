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

  const subtotal = getTotal().toFixed(2);

  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.emptyText}>Loading cart...</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>Your cart is empty</Text>
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
        <Text style={styles.headerTitle}>My Cart</Text>
        <Text style={styles.itemCount}>{items.length} items</Text>
      </View>

      {/* Cart Items */}
      <ScrollView style={{ flex: 1 }}>
        {items.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              {item.size && <Text style={styles.itemDetail}>Size: {item.size}</Text>}
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>

              {item.details?.map((detail, index) => (
                <Text key={index} style={styles.itemDetail}>
                  • {detail}
                </Text>
              ))}
            </View>

            {/* Quantity Controls */}
            <View style={styles.qtyContainer}>
              <TouchableOpacity style={styles.qtyButton} onPress={() => increaseQty(item.id)}>
                <Text style={styles.qtyText}>+</Text>
              </TouchableOpacity>

              <Text style={styles.qtyValue}>{item.quantity}</Text>

              <TouchableOpacity style={styles.qtyButton} onPress={() => decreaseQty(item.id)}>
                <Text style={styles.qtyText}>-</Text>
              </TouchableOpacity>
            </View>

            {/* Delete */}
            <TouchableOpacity onPress={() => handleRemove(item.id, item.name)}>
              <MaterialIcons name="delete" size={24} color="#d32f2f" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.subtotal}>Subtotal: ${subtotal}</Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push("/checkout")}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8f0",
    padding: 16,
    paddingTop: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fcac2bff",
  },
  itemCount: {
    fontSize: 14,
    color: "#555",
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  itemPrice: {
    fontSize: 14,
    marginBottom: 4,
    color: "#5D4037",
  },
  itemDetail: {
    fontSize: 12,
    color: "#777",
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  qtyButton: {
    backgroundColor: "#f8a831",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  qtyValue: {
    marginHorizontal: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  footer: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  subtotal: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#5D4037",
  },
  checkoutButton: {
    backgroundColor: "#fc7915ff",
    padding: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
