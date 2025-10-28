import { router } from "expo-router";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

export default function Cart() {
  const [items, setItems] = useState([
    { id: 1, name: "Fries", price: 6.99, quantity: 1 },
    { id: 2, name: "Lava Tikki", price: 12.99, quantity: 1 },
    { id: 3, name: "Choco Lava Cake", price: 9.98, quantity: 2 },
    {
      id: 4,
      name: "Volcanic Pizza",
      price: 21.99,
      quantity: 1,
      details: ["Medium", "Creamy Garlic Dip", "Gluten Free"],
    },
  ]);

  const increaseQty = (id: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const decreaseQty = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

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
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
              {item.details &&
                item.details.map((detail, index) => (
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

            {/* Delete Button */}
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <MaterialIcons name="delete" size={24} color="#d32f2f" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Subtotal + Checkout */}
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
    backgroundColor: "#fff8f0", // soft light-orange background
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
    shadowColor: "#f8a831", // orange shadow
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
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
