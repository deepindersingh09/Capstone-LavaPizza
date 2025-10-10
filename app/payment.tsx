import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  StyleSheet,
  Text,
  TextInput, 
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Payment() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cardNumber: "",
    cvv: "",
    expiry: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = () => {
    console.log("Form submitted:", form);
    
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 30 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Add Payment Method</Text>

        {/* First Name */}
        <TextInput
          placeholder="First Name"
          style={styles.input}
          value={form.firstName}
          onChangeText={(text) => handleChange("firstName", text)}
        />

        {/* Last Name */}
        <TextInput
          placeholder="Last Name"
          style={styles.input}
          value={form.lastName}
          onChangeText={(text) => handleChange("lastName", text)}
        />

        {/* Email */}
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={form.email}
          keyboardType="email-address"
          onChangeText={(text) => handleChange("email", text)}
        />

        {/* Phone */}
        <TextInput
          placeholder="Phone number"
          style={styles.input}
          value={form.phone}
          keyboardType="phone-pad"
          onChangeText={(text) => handleChange("phone", text)}
        />

        {/* Card Number */}
        <TextInput
          placeholder="Card number"
          style={styles.input}
          value={form.cardNumber}
          keyboardType="numeric"
          onChangeText={(text) => handleChange("cardNumber", text)}
        />

        {/* CVV */}
        <TextInput
          placeholder="CVV"
          style={styles.input}
          value={form.cvv}
          keyboardType="numeric"
          secureTextEntry
          onChangeText={(text) => handleChange("cvv", text)}
        />

        {/* Expiry */}
        <TextInput
          placeholder="Expiry Date (MM/YY)"
          style={styles.input}
          value={form.expiry}
          onChangeText={(text) => handleChange("expiry", text)}
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>SAVE</Text>
        </TouchableOpacity>
      </ScrollView>
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
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
    fontSize: 16,
    paddingVertical: 8,
  },
  saveButton: {
    backgroundColor: "#FFD700",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "700",
    color: "black",
  },
});
