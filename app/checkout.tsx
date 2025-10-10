import React, { useState } from "react";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity, 
  ScrollView,
} from "react-native"; 
import { useRouter } from "expo-router"; 

export default function Checkout() {  
  const router = useRouter();       
  const [selectedPayment, setSelectedPayment] = useState(1);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Address Section */}
      <View style={styles.addressSection}>
        <View style={{ flex: 1 }}>
          <Text style={styles.addressTitle}>Home</Text>
          <Text style={styles.addressText}>
            1301 - 16 Avenue Northwest{"\n"}Calgary, AB{"\n"}T2M 0L4
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Methods */}
      <Text style={styles.sectionTitle}>Payment Methods</Text>
      {[
        { id: 1, type: "MasterCard", last4: "9876", name: "Zaiden" },
        { id: 2, type: "Visa", last4: "5432", name: "Zaiden" },
        { id: 3, type: "Visa", last4: "1023", name: "Zaiden" },
      ].map((card) => (
        <TouchableOpacity
          key={card.id}
          style={[
            styles.cardRow,
            selectedPayment === card.id && {
              borderColor: "#FFD700",
              borderWidth: 2,
            },
          ]}
          onPress={() => setSelectedPayment(card.id)}
        >
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <MaterialIcons name="credit-card" size={24} color="black" style={{marginRight: 8}}/>
            <View>
              <Text style={styles.cardText}>{card.type} ....{card.last4}</Text>
              <Text style={{color: "gray", fontSize: 13}}>{card.name}</Text>
            </View>

          </View>
          <MaterialIcons
            name={
              selectedPayment === card.id
                ? "radio-button-checked"
                : "radio-button-unchecked"
            }
            size={24}
            color={selectedPayment === card.id ? "#FFD700" : "gray"}
          />
        </TouchableOpacity>
      ))}

      <TouchableOpacity>
        <Text style={styles.addPayment}>Add payment method</Text>
      </TouchableOpacity>

      {/* Order Summary */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>Subtotal </Text>
        <Text style={styles.price}>$61.93</Text>
        <Text style={styles.summaryText}>Delivery Charges </Text>
        <Text style={styles.price}></Text>
        <Text style={styles.summaryText}>Tax </Text>
        <Text style={styles.price}></Text>
        <Text style={styles.totalText}>Total </Text>
        <Text style={styles.totalPrice}>$74.88</Text>
      </View>

      {/* Place Order Button */}
      <TouchableOpacity style={styles.placeOrderBtn}>
        <Text style={styles.placeOrderText}>Place Order $74.88</Text>
      </TouchableOpacity>
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
  backArrow: {
    fontSize: 26,
  },            
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addressSection: {
    flexDirection: "row",
    backgroundColor: "#fdf6e3",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addressText: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#fdf6e3",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 15,
  },
  addPayment: {
    fontSize: 14,
    color: "#FFD700",
    marginBottom: 20,
  },
  summaryBox: {
    backgroundColor: "#fdf6e3",
    borderRadius: 8,
    padding: 16,
    marginTop: 10,
  },
  summaryText: {
    fontSize: 15,
    marginBottom: 6,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  price: {
    position: "absolute",
    right: 16,
  },
  totalPrice: {
    fontWeight: "bold",
  },
  placeOrderBtn: {
    backgroundColor: "#FFD700",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  placeOrderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center", 
  }, 
  iconSpacing: {
    marginRight: 8, 
  },
  cardHolder: {
    color: "gray",
    fontSize: 13, 
  }
});
