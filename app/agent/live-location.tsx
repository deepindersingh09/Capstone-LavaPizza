import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, SafeAreaView, StatusBar } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

export default function LiveLocation() {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required to show live tracking.");
        setLoading(false);
        return;
      }

      // Get initial location
      const currentLoc = await Location.getCurrentPositionAsync({});
      setLocation(currentLoc.coords);
      setLoading(false);

      // Start watching position updates
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000, // every 3 seconds
          distanceInterval: 5, // or every 5 meters
        },
        (loc) => {
          setLocation(loc.coords);
        }
      );
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#f8a831" />
        <Text style={{ marginTop: 10, color: "#555" }}>Fetching your live location...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Ionicons name="location-outline" size={22} color="#000" />
        <Text style={styles.headerText}>Live Location Tracking</Text>
      </View>

      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You are here"
            description={`Lat: ${location.latitude.toFixed(5)}, Lon: ${location.longitude.toFixed(5)}`}
          />
        </MapView>
      ) : (
        <Text style={styles.noData}>Unable to fetch location.</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 3,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
    color: "#000",
  },
  map: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noData: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});
