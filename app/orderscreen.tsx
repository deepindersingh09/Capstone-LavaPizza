import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function OrderScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Order Information</Text>
      <Text style={styles.orderId}>Order ID: 43ae568z</Text>

      <View style={styles.addressBox}>
        <Text style={styles.address}>
          1301 16 Ave NW, Calgary, AB T2M 0L4{"\n"}
          Zaiden{"\n"}+1 (825)-123-0645
        </Text>
      </View>

      <View style={styles.items}>
        <Text>Paneer Wrap ........ $9.99</Text>
        <Text>Greek Salad ........ $7.99</Text>
        <Text>Cheese Cake ........ $4.99</Text>
        <Text>Subtotal ............ $22.97</Text>
        <Text>Shipping Fee ....... $3.95</Text>
        <Text style={styles.total}>Total: $26.92</Text>
      </View>

      <Text style={styles.label}>Special Instructions:</Text>
      <TextInput
        style={styles.instructions}
        placeholder="Please call me when you come. Thank you!"
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Payment")}>
        <Text style={styles.buttonText}>Re-order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 6 },
  orderId: { color: "gray", marginBottom: 12 },
  addressBox: { padding: 12, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginBottom: 16 },
  address: { fontSize: 14 },
  items: { marginBottom: 20 },
  total: { marginTop: 6, fontWeight: "bold", color: "tomato" },
  label: { fontWeight: "bold", marginBottom: 4 },
  instructions: {
    height: 60,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FFD700",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { fontWeight: "bold" },
});
