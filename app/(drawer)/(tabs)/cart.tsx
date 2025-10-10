// By Ravneet Kaur
import { router } from "expo-router";
import React, { useState } from "react";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function Cart() {
  // Cart state
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
    { id: 5, name: "Garlic Bread", price: 15.99, quantity: 1 },
    { id: 6, name: "Samosa Poutine", price: 8.99, quantity: 1 },
    { id: 7, name: "Garlic Bread", price: 15.99, quantity: 1 },
    { id: 8, name: "Samosa Poutine", price: 8.99, quantity: 1 },
    {
      id: 9,
      name: "Volcanic Pizza",
      price: 21.99,
      quantity: 1,
      details: ["Medium", "Creamy Garlic Dip", "Gluten Free"],
    },
  ]);

  // Increase quantity
  const increaseQty = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease quantity
  const decreaseQty = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Remove item
  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Subtotal
  const subtotal = items
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

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
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => increaseQty(item.id)}
              >
                <Text style={styles.qtyText}>+</Text>
              </TouchableOpacity>

              <Text style={styles.qtyValue}>{item.quantity}</Text>

              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => decreaseQty(item.id)}
              >
                <Text style={styles.qtyText}>-</Text>
              </TouchableOpacity>
            </View>

            {/* Delete Button */}
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <MaterialIcons name="delete" size={24} color="black" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Subtotal + Checkout */}
      <View style={styles.footer}>
        <Text style={styles.subtotal}>Subtotal: ${subtotal}</Text>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => router.push("/checkout")}
        >
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemCount: {
    fontSize: 14,
    color: "gray",
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fdf6e3",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemDetail: {
    fontSize: 12,
    color: "gray",
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  qtyButton: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  qtyValue: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  footer: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  subtotal: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  checkoutButton: {
    backgroundColor: "#FFD700",
    padding: 12,
    borderRadius: 6,
    width: "100%",
    alignItems: "center",
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
