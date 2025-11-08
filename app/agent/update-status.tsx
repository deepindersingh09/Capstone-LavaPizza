import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";

export default function UpdateStatus() {
  const [status, setStatus] = useState("Accepted");
  const [location, setLocation] = useState<any>(null);
  const [eta, setEta] = useState("15 mins");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Request location permission and get current position
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          setLoading(false);
          return;
        }

        const currentLoc = await Location.getCurrentPositionAsync({});
        if (currentLoc && currentLoc.coords) {
          setLocation(currentLoc.coords);
        } else {
          setErrorMsg("Unable to fetch location");
        }
      } catch (error: any) {
        setErrorMsg("Error fetching location: " + error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateOrderStatus = (newStatus: string) => {
    setStatus(newStatus);
    Alert.alert("Order Updated", `Order marked as "${newStatus}"`);
  };

  const notifyCustomer = () => {
    Alert.alert("Notification Sent", "Customer has been notified of the update.");
  };

  const callCustomer = () => {
    Linking.openURL("tel:+1234567890");
  };

  const updateETA = () => {
    setEta("10 mins");
    Alert.alert("ETA Updated", "Estimated delivery time adjusted based on traffic.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Order Status</Text>
        <Ionicons name="notifications-outline" size={22} color="#000" />
      </View>

      {/* Order Info */}
      <View style={styles.card}>
        <Text style={styles.title}>Order #12345</Text>
        <Text style={styles.subText}>Customer: Alex Johnson</Text>
        <Text style={styles.subText}>Current Status: {status}</Text>
        <Text style={styles.subText}>ETA: {eta}</Text>
      </View>

      {/* Status Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.statusBtn, status === "Accepted" && styles.activeBtn]}
          onPress={() => updateOrderStatus("Accepted")}
        >
          <Text style={styles.statusText}>Accepted</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statusBtn, status === "On the Way" && styles.activeBtn]}
          onPress={() => updateOrderStatus("On the Way")}
        >
          <Text style={styles.statusText}>On the Way</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statusBtn, status === "Delivered" && styles.activeBtn]}
          onPress={() => updateOrderStatus("Delivered")}
        >
          <Text style={styles.statusText}>Delivered</Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.primaryBtn} onPress={notifyCustomer}>
          <Ionicons name="notifications" size={18} color="#fff" />
          <Text style={styles.primaryText}>Notify Customer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryBtn} onPress={callCustomer}>
          <Ionicons name="call" size={18} color="#fff" />
          <Text style={styles.primaryText}>Call Customer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryBtn} onPress={updateETA}>
          <Ionicons name="time" size={18} color="#fff" />
          <Text style={styles.primaryText}>Update ETA</Text>
        </TouchableOpacity>
      </View>

      {/* Live Tracking Info */}
      <View style={styles.locationBox}>
        {loading ? (
          <ActivityIndicator size="large" color="#f8a831" />
        ) : errorMsg ? (
          <Text style={[styles.locationText, { color: "red" }]}>{errorMsg}</Text>
        ) : location ? (
          <>
            <Text style={styles.locationText}>Current Location:</Text>
            <Text style={styles.coords}>
              Lat: {location.latitude?.toFixed(5)}, Lon:{" "}
              {location.longitude?.toFixed(5)}
            </Text>
          </>
        ) : (
          <Text style={styles.locationText}>Location unavailable</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  card: {
    backgroundColor: "#fff8e1",
    padding: 16,
    borderRadius: 10,
    marginVertical: 16,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },
  subText: {
    color: "#444",
    fontSize: 13,
    marginTop: 4,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  statusBtn: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#eee",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  activeBtn: {
    backgroundColor: "#f8a831",
  },
  statusText: {
    color: "#000",
    fontWeight: "600",
  },
  actionContainer: {
    marginTop: 20,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8a831",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  locationBox: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  locationText: {
    fontWeight: "700",
    color: "#333",
  },
  coords: {
    color: "#555",
    fontSize: 13,
  },
});
