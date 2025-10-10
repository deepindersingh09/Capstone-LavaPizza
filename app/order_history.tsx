import React from "react";
import { useRouter } from "expo-router";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

export default function OrderHistory() {
  const router = useRouter();


  const orders = [
    {
      id: 1,
      date: "Yesterday",
      items: [
        { name: "Stuffed Jalapenos", price: 6.99 },
        { name: "Beef Shawarma", price: 13.99 },
      ],
      total: 22.98,
    },
    {
      id: 2,
      date: "Jul 17, 2025",
      items: [
        { name: "Paneer Wrap", price: 9.99 },
        { name: "Greek Salad", price: 7.99 },
        { name: "Cheese Cake", price: 4.99 },
      ],
      total: 26.92,
    },
  ];

  const handleClearHistory = () => {
    console.log("Clear history tapped");
    
  };

  return (
    <View style={styles.container}>
    
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>History</Text>

        <TouchableOpacity onPress={handleClearHistory}>
          <Text style={styles.clearText}>Clear History</Text>
        </TouchableOpacity> 
      </View>

    
      <ScrollView contentContainerStyle={styles.content}>
        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <Text style={styles.orderDate}>{order.date}</Text>
            {order.items.map((item, index) => (
              <View style={styles.itemRow} key={index}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text> 
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

    
      <View style={styles.bottomNav}>
        <Ionicons name="home-outline" size={26} color="black" />
        <Ionicons name="restaurant-outline" size={26} color="black" />
        <Ionicons name="cart-outline" size={26} color="black" />
        <Ionicons name="person-outline" size={26} color="black" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#F7F4E8",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "black",
  },
  clearText: {
    fontSize: 14,
    fontWeight: "500",
    color: "black",
  },
  content: {
    padding: 15,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderDate: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    color: "#555",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    color: "#333",
  },
  itemPrice: {
    fontSize: 16,
    color: "#333",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "700",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "700",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#F7F4E8",
  },
});
